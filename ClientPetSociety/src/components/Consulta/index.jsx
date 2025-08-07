import React from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function Consulta({ usuario, titulo, contenido }) {
  return (
    <div className="consulta">
      <div className="user-information">
        <img src={UserImage} alt="Usuario" />
        <p>{usuario}</p>
      </div>
      <div className="consulta-container">
        <h3>{titulo}</h3>
        <p>{contenido}</p>
      </div>
    </div>
  );
}

export default Consulta;
