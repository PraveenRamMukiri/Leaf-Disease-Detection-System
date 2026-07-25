import "./auth.css";
import hero from "../assets/hero.png";

import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Login() {

  const { t, language, changeLanguage } = useLanguage();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }

  }, [navigate]);

  const login = async () => {

    try {

      const res = await axios.post(`${API}/api/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.name,
        })
      );

      navigate("/dashboard");

    } catch (err) {

      console.log(err);
      alert(t.invalidCredentials);

    }

  };

  return (

    <div className="auth-page">

      {/* LEFT */}

      <div className="auth-left">

        <div className="hero-content">

          <img
            src={hero}
            alt="Leaf Disease Detection"
            className="hero-image-full"
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="auth-right">

        <div className="auth-card">

          {/* Language */}

          <div className="language-box">

            <select
              value={language}
              onChange={(e) =>
                changeLanguage(e.target.value)
              }
            >
              <option value="en">{t.english}</option>
              <option value="hi">{t.hindi}</option>
              <option value="te">{t.telugu}</option>
            </select>

          </div>

          {/* Header */}

          <div className="auth-header">

            <h1>{t.login}</h1>

            <p>{t.leafDiseaseDetection}</p>

          </div>

          {/* Email */}

          <div className="input-group">

            <label>{t.email}</label>

            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          {/* Password */}

          <div className="input-group">

            <label>{t.password}</label>

            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {/* Forgot Password */}

          <div
            style={{
              textAlign: "right",
              marginTop: "-10px",
              marginBottom: "20px",
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: "#2E7D32",
                fontWeight: 600,
              }}
            >
              {t.forgotPassword}
            </Link>
          </div>

          {/* Login Button */}

          <button
            className="auth-btn"
            onClick={login}
          >
            {t.login}
          </button>

          {/* Bottom */}

          <div className="bottom-link">

            {t.dontHaveAccount}{" "}

            <Link to="/register">

              {t.register}

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}