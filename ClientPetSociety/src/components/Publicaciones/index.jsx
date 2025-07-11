import React, { useState } from "react";
import "./style.css";

function Publicacion({ usuario, imagen, descripcion, fotoUsuario, comentarios }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="publicacion">
      <div className="pub-header">
        <img src={fotoUsuario} />
        <div className="pub-usuario">{usuario}</div>
      </div>
      <div className="pub-imagen">
        <img src={imagen} alt="Publicación" />
      </div>
      <div className="pub-footer">
        <button
          className={`pub-like-btn ${liked ? "liked" : ""}`}
          onClick={toggleLike}
          aria-label="Like"
        >
          ❤️
        </button>
        <span className="pub-likes-count">{likesCount} Me gusta</span>
      </div>
      <div className="pub-descripcion">{descripcion}</div>
      <div className="pub-coments">{comentarios}</div>
    </div>
  );
}

export default Publicacion;
