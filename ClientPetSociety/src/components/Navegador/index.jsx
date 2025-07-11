import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./style.css";
// import Logo from "../../assets/logo/logo.svg";

function Navegador() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleClick = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  return (
    <nav className="navegador">
      <div className="nav-container">
        <div className="nav-logo">🐾</div>
        <div className="nav-title">Pet Society</div>
        <button className="nav-login-btn" onClick={handleClick}>
          {isLoggedIn ? "Perfil" : "Iniciar sesión"}
        </button>
      </div>
    </nav>
  );
}

export default Navegador;
