import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./style.css";
import Logo from "../../assets/logo/logoBlanco.png";

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

  const ClickSearch = () => {
    navigate("/Search");
  };

  const ClickForum = () => {
    navigate("/Forum");
  };

  const ClickLocation = () => {
    navigate("/Location");
  };

  const ClickHome = () => {
    navigate("/");
  };

  return (
    <nav className="navegador">
      <div className="nav-container">
        <img src={Logo} alt="Logo" className="logo" />
        < div className="nav-links">
        <button className="link"onClick={ClickHome}>
            Principal
          </button>
          <button className="link"onClick={ClickSearch}>
            Buscar
          </button>
          <button className="link"onClick={ClickForum}>
            Foro
          </button>
          <button className="link"onClick={ClickLocation}>
            Localizar
          </button>
        </div>
        <button className="nav-login-btn" onClick={handleClick}>
          {isLoggedIn ? "Perfil" : "Iniciar sesión"}
        </button>
      </div>
    </nav>
  );
}

export default Navegador;
