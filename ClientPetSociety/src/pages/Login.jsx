import React, { useState } from "react";
import "../styles/Login.css";
import logo from "../assets/logo/logo.png";
import loginBg from "../assets/backgrounds/loginbg2.jpg";
import eyeOpen from "../assets/icons/eye-open.png";
import eyeClose from "../assets/icons/eye-close.png";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-content">
          <div className="login-logo">
            <img src={logo} alt="Logo Pet Society" />
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Correo o usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <img
                  src={showPassword ? eyeOpen : eyeClose}
                  alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="eye-icon"
                />
              </button>
            </div>
            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
            <div className="register-link">
              ¿Nuevo Usuario? <a href="/register">Regístrate</a>
            </div>
          </form>
        </div>
        <footer className="login-footer">
          Copyright | Sobre Nosotros | Contáctanos
        </footer>
      </div>
      <div className="login-right" style={{ backgroundImage: `url(${loginBg})` }}>
        {/* Aquí puedes agregar imágenes de mascotas si lo deseas más adelante */}
      </div>
    </div>
  );
};

export default Login;