import React from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function Consulta({ usuario, titulo, contenido, usuarioPerfil }) {
  const getUserTypeLabel = (tipoUsuario) => {
    switch(tipoUsuario) {
      case 'normal': return 'Usuario';
      case 'veterinario': return 'Veterinario';
      case 'organizacion': return 'Refugio';
      default: return '';
    }
  };

  return (
    <div className="consulta">
      <div className="user-information">
        <img src={UserImage} alt="Usuario" />
        <div className="user-details">
          <p className="username">{usuario}</p>
          {usuarioPerfil?.tipo_usuario && (
            <span className={`user-type user-type-${usuarioPerfil.tipo_usuario}`}>
              {getUserTypeLabel(usuarioPerfil.tipo_usuario)}
            </span>
          )}
        </div>
      </div>
      <div className="consulta-container">
        <h3>{titulo}</h3>
        <p>{contenido}</p>
      </div>
    </div>
  );
}

export default Consulta;
