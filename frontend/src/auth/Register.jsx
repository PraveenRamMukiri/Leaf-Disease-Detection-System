import "./auth.css";
import hero from "../assets/hero.png";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Register() {

  const { t, language, changeLanguage } = useLanguage();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {

    try {

      await axios.post(`${API}/api/register`, {
        name,
        email,
        password,
      });

      alert(t.registrationSuccessful);

      navigate("/");

    } catch (err) {

      console.log(err);

      alert(t.registrationFailed);

    }

  };

  return (

    <div className="auth-page">

      {/* LEFT */}

      <div className="auth-left">
        <img
          src={hero}
          alt="Leaf Disease Detection"
          className="hero-image-full"
        />
      </div>

      {/* RIGHT */}

      <div className="auth-right">

        <div className="auth-card">

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

          <div className="auth-header">

            <h1>

              {t.createAccount}

            </h1>

            <p>{t.registerToContinue}</p>

          </div>

          <div className="input-group">

            <label>

              {t.fullName}

            </label>

            <input
              type="text"
              placeholder={t.fullName}
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          <div className="input-group">

            <label>

              {t.email}

            </label>

            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="input-group">

            <label>

              {t.password}

            </label>

            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <button
            className="auth-btn"
            onClick={register}
          >

            {t.register}

          </button>

          <div className="bottom-link">

            {t.alreadyHaveAccount}

            {" "}

            <Link to="/">

              {t.login}

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}