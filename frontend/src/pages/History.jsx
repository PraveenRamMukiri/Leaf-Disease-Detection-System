import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedDiseaseDetails, getLocalizedPlantName } from "../utils/translateDisease";

const API = import.meta.env.VITE_BACKEND_URL;

export default function History() {
  const { t, language } = useLanguage();
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState(null);
  const [modalQrUrl, setModalQrUrl] = useState(null);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/detections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadHistory();

    const timer = setInterval(loadHistory, 3000);

    return () => clearInterval(timer);
  }, []);

  const getDisplayDisease = (item) => {
    const localized = getLocalizedDiseaseDetails(item.disease, language);
    return localized?.name || item.disease.replace(/_/g, " ");
  };

  const getDisplayPlant = (item) => {
    const localized = getLocalizedDiseaseDetails(item.disease, language);
    return localized?.plant || getLocalizedPlantName(item.plant, language);
  };

  const viewReport = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const [pdfRes, qrRes] = await Promise.all([
        axios.get(`${API}/api/report/${id}?lang=${language}`, {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios
          .get(`${API}/api/report/${id}/qr`, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => null),
      ]);

      const pdfUrl = window.URL.createObjectURL(new Blob([pdfRes.data], { type: "application/pdf" }));
      const qrUrl = qrRes ? window.URL.createObjectURL(new Blob([qrRes.data], { type: "image/png" })) : null;

      setModalPdfUrl(pdfUrl);
      setModalQrUrl(qrUrl);
      setModalOpen(true);
    } catch (err) {
      console.log(err);
      alert(t.failedToDownloadPdf);
    }
  };

  const closeModal = () => {
    if (modalPdfUrl) window.URL.revokeObjectURL(modalPdfUrl);
    if (modalQrUrl) window.URL.revokeObjectURL(modalQrUrl);
    setModalPdfUrl(null);
    setModalQrUrl(null);
    setModalOpen(false);
  };

  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API}/api/report/${id}?lang=${language}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `Report-${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      alert(t.failedToDownloadPdf);
    }
  };

  const filtered = history.filter((item) => {
    const text = `${getDisplayPlant(item)} ${getDisplayDisease(item)}`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    const status =
      filter === "all" ||
      (filter === "healthy" && item.status === "Healthy") ||
      (filter === "diseased" && item.status === "Diseased");

    return matchesSearch && status;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  return (
    <div className="historyWrapper">

{/* ================= Banner ================= */}

<div className="historyBanner">

<div className="historyBannerLeft">

<div className="bannerIcon">
📄
</div>

<div>

<h1>{t.predictionHistory}</h1>

<p>{t.predictionHistoryDesc}</p>

</div>

</div>

<div className="bannerDate">

📅 {new Date().toDateString()}

</div>

</div>

{/* ================= Statistics ================= */}

<div className="historyStats">

<div className="historyStatCard">

<div className="statIcon green">
📑
</div>

<div>

<h2>{history.length}</h2>

<p>{t.totalPredictions}</p>

</div>

</div>

<div className="historyStatCard">

<div className="statIcon lightGreen">
🍀
</div>

<div>

<h2>
{
history.filter(
item=>item.status==="Healthy"
).length
}
</h2>

<p>{t.healthyLeaves}</p>

</div>

</div>

<div className="historyStatCard">

<div className="statIcon red">
🦠
</div>

<div>

<h2>
{
history.filter(
item=>item.status==="Diseased"
).length
}
</h2>

<p>{t.diseasedLeaves}</p>

</div>

</div>

<div className="historyStatCard">

<div className="statIcon blue">
🎯
</div>

<div>

<h2>

{
history.length
?
(
history.reduce(
(a,b)=>a+b.confidence,
0
)/history.length
).toFixed(1)
:
0
}%

</h2>

<p>{t.averageAccuracy}</p>

</div>

</div>

</div>

{/* ================= Filters ================= */}

<div className="historyToolbar">

<div className="toolbarSearch">

🔍

<input
type="text"
placeholder={t.searchPlaceholder}
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<select
className="toolbarSelect"
value={filter}
onChange={(e)=>setFilter(e.target.value)}
>

<option value="all">
{t.all}
</option>

<option value="healthy">
{t.healthy}
</option>

<option value="diseased">
{t.diseased}
</option>

</select>

<button className="resetButton">

↻ {t.reset}

</button>

<button className="exportButton">

⬇ {t.export}

</button>

</div>

      <div className="tableWrapper">

<table className="historyTable">
        <thead>
          <tr>

<th>🌾 {t.plant}</th>

<th>🦠 {t.disease}</th>

<th>📌 {t.status}</th>

<th>🎯 {t.confidence}</th>

<th>⚠ {t.severity}</th>

<th>📅 {t.date}</th>

<th>⚙ {t.action}</th>

</tr>
        </thead>

       <tbody>

{pageItems.map((item)=>(

<tr key={item.id}>

<td>

<div className="plantCell">

<div className="plantAvatar">

🍀

</div>

<div>

<div className="plantName">

{getDisplayPlant(item)}

</div>

<div className="plantSub">

{t.leafSample}

</div>

</div>

</div>

</td>

<td>

<div className="diseaseBadge">

 {getDisplayDisease(item)}

</div>

</td>

<td>

<span
className={
item.status==="Healthy"
?
"statusHealthy"
:
"statusDiseased"
}
>

{
item.status==="Healthy"
?
`🟢 ${t.healthy}`
:
`🔴 ${t.diseased}`
}

</span>

</td>

<td>

<div>

<b>

{item.confidence.toFixed(2)}%

</b>

<div className="confidenceBar">

<div

className="confidenceFill"

style={{

width:`${item.confidence}%`

}}

></div>

</div>

</div>

</td>

<td>

<div className="severityBadge">

⚠ {item.severity}%

</div>

</td>

<td>

<div className="dateCell">

<div>

📅

</div>

<div>

{new Date(item.created_at).toLocaleDateString()}

<br/>

<small>

{new Date(item.created_at).toLocaleTimeString()}

</small>

</div>

</div>

</td>

<td>

<div className="actionButtons">

<button

className="viewBtn"

onClick={()=>viewReport(item.id)}

>

👁 {t.viewReport}

</button>

<button

className="downloadBtn"

onClick={()=>downloadPDF(item.id)}

>

{t.downloadPdf}

</button>

</div>

</td>

</tr>

))}

</tbody>
      </table>
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <span>
            {t.showing} {Math.min(startIndex + 1, filtered.length)}-{Math.min(startIndex + pageItems.length, filtered.length)} {t.of} {filtered.length}
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
              «
            </button>
            <span style={{ alignSelf: "center" }}>
              {safePage} / {totalPages}
            </span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              »
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
          <div style={{width:'90%',height:'90%',background:'white',borderRadius:8,overflow:'hidden',display:'flex',flexDirection:'column'}}>
            <div style={{padding:8,display:'flex',justifyContent:'flex-end'}}>
              <button onClick={closeModal}>{t.close}</button>
            </div>
            <div style={{flex:1,display:'flex',gap:12,padding:12}}>
              <iframe title="report" src={modalPdfUrl} style={{flex:1,border:'1px solid #eee'}} />
              {modalQrUrl ? <img src={modalQrUrl} alt="qr" style={{width:180,height:180,objectFit:'contain',background:'#fff',padding:8,border:'1px solid #eee'}} /> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}