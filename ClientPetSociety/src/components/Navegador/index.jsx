import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./style.css";
import Logo from "../../assets/logo/logoBlanco.png";

function Navegador() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("access");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          const isValid = decoded.exp > now;
          setIsLoggedIn(isValid);
          if (isValid) setUsername(decoded.username);
        } catch {
          setIsLoggedIn(false);
          setUsername("");
        }
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const ClickHome = () => navigate("/");
  const ClickSearch = () => navigate("/Search");
  const ClickForum = () => navigate("/Forum");
  const ClickLocation = () => navigate("/locate");

  const ClickProfile = () => {
    if (isLoggedIn && username) {
      navigate(`/profile/${username}`);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  return (
    <nav className="navegador">
      <div className="nav-container">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="nav-links">
          <button className="link" onClick={ClickHome}>Principal</button>
          <button className="link" onClick={ClickSearch}>Buscar</button>
          <button className="link" onClick={ClickForum}>Foro</button>
          <button className="link" onClick={ClickLocation}>Localizar</button>
          <button className="link" onClick={ClickProfile}>Perfil</button>
        </div>
        {isLoggedIn ? (
          <button className="nav-login-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <button className="nav-login-btn" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navegador;
