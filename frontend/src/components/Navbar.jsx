<img
  src="/images/logo.png"
  alt="Leaf Disease Detection"
  className="navbar-logo"
/>
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaUserCircle,
  FaChevronDown,
  FaHome,
  FaSearch,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import "../css/navbar.css";

export default function Navbar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();

  const { language, changeLanguage, t } = useLanguage();
  
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}

<div className="nav-logo">

  <div className="logo-circle">

    <img
      src="/images/logo.png"
      alt="Leaf Disease Detection Logo"
      className="navbar-logo"
    />

  </div>

  <div className="logo-text">

    <h2>Leaf Disease</h2>

    <span>Detection System</span>

  </div>

</div>

      {/* Navigation */}

      <ul className="nav-links">

  <li>

    <button
      className={activeSection==="dashboard" ? "activeNav" : ""}
      onClick={()=>setActiveSection("dashboard")}
    >
      🏠 {t.home}
    </button>

  </li>

  <li>

    <button
      className={activeSection==="detect" ? "activeNav" : ""}
      onClick={()=>setActiveSection("detect")}
    >
      🔍 {t.detection}
    </button>

  </li>

  <li>

    <button
      className={activeSection==="history" ? "activeNav" : ""}
      onClick={()=>setActiveSection("history")}
    >
      🕘 {t.history}
    </button>

  </li>

  <li>

    <button
      className={activeSection==="analytics" ? "activeNav" : ""}
      onClick={()=>setActiveSection("analytics")}
    >
      📊 {t.analytics}
    </button>

  </li>

</ul>

      {/* Right Side */}

      <div className="nav-right">

        <select
          className="language-select"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">{t.english}</option>
<option value="hi">{t.hindi}</option>
<option value="te">{t.telugu}</option>
        </select>

        <div
          className="user-box"
          onClick={() => setShowProfile(!showProfile)}
        >
          <FaUserCircle className="user-icon" />

          <span>{user?.name || "User"}</span>

          <FaChevronDown size={12} />
        </div>

        {showProfile && (
          <div className="profile-dropdown">

            <div className="profile-header">

              <FaUserCircle className="profile-big-icon" />

              <div>
                <strong>{user?.name}</strong>
                <br />
                <small>{user?.email}</small>
              </div>

            </div>

            <hr />

            <button
              className="profile-logout"
              onClick={logout}
            >
              🚪 {t.logout}
            </button>

          </div>
        )}

      </div>

    </nav>
  );
}