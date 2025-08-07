import React, { useState } from "react";
import "../styles/Register.css";
import logo from "../assets/logo/logo.svg";
import eyeOpen from "../assets/icons/eye-open.png";
import eyeClose from "../assets/icons/eye-close.png";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/user/register/", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-bg">
      <div className="register-box">
        <div className="register-logo-wrapper">
          <img src={logo} alt="Logo Pet Society" className="register-logo-centered" />
        </div>
        <div className="register-content">
          <h1 className="register-title">REGISTRARSE</h1>
          <div className="register-subtitle">Crea una cuenta para continuar</div>
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="register-password-wrapper">
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
            {error && <div className="register-error">{error}</div>}
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <div className="register-login-link">
            ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;