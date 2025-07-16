import React from "react";
import "./style.css";

function Comentario({ usuario, descripcion }) {
  return (
    <div className="coment-frame">
      <div className="coment">
        <div className="item usuario">{usuario}</div>
        <div className="item descripcion">{descripcion}</div>
      </div>
    </div>
  );
}

export default Comentario;
