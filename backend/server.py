from fastapi import (
    FastAPI,
    APIRouter,
    HTTPException,
    File,
    UploadFile,
    Header
)
from jose import jwt, JWTError
from auth import SECRET_KEY, ALGORITHM

from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
from motor.motor_asyncio import AsyncIOMotorClient

import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import io
import cv2
import numpy as np
from PIL import Image
from gradcam import generate_gradcam
from disease_info import DISEASE_INFO
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from auth import *

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def get_current_user(
    authorization: str = Header(None)
):
    print("=" * 60)
    print("Authorization Header Received:")
    print(repr(authorization))
    print("=" * 60)

    if authorization is None:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Bearer token missing"
        )

    token = authorization.split(" ")[1]

    print("TOKEN =", token)

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("Payload =", payload)

        email = payload.get("email")

        print("Email =", email)

        user = await db.users.find_one({
            "email": email
        })

        print("User =", user)

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except JWTError as e:
        print("JWT ERROR =", e)

        raise HTTPException(
            status_code=401,
            detail="Invalid JWT"
        )
# MongoDB connection

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "test_database")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Pydantic Models
class DatasetCreate(BaseModel):
    name: str
    description: Optional[str] = None
    source: str  # "upload" or "public"

class Dataset(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: Optional[str] = None
    source: str
    images_count: int = 0
    created_at: str

class DatasetImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    dataset_id: str
    storage_path: str
    original_filename: str
    label: Optional[str] = None
    created_at: str

class ModelConfig(BaseModel):
    architecture: str
    dataset_id: str
    hyperparameters: Dict[str, Any] = {}

class ModelInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    architecture: str
    dataset_id: str
    status: str  # "training", "completed", "failed"
    metrics: Dict[str, float] = {}
    hyperparameters: Dict[str, Any] = {}
    created_at: str
    updated_at: str

class Detection(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    plant: str
    disease: str
    status: str
    confidence: float
    severity: float
    cause: str
    symptoms: List[str]
    treatment: List[str]
    created_at: str


class TrainingJob(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    model_id: str
    status: str
    progress: float = 0.0
    current_epoch: int = 0
    total_epochs: int = 10
    logs: List[str] = Field(default_factory=list)
    created_at: str
    updated_at: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


# Helper function to generate XAI heatmap
def generate_xai_heatmap(image_data: bytes, method: str) -> bytes:
    """Generate a simulated XAI heatmap overlay"""
    # Load image
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image data")
    
    # Create heatmap based on method
    h, w = img.shape[:2]
    
    if method == "gradcam":
        # Center-focused heatmap
        y, x = np.ogrid[:h, :w]
        mask = np.exp(-((x - w/2)**2 + (y - h/2)**2) / (min(h, w) * 0.3)**2)
    elif method == "scorecam":
        # Multi-region heatmap
        mask = np.zeros((h, w))
        centers = [(h//3, w//3), (2*h//3, 2*w//3), (h//3, 2*w//3)]
        for cy, cx in centers:
            y, x = np.ogrid[:h, :w]
            m = np.exp(-((x - cx)**2 + (y - cy)**2) / (min(h, w) * 0.2)**2)
            mask += m
    elif method == "shap":
        # Edge-based heatmap
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        mask = cv2.GaussianBlur(edges.astype(float) / 255.0, (21, 21), 0)
    else:  # lime
        # Patch-based heatmap
        mask = np.random.rand(h // 20, w // 20)
        mask = cv2.resize(mask, (w, h))
    
    # Normalize mask
    mask = (mask - mask.min()) / (mask.max() - mask.min() + 1e-8)
    
    # Apply colormap
    heatmap = cv2.applyColorMap((mask * 255).astype(np.uint8), cv2.COLORMAP_JET)
    
    # Blend with original image
    overlay = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
    
    # Encode to bytes
    _, buffer = cv2.imencode('.png', overlay)
    return buffer.tobytes()

# API Endpoints

@api_router.post("/register")
async def register(user: UserRegister):
    try:
        print("REGISTER REQUEST:", user)

        existing = await db.users.find_one({"email": user.email})

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        await db.users.insert_one({
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password)
        })

        print("USER SAVED SUCCESSFULLY")

        return {
            "message": "Registration Successful"
        }

    except Exception as e:
        print("REGISTER ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@api_router.post("/login")
async def login(user: UserLogin):

    dbuser = await db.users.find_one(
        {"email": user.email}
    )

    if not dbuser:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        user.password,
        dbuser["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Wrong Password"
        )

    token = create_token({
        "email": dbuser["email"]
    })

    return {
        "token": token,
        "name": dbuser["name"]
    }


@api_router.get("/")
async def root():
    return {"message": "LeafNet API", "version": "1.0.0"}

# Dataset Endpoints
@api_router.post("/datasets", response_model=Dataset)
async def create_dataset(dataset: DatasetCreate):
    dataset_id = str(uuid.uuid4())
    doc = {
        "id": dataset_id,
        "name": dataset.name,
        "description": dataset.description,
        "source": dataset.source,
        "images_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_deleted": False
    }
    await db.datasets.insert_one(doc)
    return Dataset(**doc)

@api_router.get("/datasets", response_model=List[Dataset])
async def list_datasets():
    datasets = await db.datasets.find({"is_deleted": False}, {"_id": 0}).to_list(1000)
    return datasets

@api_router.get("/datasets/{dataset_id}", response_model=Dataset)
async def get_dataset(dataset_id: str):
    dataset = await db.datasets.find_one({"id": dataset_id, "is_deleted": False}, {"_id": 0})
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@api_router.delete("/datasets/{dataset_id}")
async def delete_dataset(dataset_id: str):
    result = await db.datasets.update_one(
        {"id": dataset_id},
        {"$set": {"is_deleted": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"message": "Dataset deleted"}

# Dataset Images
@api_router.post("/datasets/{dataset_id}/images")
async def upload_dataset_image(dataset_id: str, file: UploadFile = File(...), label: Optional[str] = None):
    # Verify dataset exists
    dataset = await db.datasets.find_one({"id": dataset_id, "is_deleted": False})
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Read and validate image
    data = await file.read()
    try:
        img = Image.open(io.BytesIO(data))
        img.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    # Upload to storage
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    image_id = str(uuid.uuid4())
    
    UPLOAD_DIR = ROOT_DIR/"uploads"
    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = UPLOAD_DIR / filename

    with open(filepath,"wb") as f:
        f.write(data)


    doc = {
    "id":image_id,

    "dataset_id":dataset_id,

    "storage_path":str(filepath),

    "original_filename":file.filename,

    "label":label,

    "created_at":
    datetime.now(timezone.utc).isoformat(),

    "is_deleted":False
    }
    await db.dataset_images.insert_one(doc)
    
    # Update dataset images count
    await db.datasets.update_one(
        {"id": dataset_id},
        {"$inc": {"images_count": 1}}
    )
    
    return DatasetImage(**doc)

@api_router.get("/datasets/{dataset_id}/images", response_model=List[DatasetImage])
async def list_dataset_images(dataset_id: str):
    images = await db.dataset_images.find(
        {"dataset_id": dataset_id, "is_deleted": False},
        {"_id": 0}
    ).to_list(1000)
    return images

# Model Endpoints
@api_router.post("/models", response_model=ModelInfo)
async def create_model(name: str, config: ModelConfig):
    model_id = str(uuid.uuid4())
    doc = {
        "id": model_id,
        "name": name,
        "architecture": config.architecture,
        "dataset_id": config.dataset_id,
        "status": "created",
        "metrics": {},
        "hyperparameters": config.hyperparameters,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_deleted": False
    }
    await db.models.insert_one(doc)
    return ModelInfo(**doc)

@api_router.get("/models", response_model=List[ModelInfo])
async def list_models():
    models = await db.models.find({"is_deleted": False}, {"_id": 0}).to_list(1000)
    return models

@api_router.get("/models/{model_id}", response_model=ModelInfo)
async def get_model(model_id: str):
    model = await db.models.find_one({"id": model_id, "is_deleted": False}, {"_id": 0})
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

# Training Endpoints
@api_router.post("/models/{model_id}/train")
async def train_model(model_id: str, epochs: int = 10):
    model = await db.models.find_one({"id": model_id, "is_deleted": False})
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Create training job
    job_id = str(uuid.uuid4())
    doc = {
        "id": job_id,
        "model_id": model_id,
        "status": "running",
        "progress": 0.0,
        "current_epoch": 0,
        "total_epochs": epochs,
        "logs": [f"Training started at {datetime.now(timezone.utc).isoformat()}"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.training_jobs.insert_one(doc)
    
    # Update model status
    await db.models.update_one(
        {"id": model_id},
        {"$set": {"status": "training", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return TrainingJob(**doc)

@api_router.get("/training/{job_id}", response_model=TrainingJob)
async def get_training_job(job_id: str):
    job = await db.training_jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Training job not found")
    return job

@api_router.post("/training/{job_id}/simulate")
async def simulate_training_progress(job_id: str):
    """Simulate training progress for demo purposes"""
    job = await db.training_jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    if job["status"] == "running":
        current_epoch = job["current_epoch"] + 1
        total_epochs = job["total_epochs"]
        progress = (current_epoch / total_epochs) * 100
        
        # Simulate metrics
        train_loss = 0.5 * (1 - current_epoch / total_epochs) + np.random.rand() * 0.1
        val_acc = 0.7 + (current_epoch / total_epochs) * 0.25 + np.random.rand() * 0.05
        
        logs = job["logs"] + [
            f"Epoch {current_epoch}/{total_epochs} - loss: {train_loss:.4f} - val_acc: {val_acc:.4f}"
        ]
        
        status = "completed" if current_epoch >= total_epochs else "running"
        
        update_doc = {
            "status": status,
            "progress": progress,
            "current_epoch": current_epoch,
            "logs": logs,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.training_jobs.update_one({"id": job_id}, {"$set": update_doc})
        
        # Update model if completed
        if status == "completed":
            metrics = {
                "accuracy": round(val_acc, 4),
                "loss": round(train_loss, 4),
                "precision": round(0.85 + np.random.rand() * 0.1, 4),
                "recall": round(0.82 + np.random.rand() * 0.1, 4),
                "f1_score": round(0.83 + np.random.rand() * 0.1, 4)
            }
            await db.models.update_one(
                {"id": job["model_id"]},
                {"$set": {
                    "status": "completed",
                    "metrics": metrics,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        return {"status": status, "progress": progress, "current_epoch": current_epoch}
    
    return {"status": job["status"], "progress": job["progress"]}



def calculate_severity(image_np):
    try:

        hsv = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)

        lower = np.array([10, 50, 50])
        upper = np.array([35, 255, 255])

        mask = cv2.inRange(hsv, lower, upper)

        infected_pixels = np.sum(mask > 0)

        total_pixels = image_np.shape[0] * image_np.shape[1]
        
        if total_pixels == 0:
            return 0.0
        severity = (infected_pixels / total_pixels) * 100

        return round(severity, 2)
    except:
        return 0.0

def overlay_heatmap(heatmap, image_np):

    heatmap = cv2.resize(
        heatmap,
        (image_np.shape[1], image_np.shape[0])
    )

    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(
        heatmap,
        cv2.COLORMAP_JET
    )

    overlay = cv2.addWeighted(
        image_np,
        0.6,
        heatmap,
        0.4,
        0
    )

    return overlay    


# Inference Endpoints
import tensorflow as tf


# Load trained model once
import gdown

MODEL_PATH = ROOT_DIR / "leaf_model.h5"

MODEL_URL = "https://drive.google.com/uc?id=1NStjvW9iWA3Fna0xVG7TaX-RfNvrj6CM"

# Download automatically if model doesn't exist
if not MODEL_PATH.exists():
    print("Downloading model from Google Drive...")
    gdown.download(
        MODEL_URL,
        str(MODEL_PATH),
        quiet=False
    )
    print("Model downloaded successfully.")

try:
    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False,
        safe_mode=False
    )

    print("\nLayers")
    for layer in model.layers:
        print(layer.name)

    print(model.summary())

except Exception as e:
    model = None
    logger.warning(f"Failed to load model: {e}")
# Print model type
print(type(model))

# Your class names
class_names = [
    "Papaya_healthy",
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy",
    "papaya_diseased_spots"
]

@api_router.post("/inference")
async def detect_disease(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    user = await get_current_user(authorization)
    try:
        # Read image
        image = Image.open(file.file).convert("RGB")
        image = image.resize((224, 224))

        img_array = np.array(image) / 255.0
        original_np = np.array(image)

        severity = calculate_severity(original_np)

        img_array = np.expand_dims(img_array, axis=0)

        if model is None:
            raise HTTPException(
                status_code=500,
                detail="Model not loaded"
            )

        # Predict
        prediction = model.predict(img_array, verbose=0)

        predicted_index = int(np.argmax(prediction[0]))
        predicted_name = class_names[predicted_index]

        confidence = float(np.max(prediction) * 100)

        # Disease Info
        info = DISEASE_INFO.get(predicted_name, {
            "plant": "",
            "status": "",
            "cause": "",
            "symptoms": [],
            "treatment": []
        })

        # Generate GradCAM
        heatmap = generate_gradcam(model, img_array)
        overlay = overlay_heatmap(heatmap, original_np)

        _, buffer = cv2.imencode(".png", overlay)

        import base64
        gradcam_base64 = base64.b64encode(buffer).decode("utf-8")

        # ==========================
        # SAVE TO MONGODB
        # ==========================

        prediction_doc = {
            "user_email": user["email"],
            "id": str(uuid.uuid4()),
            "plant": info["plant"],
            "disease": predicted_name,
            "status": info["status"],
            "confidence": round(confidence, 2),
            "severity": severity,
            "cause": info["cause"],
            "symptoms": info["symptoms"],
            "treatment": info["treatment"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_deleted": False
            
        }

        await db.detections.insert_one(prediction_doc)

        # ==========================
        # RETURN RESPONSE
        # ==========================

        return {
            "plant": info["plant"],
            "class": predicted_name,
            "status": info["status"],
            "confidence": round(confidence, 2),
            "severity": severity,
            "cause": info["cause"],
            "symptoms": info["symptoms"],
            "treatment": info["treatment"],
            "gradcam": gradcam_base64
        }

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@api_router.get("/detections")
async def list_detections(
    authorization: str = Header(None)
):
    

    user = await get_current_user(authorization)

    detections = await db.detections.find(
       {"user_email": user["email"]},
       {"_id":0}
    ).sort("created_at",-1).to_list(100)

    return detections

@api_router.get("/detections/{detection_id}", response_model=Detection)
async def get_detection(detection_id: str):
    detection = await db.detections.find_one({"id": detection_id, "is_deleted": False}, {"_id": 0})
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    return detection


# Model Export Endpoints
@api_router.post("/models/{model_id}/export")
async def export_model(model_id: str, format: str):
    """Export model in specified format (tflite, coreml, onnx)"""
    model = await db.models.find_one({"id": model_id, "is_deleted": False})
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    if model["status"] != "completed":
        raise HTTPException(status_code=400, detail="Model is not trained yet")
    
    if format not in ["tflite", "coreml", "onnx"]:
        raise HTTPException(status_code=400, detail="Invalid export format")
    
    # Generate export metadata
    export_id = str(uuid.uuid4())
    export_doc = {
        "id": export_id,
        "model_id": model_id,
        "format": format,
        "status": "completed",
        "download_url": f"/api/exports/{export_id}/download",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.exports.insert_one(export_doc)
    
    return export_doc

@api_router.get("/dashboard")
async def dashboard(
    authorization: str = Header(None)
):
    

    user = await get_current_user(authorization)

    total = await db.detections.count_documents(
        {"user_email": user["email"]}
    )

    healthy = await db.detections.count_documents({
        "user_email": user["email"],
        "status":"Healthy"
    })

    diseased = await db.detections.count_documents({
        "user_email": user["email"],
        "status":"Diseased"
    })

    accuracy = 90.0

    if total > 0:
        docs = await db.detections.find({"user_email": user["email"]},{"confidence":1}).to_list(1000)

        accuracy = round(
            sum(d["confidence"] for d in docs)/len(docs),
            2
        )

    return{
        "total":total,
        "healthy":healthy,
        "diseased":diseased,
        "accuracy":accuracy
    }

class ChatRequest(BaseModel):
    message: str

# Include the router in the main app

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {"message": "Server running successfully"}

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@api_router.post("/chat")
async def chatbot(req: ChatRequest):

    msg = req.message.lower()

    for disease, info in DISEASE_INFO.items():

        if disease.lower().replace("_", " ") in msg:

            return {

                "reply":

f"""
Disease : {disease.replace('_',' ')}

Cause:
{info['cause']}

Symptoms:
{', '.join(info['symptoms'])}

Treatment:
{', '.join(info['treatment'])}
"""

            }

    if "fertilizer" in msg:

        return {

            "reply":
            "Use NPK fertilizer every 15-20 days according to crop requirements."

        }

    if "water" in msg:

        return {

            "reply":
            "Water early morning. Avoid overwatering because excess moisture promotes fungal diseases."

        }

    if "healthy" in msg:

        return {

            "reply":
            "Healthy leaves are green, without spots, curling or yellowing."

        }

    return {

        "reply":
        "Sorry, I couldn't understand. Please ask about diseases, watering, fertilizer or treatment."

    }


def normalize_disease_key(disease_key: str) -> str:
    key = (disease_key or "").strip()
    if not key:
        return ""

    aliases = {
        "Tomato_Tomato_YellowLeafCurl_Virus": "Tomato__Tomato_YellowLeaf__Curl_Virus",
        "Tomato__Tomato_YellowLeafCurl_Virus": "Tomato__Tomato_YellowLeaf__Curl_Virus",
        "Tomato_Tomato_YellowLeaf__Curl_Virus": "Tomato__Tomato_YellowLeaf__Curl_Virus",
    }

    return aliases.get(key, key)


def get_localized_report_text(detection: dict, language: str = "en") -> dict:
    lang = (language or "en").lower()

    labels = {
        "en": {
            "title": "Leaf Disease Detection Report",
            "plant": "Plant",
            "disease": "Disease",
            "status": "Status",
            "confidence": "Confidence",
            "severity": "Severity",
            "cause": "Cause",
            "symptoms": "Symptoms",
            "treatment": "Treatment",
        },
        "hi": {
            "title": "पत्ती रोग पहचान रिपोर्ट",
            "plant": "पौधा",
            "disease": "रोग",
            "status": "स्थिति",
            "confidence": "विश्वास",
            "severity": "गंभीरता",
            "cause": "कारण",
            "symptoms": "लक्षण",
            "treatment": "उपचार",
        },
        "te": {
            "title": "ఆకు వ్యాధి గుర్తింపు నివేదిక",
            "plant": "మొక్క",
            "disease": "వ్యాధి",
            "status": "స్థితి",
            "confidence": "నమ్మకం",
            "severity": "తీవ్రత",
            "cause": "కారణం",
            "symptoms": "లక్షణాలు",
            "treatment": "చికిత్స",
        },
    }

    name_map = {
        "en": {
            "Tomato_healthy": "Healthy Tomato",
            "Tomato_Bacterial_spot": "Tomato Bacterial Spot",
            "Tomato_Early_blight": "Tomato Early Blight",
            "Tomato_Late_blight": "Tomato Late Blight",
            "Tomato_Leaf_Mold": "Tomato Leaf Mold",
            "Tomato_Septoria_leaf_spot": "Tomato Septoria Leaf Spot",
            "Tomato_Spider_mites": "Tomato Spider Mite",
            "Tomato_Target_Spot": "Tomato Target Spot",
            "Tomato_Tomato_YellowLeafCurl_Virus": "Tomato Yellow Leaf Curl Virus",
            "Tomato__Tomato_YellowLeaf__Curl_Virus": "Tomato Yellow Leaf Curl Virus",
            "Tomato_Tomato_mosaic_virus": "Tomato Mosaic Virus",
            "Pepper__bell___healthy": "Healthy Bell Pepper",
            "Potato___healthy": "Healthy Potato",
            "Papaya_healthy": "Healthy Papaya",
        },
        "hi": {
            "Tomato_healthy": "स्वस्थ टमाटर",
            "Tomato_Bacterial_spot": "टमाटर जीवाणु धब्बा",
            "Tomato_Early_blight": "टमाटर प्रारंभिक झुलसा",
            "Tomato_Late_blight": "टमाटर देर से झुलसा",
            "Tomato_Leaf_Mold": "टमाटर पत्ती फफूंदी",
            "Tomato_Septoria_leaf_spot": "टमाटर सेप्टोरिया पत्ती धब्बा",
            "Tomato_Spider_mites": "टमाटर स्पाइडर माइट",
            "Tomato_Target_Spot": "टमाटर टारगेट स्पॉट",
            "Tomato_Tomato_YellowLeafCurl_Virus": "टमाटर पीला पत्ती मुड़न वायरस",
            "Tomato__Tomato_YellowLeaf__Curl_Virus": "टमाटर पीला पत्ती मुड़न वायरस",
            "Tomato_Tomato_mosaic_virus": "टमाटर मोज़ेक वायरस",
            "Pepper__bell___healthy": "स्वस्थ शिमला मिर्च",
            "Potato___healthy": "स्वस्थ आलू",
            "Papaya_healthy": "स्वस्थ पपीता",
        },
        "te": {
            "Tomato_healthy": "ఆరోగ్యకరమైన టమాటా",
            "Tomato_Bacterial_spot": "టమాటా బ్యాక్టీరియా మచ్చ",
            "Tomato_Early_blight": "టమాటా ప్రారంభ బ్లైట్",
            "Tomato_Late_blight": "టమాటా చివరి బ్లైట్",
            "Tomato_Leaf_Mold": "టమాటా ఆకు ఫంగస్",
            "Tomato_Septoria_leaf_spot": "టమాటా సెప్టోరియా ఆకు మచ్చ",
            "Tomato_Spider_mites": "టమాటా స్పైడర్ మైట్",
            "Tomato_Target_Spot": "టమాటా టార్గెట్ స్పాట్",
            "Tomato_Tomato_YellowLeafCurl_Virus": "టమాటా పసుపు ఆకు ముడత వైరస్",
            "Tomato__Tomato_YellowLeaf__Curl_Virus": "టమాటా పసుపు ఆకు ముడత వైరస్",
            "Tomato_Tomato_mosaic_virus": "టమాటా మొజాయిక్ వైరస్",
            "Pepper__bell___healthy": "ఆరోగ్యకరమైన క్యాప్సికం",
            "Potato___healthy": "ఆరోగ్యకరమైన బంగాళాదుంప",
            "Papaya_healthy": "ఆరోగ్యకరమైన బొప్పాయి",
        },
    }

    plant_map = {
        "en": {
            "Tomato": "Tomato",
            "Potato": "Potato",
            "Papaya": "Papaya",
            "Bell Pepper": "Bell Pepper",
        },
        "hi": {
            "Tomato": "टमाटर",
            "Potato": "आलू",
            "Papaya": "पपीता",
            "Bell Pepper": "शिमला मिर्च",
        },
        "te": {
            "Tomato": "టమాటా",
            "Potato": "బంగాళాదుంప",
            "Papaya": "బొప్పాయి",
            "Bell Pepper": "క్యాప్సికం",
        },
    }

    disease_key = normalize_disease_key(detection.get("disease", ""))
    current_labels = labels.get(lang, labels["en"])

    return {
        "title": current_labels["title"],
        "plant": plant_map.get(lang, plant_map["en"]).get(detection.get("plant", ""), detection.get("plant", "")),
        "disease": name_map.get(lang, name_map["en"]).get(disease_key, disease_key.replace("_", " ")),
        "status": detection.get("status", ""),
        "confidence": detection.get("confidence", 0),
        "severity": detection.get("severity", 0),
        "cause": detection.get("cause", ""),
        "symptoms": detection.get("symptoms", []),
        "treatment": detection.get("treatment", []),
        "labels": current_labels,
    }


@api_router.get("/report/{detection_id}")
async def download_report(
    detection_id: str,
    authorization: str = Header(None),
    lang: str = "en"
):
    user = await get_current_user(authorization)

    detection = await db.detections.find_one({
        "id": detection_id,
        "user_email": user["email"]
    })

    if detection is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

   
    report_data = get_localized_report_text(detection, lang)

    filename = f"report_{detection_id}.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph(f"<b>{report_data['title']}</b>", styles["Title"]))

    story.append(Paragraph(f"<b>{report_data['labels']['plant']}:</b> {report_data['plant']}", styles["Normal"]))

    story.append(Paragraph(f"<b>{report_data['labels']['disease']}:</b> {report_data['disease']}", styles["Normal"]))

    story.append(Paragraph(f"<b>{report_data['labels']['status']}:</b> {report_data['status']}", styles["Normal"]))

    story.append(Paragraph(f"<b>{report_data['labels']['confidence']}:</b> {report_data['confidence']}%", styles["Normal"]))

    story.append(Paragraph(f"<b>{report_data['labels']['severity']}:</b> {report_data['severity']}%", styles["Normal"]))

    story.append(Paragraph(f"<b>{report_data['labels']['cause']}:</b> {report_data['cause']}", styles["Normal"]))

    story.append(Paragraph(f"<br/>{report_data['labels']['symptoms']}", styles["Heading2"]))

    for s in report_data["symptoms"]:
        story.append(Paragraph("• " + s, styles["Normal"]))

    story.append(Paragraph(f"<br/>{report_data['labels']['treatment']}", styles["Heading2"]))

    for t in report_data["treatment"]:
        story.append(Paragraph("• " + t, styles["Normal"]))

    doc.build(story)

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=filename
    )

app.include_router(api_router)