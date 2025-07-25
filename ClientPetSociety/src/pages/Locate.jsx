import React from "react";
import "../styles/Locate.css";
import Navegador from "../components/Navegador";
import Button from "../components/Button/Button"; // Importar tu botón
import icono1 from "../assets/icons/icono1.png";  // Ejemplo de íconos
import icono2 from "../assets/icons/icono2.png";
import icono3 from "../assets/icons/icono3.png";
import icono4 from "../assets/icons/icono4.png";

const Locate = () => {
  return (
    <div className="locate-container">
      <Navegador />
      
      {/* Contenedor de los botones */}
      <div className="locate-buttons">
        <Button icono={icono1} texto="Mascotas Perdidas" onClick={() => {}} />
        <Button icono={icono2} texto="Veterinarios" onClick={() => {}} />
        <Button icono={icono3} texto="Refugios" onClick={() => {}} />
        <Button icono={icono4} texto="Tienda de mascotas" onClick={() => {}} />
      </div>

      {/* Contenedor principal dividido en 3 columnas */}
      <div className="locate-grid">
        <div className="locate-calendar">Columna izquierda</div>
        <div className="locate-main">Centro</div>
        <div className="locate-profile">Columna derecha</div>
      </div>
    </div>
  );
};

export default Locate;

