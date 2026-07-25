import { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {

const [open,setOpen]=useState(false);

return(

<>

<button
className="chatToggle"
onClick={()=>setOpen(!open)}
>

🤖

</button>

{open && (

<div className="chatWindow">

<div className="chatHeader">

🤖 AI Plant Assistant

</div>

<div className="chatBody">

<p>

👋 Hello!

</p>

<p>

I can help you understand:

</p>

<ul>

<li>🌿 Plant Diseases</li>

<li>🍃 Symptoms</li>

<li>💊 Treatments</li>

<li>🧪 Prevention</li>

</ul>

<p>

(Chatbot backend coming soon...)

</p>

</div>

</div>

)}

</>

);

}