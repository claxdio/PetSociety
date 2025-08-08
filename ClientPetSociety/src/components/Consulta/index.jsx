import React from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function Consulta({ foto, usuario, titulo, contenido, usuarioPerfil }) {
  const getUserTypeLabel = (tipoUsuario) => {
    switch (tipoUsuario) {
      case "normal":
        return "Usuario";
      case "veterinario":
        return "Veterinario";
      case "organizacion":
        return "Refugio";
      default:
        return "";
    }
  };

  const getAvatarContent = (username, fotoPerfil) => {
    if (fotoPerfil != UserImage) {
      return <img src={fotoPerfil} alt="Avatar" className="user-avatar" />;
    }

    // Obtener la primera letra del username
    const initial = username ? username.charAt(0).toUpperCase() : "U";

    return <div className="avatar-initial">{initial}</div>;
  };
  return (
    <div className="consulta">
      <div className="user-information">
        {getAvatarContent(usuario, foto)}
        <div className="user-details">
          <p className="username">{usuario}</p>
          {usuarioPerfil?.tipo_usuario && (
            <span
              className={`user-type user-type-${usuarioPerfil.tipo_usuario}`}
            >
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
