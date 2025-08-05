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
      <div className="categoria-frame">      {/* Me sale que esta linea esta mal o bueno el div */}
      {categoria.map((cat, index) => (
        <div key={index} className="categoria-item">{cat}</div>
      ))}
      </div>

      {/* <div className="categoria-frame">
            {Array.isArray(categoria) 
              ? categoria.map((cat, index) => (
                  <div key={index} className="categoria-item">{cat}</div>
                ))
              : <div className="categoria-item">{categoria}</div>}
          </div> 
          
          yo probe con eso y se arreglo*/}

      <div className="coment-frame-frame">  {/* y esta igual sale mal */}
        {comentarios.map((coment, index) => (
          <Comentario
            key={index}
            usuario={coment.usuario}
            descripcion={coment.descripcion}
            fotoUsuario={coment.fotoUsuario}
          />
        ))}
      </div>

      {/* <div className="coment-frame-frame">
            {Array.isArray(comentarios) && comentarios.map((coment, index) => (
              <Comentario
                key={index}
                usuario={coment.usuario}
                descripcion={coment.descripcion}
                fotoUsuario={coment.fotoUsuario}
              />
            ))}
          </div> 
          
          Y probe este otro y me funciono de nuevo la pagina, pero despues sale error en el backend por la autenticacion o algo asi*/}

    </div>
  );
}

export default Publicacion;
