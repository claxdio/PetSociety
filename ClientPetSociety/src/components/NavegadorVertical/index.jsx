//import React from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./style.css";
import UserImage from "../../assets/icons/user.png";
import { FaHome, FaSearch, FaComments, FaMapMarkerAlt } from "react-icons/fa";

function NavegadorVertical() {
  const navigate = useNavigate();
  const userName = "User";

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navegador-vertical">
      <div className="nav-header">
        <img src={UserImage} alt="User" className="user-avatar" />
        <span>{userName}</span>
      </div>
      <div className="nav-menu">
        <button className="nav-item" onClick={() => navigate("/")}>
          <FaHome className="link-icon" />
          <span>Principal</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/search")}>
          <FaSearch className="link-icon" />
          <span>Buscar</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/locate")}>
          <FaComments className="link-icon" />
          <span>Foro</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/locate")}>
          <FaMapMarkerAlt className="link-icon" />
          <span>Localización</span>
        </button>
        {isLoggedIn && (
          <button className="nav-item logout-btn" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}
export default NavegadorVertical;
