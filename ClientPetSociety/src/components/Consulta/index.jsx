import React from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function Consulta() {
  return (
    <div className="consulta">
      <div className="user-information">
        <img src={UserImage} alt="Usuario" />
        <p>Usuario</p>
      </div>
      <div className="consulta-container">
        <h3>Consulta del Foro</h3>
        <p>
          Esta es una consulta o pregunta que se ha publicado en el foro. Aquí
          se muestra la descripción completa de la consulta.
        </p>
      </div>
    </div>
  );
}

export default Consulta;
