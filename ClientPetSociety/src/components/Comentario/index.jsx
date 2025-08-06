import React from "react";
import "./style.css";

function Comentario({ usuario, descripcion, fotoUsuario }) {
  // Manejo seguro del objeto usuario
  const nombreUsuario = typeof usuario === 'object' ? usuario.username : usuario;
  const fotoPerfilUsuario = typeof usuario === 'object' && usuario.perfil && usuario.perfil.foto_perfil_url 
    ? usuario.perfil.foto_perfil_url 
    : fotoUsuario;
  
  // Función para navegar al perfil del usuario
  const handleUsuarioClick = (username) => {
    window.location.href = `/perfil/${username}`;
  };
  
  return (
    <div className="coment-frame">
      <div className="coment">
        <div className="item usuario">
          <div className="usuario-info">
            <div className="foto-usuario">
              {fotoPerfilUsuario ? 
                <img src={fotoPerfilUsuario} alt="Perfil" style={{width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover'}} /> 
                : '👤'
              }
            </div>
            <div 
              className="nombre-usuario clickable"
              onClick={() => handleUsuarioClick(nombreUsuario)}
              style={{ cursor: 'pointer', color: '#007bff' }}
            >
              {nombreUsuario || 'Usuario desconocido'}
            </div>
          </div>
        </div>
        <div className="item descripcion">{descripcion}</div>
      </div>
    </div>
  );
}

export default Comentario;
