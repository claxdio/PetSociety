import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./style.css";
import Logo from "../../assets/logo/logoBlanco.png";

function Navegador() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("access");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp > now) {
            setIsLoggedIn(true);
            setUsername(decoded.username || "Usuario");
          } else {
            setIsLoggedIn(false);
            setUsername("");
          }
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

    // Opción: escuchar cambios de login/logout en otras pestañas
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate(`/profile/${username}`);
      setShowDropdown(false);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setUsername("");
    setShowDropdown(false);
    
    // Disparar evento para limpiar datos del usuario
    window.dispatchEvent(new Event('userLogout'));
    navigate("/");
  };

  const toggleDropdown = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const ClickSearch = () => navigate("/Search");
  const ClickForum = () => navigate("/Forum");
  const ClickLocation = () => navigate("/locate");
  const ClickHome = () => navigate("/");

  return (
    <nav className="navegador">
      <div className="nav-container">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="nav-links">
          <button className="link" onClick={ClickHome}>Principal</button>
          <button className="link" onClick={ClickSearch}>Buscar</button>
          <button className="link" onClick={ClickForum}>Foro</button>
          <button className="link" onClick={ClickLocation}>Localizar</button>
        </div>
        <div className="user-dropdown">
          <button className="nav-login-btn" onClick={toggleDropdown}>
            {isLoggedIn ? username : "Iniciar sesión"}
          </button>
          {isLoggedIn && showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleProfileClick}>Mi Perfil</button>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navegador;