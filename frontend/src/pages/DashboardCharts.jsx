import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
BarElement
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
BarElement
);

export default function DashboardCharts({dashboard}){

if(!dashboard) return null;

const pieData={
labels:["Healthy","Diseased"],
datasets:[
{
data:[
dashboard.healthy,
dashboard.diseased
],
}
]
};

const barData={
labels:["Healthy","Diseased"],
datasets:[
{
label:"Predictions",
data:[
dashboard.healthy,
dashboard.diseased
],
}
]
};

return(

<div className="card">

<h2>Prediction Analytics</h2>

<div className="charts">

<div>

<h3>Healthy vs Diseased</h3>

<Pie data={pieData}/>

</div>

<div>

<h3>Total Predictions</h3>

<Bar data={barData}/>

</div>

</div>

</div>

);

}