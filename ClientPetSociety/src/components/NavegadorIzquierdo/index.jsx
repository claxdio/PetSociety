import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaSearch, 
  FaComments, 
  FaMapMarkerAlt 
} from "react-icons/fa";
import "./style.css";

function Navegador() {
  const navigate = useNavigate();
  const userName = "Usuario";

  return (
    <nav className="sidebar">
      <div className="sidebar-links">
        <button className="sidebar-link" onClick={() => navigate("/")}>
          <FaHome className="link-icon" />
          <span>Principal</span>
        </button>
        <button className="sidebar-link" onClick={() => navigate("/Search")}>
          <FaSearch className="link-icon" />
          <span>Buscar</span>
        </button>
        <button className="sidebar-link" onClick={() => navigate("/Forum")}>
          <FaComments className="link-icon" />
          <span>Foro</span>
        </button>
        <button className="sidebar-link" onClick={() => navigate("/locate")}>
          <FaMapMarkerAlt className="link-icon" />
          <span>Localización</span>
        </button>
      </div>
    </nav>
  );
}

export default Navegador;