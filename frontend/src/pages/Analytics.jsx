import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedPlantName } from "../utils/translateDisease";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const API = import.meta.env.VITE_BACKEND_URL;

export default function Analytics() {

  const { t, language } = useLanguage();

  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  async function loadData() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/detections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(res.data);
      const statsRes = await axios.get(`${API}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const initialLoad = setTimeout(loadData, 0);
    return () => clearTimeout(initialLoad);
  }, []);

  const healthy = stats?.healthy ?? history.filter(
    (h) => h.status === "Healthy"
  ).length;

  const diseased = stats?.diseased ?? history.filter(
    (h) => h.status === "Diseased"
  ).length;

  const total = stats?.total ?? history.length;

  const accuracy =
    stats?.accuracy ?? (history.length === 0
      ? 0
      : (
          history.reduce(
            (sum, h) => sum + h.confidence,
            0
          ) / total
        ).toFixed(1));

  const pieData = {
    labels: [t.healthy, t.diseased],

    datasets: [
      {
        data: [healthy, diseased],
        backgroundColor: ["#43A047", "#E53935"],
        borderWidth: 2,
      },
    ],
  };

  const plants = {};

  history.forEach((h) => {
    plants[h.plant] =
      (plants[h.plant] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(plants).map((p) =>
      getLocalizedPlantName(p, language)
    ),

    datasets: [
      {
        label: t.predictions,
        data: Object.values(plants),
        backgroundColor: "#2E7D32",
        borderRadius: 10,
      },
    ],
  };

  return (

<div className="analyticsPage">

{/* Hero */}

<div className="analyticsHero">

<div className="analyticsHeroLeft">

<span className="analyticsBadge">
 {t.aiPoweredPlantHealthMonitoring}
</span>

<h1>
🍀 {t.analyticsDashboard}
</h1>

<p>
{t.analyticsDescription}
</p>

</div>

<div className="analyticsHeroRight">

<div className="heroCircle">
📊
</div>

</div>

</div>

{/* Statistics */}

<div className="analyticsStats">

<div className="analyticsStatCard">

<div className="statIcon green">
📑
</div>

<div>

<h2>{total}</h2>

<p>{t.totalPredictions}</p>

</div>

</div>

<div className="analyticsStatCard">

<div className="statIcon blue">
🍀
</div>

<div>

<h2>{healthy}</h2>

<p>{t.healthyLeaves}</p>

</div>

</div>

<div className="analyticsStatCard">

<div className="statIcon red">
🦠
</div>

<div>

<h2>{diseased}</h2>

<p>{t.diseasedLeaves}</p>

</div>

</div>

<div className="analyticsStatCard">

<div className="statIcon orange">
🎯
</div>

<div>

<h2>{accuracy}%</h2>

<p>{t.averageConfidence}</p>

</div>

</div>

</div>

{/* Charts */}

<div className="analyticsCharts">

<div className="analyticsChartCard">

<div className="chartHeader">

<h3>
{t.diseaseDistribution}
</h3>

</div>

<Pie data={pieData} />

</div>

<div className="analyticsChartCard">

<div className="chartHeader">

<h3>
{t.plantWisePredictions}
</h3>

</div>

<Bar
data={barData}
options={{
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
display: false,
},
},
}}
/>

</div>

</div>

{history.length > 0 && (
  <section className="analyticsRecent">
    <h2>{t.recentDetections}</h2>
    <div className="analyticsRecentGrid">
      {history.slice(0, 6).map((detection) => (
        <article className="analyticsRecentCard" key={detection.id}>
          {detection.leaf_image ? (
            <img
              src={detection.leaf_image}
              alt={`${getLocalizedPlantName(detection.plant, language)} ${detection.disease}`}
            />
          ) : (
            <div className="analyticsLeafUnavailable" title={t.savedLeafImageUnavailable} aria-label={t.savedLeafImageUnavailable}>
              <span aria-hidden="true">🍃</span>
            </div>
          )}
          <div>
            <h3>{getLocalizedPlantName(detection.plant, language)}</h3>
            <p>{detection.disease.replace(/_/g, " ")}</p>
            <span>{detection.confidence.toFixed(2)}%</span>
            {!detection.leaf_image && <small>{t.savedLeafImageUnavailable}</small>}
          </div>
        </article>
      ))}
    </div>
  </section>
)}

</div>

  );
}