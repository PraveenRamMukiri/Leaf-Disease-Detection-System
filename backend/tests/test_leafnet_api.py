"""
Backend tests for your Leaf Disease Detection API
"""

import io
import pytest
import requests
from PIL import Image

BASE_URL = "http://127.0.0.1:8000"
API = f"{BASE_URL}/api"


def make_image_bytes():
    buf = io.BytesIO()
    Image.new("RGB", (224, 224), (0, 255, 0)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture(scope="module")
def session():
    return requests.Session()


# ---------------- ROOT ----------------

def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert "LeafNet API" in r.text


# ---------------- DATASETS ----------------

def test_create_dataset(session):
    r = session.post(
        f"{API}/datasets",
        json={
            "name": "TEST_DATASET",
            "description": "test dataset",
            "source": "upload"
        }
    )

    assert r.status_code == 200

    data = r.json()

    assert data["name"] == "TEST_DATASET"
    assert "id" in data


# ---------------- MODELS ----------------

def test_create_model(session):

    # first create dataset
    ds = session.post(
        f"{API}/datasets",
        json={
            "name": "TEST_MODEL_DATASET",
            "description": "dataset",
            "source": "upload"
        }
    ).json()

    dataset_id = ds["id"]

    r = session.post(
        f"{API}/models",
        params={"name": "TEST_MODEL"},
        json={
            "architecture": "MobileNetV2",
            "dataset_id": dataset_id,
            "hyperparameters": {}
        }
    )

    assert r.status_code == 200

    data = r.json()

    assert data["architecture"] == "MobileNetV2"
    assert data["dataset_id"] == dataset_id


# ---------------- INFERENCE ----------------

def test_inference(session):

    img = make_image_bytes()

    files = {
        "file": ("leaf.png", img, "image/png")
    }

    r = session.post(
        f"{API}/inference",
        files=files
    )

    assert r.status_code == 200, r.text

    data = r.json()

    assert "class" in data
    assert "confidence" in data

    assert isinstance(data["confidence"], float)


# ---------------- STATS ----------------

def test_stats(session):

    r = session.get(f"{API}/stats")

    assert r.status_code == 200

    data = r.json()

    assert "datasets" in data
    assert "models" in data
    assert "detections" in data