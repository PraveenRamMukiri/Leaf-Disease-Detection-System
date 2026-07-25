import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import predictionTranslations from "../utils/predictionTranslations";
import diseaseTranslations from "../utils/translateDisease";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

import Chatbot from "./Chatbot";
import Analytics from "./Analytics";
import History from "./History";

import "./DetectDisease.css";

import React,{useState,useEffect} from "react";
import axios from "axios";

const API=import.meta.env.VITE_BACKEND_URL;

export default function DetectDisease(){

const navigate=useNavigate();

const {language,t}=useLanguage();

const prediction=predictionTranslations[language];

const [file,setFile]=useState(null);

const [preview,setPreview]=useState(null);
const [result,setResult]=useState(null);
const [loading,setLoading]=useState(false);
const [dashboard,setDashboard]=useState(null);
const [activeSection, setActiveSection] = useState("dashboard");
const localizedDisease=
diseaseTranslations?.[language]?.[result?.class];

const localizedDiseaseName=
localizedDisease?.name||
prediction?.diseases?.[result?.class]||
result?.class;

const localizedPlant=
localizedDisease?.plant||
result?.plant;

const localizedCause=
localizedDisease?.cause||
result?.cause;

const localizedSymptoms=
localizedDisease?.symptoms||
result?.symptoms||
[];

const localizedTreatment=
localizedDisease?.treatment||
result?.treatment||
[];

const handleImage=(e)=>{

const selected=e.target.files[0];

setFile(selected);

if(selected){

setPreview(URL.createObjectURL(selected));

}

};

const handlePredict=async()=>{

if(!file){

alert(t.selectImagePrompt);

return;

}

setLoading(true);

try{

const formData=new FormData();

formData.append("file",file);

const token=localStorage.getItem("token");

console.log("TOKEN =", token);

const response=await axios.post(

`${API}/api/inference`,

formData,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

setResult(response.data);

loadDashboard();

}catch(error){

console.log(error);

alert(error.message);

}

setLoading(false);

};

const loadDashboard=async()=>{

try{

const token=localStorage.getItem("token");

const res=await axios.get(

`${API}/api/dashboard`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

setDashboard(res.data);

}catch(err){

console.log(err);

}

};

useEffect(()=>{

loadDashboard();

},[]);

return(

<>

<Navbar
activeSection={activeSection}
setActiveSection={setActiveSection}
/>

<div className="dashboard-page">

{activeSection === "dashboard" && (

<section className="hero">

<div className="hero-left">

<h1>

 {t.leafDiseaseDetectionSystem}

</h1>

<p className="heroDescription">
{t.heroDescription}
</p>

<div className="hero-buttons">

<button
className="detectBtn"
onClick={() => setActiveSection("detect")}
>
🔍 {t.detectDisease}
</button>

<button

className="demoBtn"

onClick={()=>{

// Demo Link

}}

>

🎥 {t.demo}

</button>

</div>

</div>

<div className="hero-right">

<div className="stats-card">

<h2>{dashboard?.total||0}</h2>

<p>{t.totalPredictions}</p>

</div>

<div className="stats-card">

<h2>{dashboard?.healthy||0}</h2>

<p>{t.healthy}</p>

</div>

<div className="stats-card">

<h2>{dashboard?.diseased||0}</h2>

<p>{t.diseased}</p>

</div>

<div className="stats-card">

<h2>{dashboard?.accuracy||0}%</h2>

<p>{t.averageConfidence}</p>

</div>

</div>

</section>
)}

{activeSection === "dashboard" && (

<>
{/* Why Choose Our System */}

<section className="why-section">

<h2>🛡 {t.whyChooseSystem}</h2>

<div className="why-grid">

<div className="why-card">

<div className="why-icon">🧠</div>

<h3>{t.aiPowered}</h3>

<p>{t.aiPoweredDesc}</p>

</div>

<div className="why-card">

<div className="why-icon">🎯</div>

<h3>{t.highAccuracy}</h3>

<p>{t.highAccuracyDesc}</p>

</div>

<div className="why-card">

<div className="why-icon">🌱</div>

<h3>{t.plantHealth}</h3>

<p>{t.plantHealthDesc}</p>

</div>

<div className="why-card">

<div className="why-icon">🌐</div>

<h3>{t.multiLanguage}</h3>

<p>{t.multiLanguageDesc}</p>

</div>

</div>

</section>



{/* Platform Highlights */}

<section className="highlight-section">

<div className="highlight-card">

<div className="highlight-icon">🍃</div>

<h2>17+</h2>

<p>{t.plantDiseases}</p>

</div>

<div className="highlight-card">

<div className="highlight-icon">🎯</div>

<h2>98%</h2>

<p>{t.detectionAccuracy}</p>

</div>

<div className="highlight-card">

<div className="highlight-icon">🔥</div>

<h2>Grad-CAM</h2>

<p>{t.explainableAI}</p>

</div>

<div className="highlight-card">

<div className="highlight-icon">📈</div>

<h2>1000+</h2>

<p>{t.predictions}</p>

</div>

</section>

</>

)}

{activeSection === "detect" && (
    <>

<section className="detect-section">

<div className="upload-card">

<h2>🌿 {t.uploadLeafImageTitle}</h2>

<p>{t.supportedFormats}</p>

<label
htmlFor="leafUpload"
className="uploadArea"
>

<div className="uploadIcon">
☁️
</div>

<h3>
{t.dragDrop}
</h3>

<p>
{t.orClicktoBrowse}
</p>

<input
id="leafUpload"
type="file"
accept="image/*"
onChange={handleImage}
hidden
/>

</label>

{preview && (

<div className="previewContainer">

<img
src={preview}
className="previewImage"
alt="Preview"
/>

</div>

)}

<button
className="predictBtn"
onClick={handlePredict}
>

🔍 {t.detectDisease}

</button>

{loading && (

<div className="loadingBox">

<div className="loader"></div>

<p>

{t.predicting}

</p>

</div>

)}

</div>

<div className="result-card">

{!result && (

<div className="empty-state">

<h2>{t.aiPrediction}</h2>

<p>{t.aiPredictionDescription}</p>
</div>

)}

{result && (

<>

{result.class.toLowerCase().includes("healthy") ? (

<h2 className="healthyText">

🟢 {t.healthy}

</h2>

) : (

<h2 className="diseaseText">

🔴 {t.diseased}

</h2>

)}

<div className="predictionSummary">

    <div className="summaryHeader">

        <div>

            <h2 className="predictionTitle">

                {result.class.toLowerCase().includes("healthy")
                   ? `🟢 ${t.healthyLeafDetected}`
                   : `🔴 ${t.diseaseDetected}`}

            </h2>

            <h1 className="predictionName">

                {localizedDiseaseName}

            </h1>

        </div>

        <div className="confidenceBadge">

            {result.confidence.toFixed(2)}%

        </div>

    </div>

    <div className="confidenceSection">

        <div className="confidenceHeader">

            <span>{t.confidenceScore}</span>

            <span>{result.confidence.toFixed(2)}%</span>

        </div>

        <div className="progress">

            <div
                className="progressFill"
                style={{
                    width: `${result.confidence}%`
                }}
            ></div>

        </div>

    </div>

</div>

<div className="infoCards">

  <div className="infoCard">

    <span className="infoIcon">🌿</span>

    <div>

        <h4>{t.plant}</h4>

        <p>{localizedPlant}</p>

    </div>

</div>

<div className="infoCard">

    <span className="infoIcon">🦠</span>

    <div>

        <h4>{t.cause}</h4>

        <p>{localizedCause}</p>

    </div>

</div>

</div>

<div className="recommendationGrid">

    <div className="modernCard symptomsCard">

        <div className="cardHeader">

            <span className="cardIcon">🍃</span>

            <h3>{prediction.symptoms}</h3>

        </div>

        <ul className="modernList">

            {localizedSymptoms.map((item,index)=>(

                <li key={index}>

                    <span className="tick">✔</span>

                    {item}

                </li>

            ))}

        </ul>

    </div>

    <div className="modernCard treatmentCard">

        <div className="cardHeader">

            <span className="cardIcon">💊</span>

            <h3>{prediction.treatment}</h3>

        </div>

        <ul className="modernList">

            {localizedTreatment.map((item,index)=>(

                <li key={index}>

                    <span className="tick">✔</span>

                    {item}

                </li>

            ))}

        </ul>

    </div>

</div>


<div className="compareSection">

    

    <div className="imageCompare">

        <div className="compareCard">

            <div className="compareHeader">

                🌿 {t.originalLeaf}

            </div>

            <img
                src={preview}
                className="compareImage"
                alt="Original"
            />

            <p className="compareCaption">

                {t.uploadedByUser}

            </p>

        </div>

        <div className="compareCard">

            <div className="compareHeader">

                🔥 {t.gradcamHeatmap}

            </div>

            <img
                src={`data:image/png;base64,${result.gradcam}`}
                className="compareImage"
                alt="GradCAM"
            />

            <p className="compareCaption">

                {t.aiFocusRegion}

            </p>

        </div>

    </div>

</div>

<div className="severityCard modernCard">

<h3>

⚠ {t.diseaseSeverity}

</h3>

<div className="severityCircle">

{result.severity}%

</div>

<p>

{result.severity<10
? `🟢 ${t.mild}`
:result.severity<25
? `🟡 ${t.moderate}`
: `🔴 ${t.severe}`}

</p>

</div>

</>

)}

</div>

</section>

<div className="aiNotice">

    <strong>{t.aiDisclaimer}</strong><br />

    {t.aiDisclaimerText}
</div>

</>

)}



{activeSection === "history" && (

<section className="historySection">

<History />

</section>
)}

{activeSection === "analytics" && (

<section className="analyticsSection">

<Analytics />

</section>
)}

{activeSection === "chatbot" && (

<section className="chatbotSection">

<Chatbot />

</section>
)}

<Footer />

</div>

</>

);

}