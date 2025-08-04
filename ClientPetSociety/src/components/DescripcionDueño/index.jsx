import React, { useState } from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function DescripcionDueño() {
  return (
    <div className="owner-description">
      <div className="description-head">
        <img src={UserImage} alt="Usuario" />
        <h3>Usuario</h3>
      </div>
      <p>Descripcion</p>
      <div className="description-body">
        <div className="description-body-item">
          <p>Publicaciones</p>
          <p>2</p>
        </div>
        <div className="description-body-item">
          <p>Seguidos</p>
          <p>2</p>
        </div>
        <div className="description-body-item">
          <p>Seguidores</p>
          <p>2</p>
        </div>
      </div>
    </div>
  );
}

export default DescripcionDueño;
