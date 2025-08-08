import React, { useState } from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function DescripcionDueño({ usuario }) {
  if (!usuario) return null;

  return (
    <div className="owner-description">
      <div className="description-head">
        <img src={usuario.fotoPerfil || UserImage} alt="Usuario" />
        <h3>{usuario.username}</h3>
      </div>
      <p>{usuario.descripcion || "Sin descripción"}</p>
      <div className="description-body">
        <div className="description-body-item">
          <p>Publicaciones</p>
          <p>{usuario.totalPublicaciones || 0}</p>
        </div>
        <div className="description-body-item">
          <p>Seguidos</p>
          <p>{usuario.seguidos || 0}</p>
        </div>
        <div className="description-body-item">
          <p>Seguidores</p>
          <p>{usuario.seguidores || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default DescripcionDueño;
