import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function NavegadorVertical() {
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navegador-vertical">
      <div className="nav-header">
        <img src={UserImage} alt="User" className="user-avatar" />
        <h3>Mi Perfil</h3>
      </div>
      <div className="nav-menu">
        <button className="nav-item" onClick={() => navigate("/")}>
          Página principal
        </button>
        <button className="nav-item" onClick={() => navigate("/search")}>
          Buscar
        </button>
        <button className="nav-item" onClick={() => navigate("/locate")}>
          Foro
        </button>
        <button className="nav-item" onClick={() => navigate("/locate")}>
          Localizar
        </button>
        {isLoggedIn && (
          <button className="nav-item logout-btn" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        )}
      </div>
    </div>
  );
}
export default NavegadorVertical;
