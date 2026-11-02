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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const API=import.meta.env.VITE_BACKEND_URL;

export default function DetectDisease(){

const navigate=useNavigate();

const {language,t}=useLanguage();

const prediction=predictionTranslations[language];

const [file,setFile]=useState(null);

const [preview,setPreview]=useState(null);
const [result,setResult]=useState(null);
const comparisonData = [
  {
    method: "CSAQF",
    score: Number(result?.csaqf_score_percent || 0),
  },
  {
    method: "CSAQF-V4",
    score: Number(result?.csaqf_v4_score_percent || 0),
  },
  {
    method: "Improved-V4",
    score: Number(result?.csaqf_improved_v4_score_percent || 0),
  },
];
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

    {/* ORIGINAL IMAGE — KEEPING YOUR EXISTING FEATURE */}
    <div className="compareCard">

        <div className="compareHeader">
            🌿 {t.originalLeaf}
        </div>

        <img
            src={preview}
            className="compareImage"
            alt="Original Leaf"
        />

        <p className="compareCaption">
            {t.uploadedByUser}
        </p>

    </div>


    {/* GRAD-CAM */}
<div className="compareCard">

    <div className="compareHeader">
        🔥 {t.gradcamHeatmap}
    </div>

    {result.gradcam ? (
        <img
            src={`data:image/png;base64,${result.gradcam}`}
            className="compareImage"
            alt="Grad-CAM"
        />
    ) : (
        <p className="compareCaption">
            Grad-CAM unavailable
        </p>
    )}

    <div className="confidenceSection camScoreSection">

    <div className="confidenceHeader">

        <span>
             {t.gradcamScore}
        </span>

        <span>
            {result.gradcam_score !== undefined &&
            result.gradcam_score !== null
                ? `${Number(result.gradcam_score).toFixed(2)}%`
                : "N/A"}
        </span>

    </div>

    <div className="progress">

        <div
            className="progressFill gradcamProgress"
            style={{
                width: `${
                    result.gradcam_score !== undefined &&
                    result.gradcam_score !== null
                        ? result.gradcam_score
                        : 0
                }%`
            }}
        ></div>

    </div>

</div>

    

</div>


    {/* SCORE-CAM */}
<div className="compareCard">

    <div className="compareHeader">
        🎯 {t.scorecam}
    </div>

    {result.scorecam ? (
        <img
            src={`data:image/png;base64,${result.scorecam}`}
            className="compareImage"
            alt={t.scorecam}
        />
    ) : (
        <p className="compareCaption">
            {t.scorecamUnavailable}
        </p>
    )}

    <div className="confidenceSection camScoreSection">

    <div className="confidenceHeader">

        <span>
            {t.scorecamScore}
        </span>

        <span>
            {result.scorecam_score !== undefined &&
            result.scorecam_score !== null
                ? `${Number(result.scorecam_score).toFixed(2)}%`
                : "N/A"}
        </span>

    </div>

    <div className="progress">

        <div
            className="progressFill scorecamProgress"
            style={{
                width: `${
                    result.scorecam_score !== undefined &&
                    result.scorecam_score !== null
                        ? result.scorecam_score
                        : 0
                }%`
            }}
        ></div>

    </div>

</div>

    {/* SCORE-CAM SCORE */}
    

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
{/* =========================================================
    CSAQF RESULTS
========================================================= */}

<div className="csaqf-results">

    {/* =====================================================
        1. CSAQF
    ===================================================== */}

    <div className="severityCard modernCard csaqfMainCard">

        <div className="csaqfCardHeader">
            <div>
                <span className="csaqfLabel">
                    QUALITY FUSION
                </span>

                <h3>
                    🧠 CSAQF
                </h3>
            </div>

            <div className="csaqfScore">
                {result.csaqf_score_percent !== undefined &&
                 result.csaqf_score_percent !== null
                    ? `${Number(
                        result.csaqf_score_percent
                      ).toFixed(2)}%`
                    : "N/A"}
            </div>
        </div>

        <div className="qualityBar">
    <div
        className="qualityBarFill"
        style={{
            width: `${
                result.csaqf_score_percent !== undefined &&
                result.csaqf_score_percent !== null
                    ? Math.min(
                        Math.max(
                            Number(result.csaqf_score_percent),
                            0
                        ),
                        100
                    )
                    : 0
            }%`
        }}
    ></div>
</div>

        <p className="qualityDescription">
            Original Confidence- and Severity-Adaptive
            Quality Fusion
        </p>

    </div>


    {/* =====================================================
        2. CSAQF-V4
    ===================================================== */}

    <div className="severityCard modernCard csaqfV4MainCard">

        <div className="csaqfCardHeader">
            <div>
                <span className="csaqfLabel">
                    CALIBRATED FUSION
                </span>

                <h3>
                    🚀 CSAQF-V4
                </h3>
            </div>

            <div className="csaqfScore">
                {result.csaqf_v4_score_percent !== undefined &&
                 result.csaqf_v4_score_percent !== null
                    ? `${Number(
                        result.csaqf_v4_score_percent
                      ).toFixed(2)}%`
                    : "N/A"}
            </div>
        </div>

        <div className="qualityBar">
            <div
                className="qualityBarFill"
                style={{
                    width: `${
                        result.csaqf_v4_score_percent !== undefined &&
                        result.csaqf_v4_score_percent !== null
                            ? Math.min(
                                Math.max(
                                    Number(
                                        result.csaqf_v4_score_percent
                                    ),
                                    0
                                ),
                                100
                              )
                            : 0
                    }%`
                }}
            ></div>
        </div>

        <p className="qualityDescription">
            5–95 percentile calibrated adaptive
            quality fusion
        </p>

    </div>


    {/* =====================================================
        3. IMPROVED CSAQF-V4
    ===================================================== */}

    <div className="severityCard modernCard csaqfImprovedV4MainCard">

        <div className="csaqfCardHeader">
            <div>
                <span className="csaqfLabel">
                    LOGISTIC ADAPTIVE FUSION
                </span>

                <h3>⭐ Improved CSAQF-V4</h3>
            </div>

            <div className="csaqfScore">
                {result.csaqf_improved_v4_score_percent !== undefined &&
                 result.csaqf_improved_v4_score_percent !== null
                    ? `${Number(result.csaqf_improved_v4_score_percent).toFixed(2)}%`
                    : "N/A"}
            </div>
        </div>

        <div className="qualityBar">
            <div
                className="qualityBarFill"
                style={{
                    width: `${
                        result.csaqf_improved_v4_score_percent !== undefined &&
                        result.csaqf_improved_v4_score_percent !== null
                            ? Math.min(
                                Math.max(
                                    Number(result.csaqf_improved_v4_score_percent),
                                    0
                                ),
                                100
                              )
                            : 0
                    }%`
                }}
            ></div>
        </div>

        <p className="qualityDescription">
            10–90 percentile calibrated logistic adaptive fusion
            of Grad-CAM and Score-CAM
        </p>

        <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
            gap: "15px"
        }}>
            <div>
                <strong>Grad-CAM Weight</strong>
                <br />
                {result.csaqf_improved_v4_gqs_weight_percent !== undefined
                    ? `${Number(result.csaqf_improved_v4_gqs_weight_percent).toFixed(2)}%`
                    : "N/A"}
            </div>

            <div>
                <strong>Score-CAM Weight</strong>
                <br />
                {result.csaqf_improved_v4_sqs_weight_percent !== undefined
                    ? `${Number(result.csaqf_improved_v4_sqs_weight_percent).toFixed(2)}%`
                    : "N/A"}
            </div>
        </div>

    </div>


    {/* =====================================================
    3. CSAQF vs CSAQF-V4 - LINE GRAPH
===================================================== */}

<div className="severityCard modernCard csaqfComparisonCard">

  <h3>CSAQF vs CSAQF-V4 vs Improved-V4</h3>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={comparisonData}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="method"
      />

      <YAxis
        domain={[0, 100]}
        tickFormatter={(value) => `${value}%`}
      />

      <Tooltip
        formatter={(value) => [
          `${Number(value).toFixed(2)}%`,
          "Quality Score"
        ]}
      />

      <Legend />

      <Line
        type="monotone"
        dataKey="score"
        name="Quality Score"
        stroke="#7425eb"
        strokeWidth={3}
        dot={{ r: 7 }}
        activeDot={{ r: 9 }}
      />

    </LineChart>
  </ResponsiveContainer>

</div>
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