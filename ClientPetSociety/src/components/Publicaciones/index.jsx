import React, { useState, useEffect } from "react";
import "./style.css";
import Comentario from "../Comentario";
import { ACCESS_TOKEN } from "../../constants";
import Form from "../Formulario";
import api from '../../api';

function Publicacion({ usuario, imagen, descripcion, fotoUsuario, comentarios = [], categorias = [], categoria, likes = 0, mascotas_etiquetadas = [], id }) {

  // Estado para manejar likes
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  // Estado para comentarios
  const [comentariosList, setComentariosList] = useState(comentarios);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // Manejo seguro de datos
  const nombreUsuario = typeof usuario === 'object' ? usuario.username : usuario;
  const fotoPerfilUsuario = typeof usuario === 'object' && usuario.perfil && usuario.perfil.foto_perfil_url 
    ? usuario.perfil.foto_perfil_url
    : fotoUsuario;

  const [showReporteForm, setShowReporteForm] = useState(false);
  const camposFormulario = [
        {
            nombre: "motivo",
            label: "Motivo:",
            tipo: "textarea",
            required: true
        },
    ];

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return;
        
        const response = await api.get('/api/user/info/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsOwner(
          typeof usuario === 'object' 
            ? usuario.username === response.data.username
            : false
        );
      } catch (error) {
        console.error('Error checking ownership:', error);
      }
    };

    checkOwnership();
  }, [usuario]);

  const handleEliminarPublicacion = async () => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta publicación?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Usar el endpoint seguro con /eliminar/
      const response = await api.delete(`/api/publicaciones/${id}/eliminar/`, config);
      
      if (response.status === 200) {
        alert('Publicación eliminada correctamente');
        window.location.reload(); // Recargar para ver cambios
        
        // O si usas manejo de estado:
        // onDelete && onDelete(id); // Notificar al componente padre
      }
    } catch (error) {
      console.error('Error eliminando publicación:', error);
      
      let mensajeError = 'Error al eliminar la publicación';
      if (error.response) {
        if (error.response.status === 404) {
          mensajeError = 'La publicación no existe o ya fue eliminada';
        } else if (error.response.status === 403) {
          mensajeError = 'No tienes permiso para eliminar esta publicación';
        } else if (error.response.data?.detail) {
          mensajeError = error.response.data.detail;
        }
      }
      
      alert(mensajeError);
    }
  };

  // Función para dar/quitar like
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/publicaciones/${id}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentLikes(data.total_likes);
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  // Función para enviar comentario
  const handleComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || enviandoComentario) return;
    
    setEnviandoComentario(true);
    try {
      const response = await fetch(`http://localhost:8000/api/publicaciones/${id}/comentar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenido: nuevoComentario }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setComentariosList([...comentariosList, data.comentario]);
        setNuevoComentario('');
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    } finally {
      setEnviandoComentario(false);
    }
  };

  // Función para navegar al perfil del usuario
  const handleUsuarioClick = (username) => {
    window.location.href = `/profile/${username}`;
  };

  // Función para navegar al perfil de la mascota
  const handleMascotaClick = (mascotaId) => {
    window.location.href = `/mascota/${mascotaId}`;
  };

  // Sincronizar props con estado cuando cambian las props
  useEffect(() => {
    setComentariosList(comentarios);
  }, [comentarios]);

  useEffect(() => {
    setCurrentLikes(likes);
  }, [likes]);

  return (
    <div className="publicacion">
      {showReporteForm && <Form camposFormulario={camposFormulario} onClose={() => setShowReporteForm(false)} onPublicar={handleEnviarReporte} title="Reporte"/>}
      
      <div className="user">
        <div className="grid-item">
          {fotoPerfilUsuario ?
            <img src={fotoPerfilUsuario} alt="Perfil" style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} /> 
            : '👤'
          }
        </div>
        <div className="item">
          <div className="user-info">
            <span
              className="username clickable"
              onClick={() => handleUsuarioClick(nombreUsuario)}
              style={{ cursor: 'pointer', color: '#28a745' }}
            >
              {nombreUsuario || 'Usuario desconocido'}
            </span>
            {Array.isArray(mascotas_etiquetadas) && mascotas_etiquetadas.length > 0 && (
              <div className="mascotas-etiquetadas">
                {mascotas_etiquetadas.map((mascota, index) => (
                  <span
                    key={index}
                    className="mascota-tag clickable"
                    onClick={() => handleMascotaClick(mascota.id)}
                    style={{ cursor: 'pointer', color: '#28a745' }}
                  >
                    con {mascota.nombre} 🐾
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {!imagen && (
          <button className="like-button no-image" onClick={(e) => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
              window.location.href = '/login';
              return;
            } else {
              handleLike()
            }
          }}>
            {currentLikes || 0}{isLiked ? '❤️' : '🤍'}
          </button>
        )}
        <div className="user-buttons">
          {isOwner && (
            <button 
              className="delete-button"
              onClick={handleEliminarPublicacion}
              title="Eliminar publicación"
            >
              🗑️
            </button>
          )}
          <button className="report-button"
            onClick={() => {
              const token = localStorage.getItem(ACCESS_TOKEN);
              if (!token) {
                window.location.href = '/login';
                return;
              } else {
                setShowReporteForm(true)
              }}}
            title="Reportar publicación"
          >
            ❕
          </button>
        </div>
      </div>

      <div className="post-image-container">
        {imagen ? (
          <>
            <img src={imagen} alt="Publicación" style={{width: '100%', height: 'auto'}} />
            {/* Botón de like cuando SÍ hay imagen */}
            <button className="like-button" onClick={(e) => {
              const token = localStorage.getItem(ACCESS_TOKEN);
              if (!token) {
                window.location.href = '/login';
                return;
              } else {
                handleLike()
              }
            }}>
              {currentLikes || 0}{isLiked ? '❤️' : '🤍'}
            </button>
          </>
        ) : null}
      </div>
      {descripcion}
      <div className="categoria-frame">
        {categoria && <div className="categoria-item">{categoria}</div>}
        {Array.isArray(categorias) && categorias.length > 0 && categorias.map((cat, index) => (
          <div key={index} className="categoria-item">#{cat.nombre}</div>
        ))}
      </div>
      <div className="coment-frame-frame">
        {Array.isArray(comentariosList) && comentariosList.map((coment, index) => (
          <Comentario
            key={index}
            usuario={coment.usuario}
            descripcion={coment.contenido}
            fotoUsuario={coment.usuario?.perfil?.foto_perfil}
          />
        ))}

        <div className="comentario-form">
          <form onSubmit={handleComentario}>
            <input
              className="custom-input"
              type="text"
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChange={(e) => {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                  window.location.href = '/login';
                  return;
                } else {
                  setNuevoComentario(e.target.value)
                }}}
              disabled={enviandoComentario}
            />
            <button className="button-small" type="submit" disabled={enviandoComentario || !nuevoComentario.trim()}>
              {enviandoComentario ? '...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Publicacion;
