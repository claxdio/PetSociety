import React, { useState } from "react";
import "./style.css";
import Comentario from "../Comentario";

function Publicacion({ usuario, imagen, descripcion, fotoUsuario, comentarios, categoria, likes }) {

  return (
    <div className="publicacion">
      <div className="user">
        <div className="grid-item">{fotoUsuario}</div>
        <div className="item">{usuario}</div>
        <button className="report-button">❕</button>
      </div>
      <div className="post-image-container">
        <div className="post-image">
          {imagen}
        </div>
        <button className="like-button">{likes}🖤</button>
      </div>
      {descripcion}
      <div className="categoria-frame">
      {categoria.map((cat, index) => (
        <div key={index} className="categoria-item">{cat}</div>
      ))}
      </div>
      <div className="coment-frame-frame">
        {comentarios.map((coment, index) => (
          <Comentario
            key={index}
            usuario={coment.usuario}
            descripcion={coment.descripcion}
            fotoUsuario={coment.fotoUsuario}
          />
        ))}
       </div>
    </div>
  );
}

export default Publicacion;
