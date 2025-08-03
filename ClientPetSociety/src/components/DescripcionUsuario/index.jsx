import React, { useState, useEffect } from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";
import Esterilizado from "../../assets/icons/check.png";

function DescripcionUsuario() {
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Forzar re-renderización cada 2 segundos para detectar cambios de CSS
    const interval = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="descripcion-usuario">
      <div className="user-info">
        <img src={UserImage} alt="User" />
        <h3>Nombre del Usuario</h3>
      </div>
      <div className="user-info">
        <h4>Especie </h4>
        <p>Especie input</p>
      </div>
      <div className="user-info">
        <h4>Raza </h4>
        <p>Raza input</p>
      </div>
      <div className="user-info">
        <h4>Fecha </h4>
        <p>Fecha input</p>
      </div>
      <div className="user-info">
        <h4>Esterilizado </h4>
        <img src={Esterilizado} alt="Check" className="check-icon" />
      </div>
    </div>
  );
}
export default DescripcionUsuario;
