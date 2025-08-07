import React, { useState, useEffect } from "react";
import "./style.css";
import Comentario from "../Comentario";
import { ACCESS_TOKEN } from "../../constants";
import Form from "../Formulario";
import api from '../../api';

function Publicacion({ usuario, imagen, descripcion, fotoUsuario, comentarios = [], categorias = [], categoria, likes = 0, mascotas_etiquetadas = [], id, user_has_liked = false }) {

  // Función para obtener el estado del like desde localStorage
  const getLikeStateFromStorage = () => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    return likedPosts[id] || user_has_liked;
  };

  // Función para guardar el estado del like en localStorage
  const saveLikeStateToStorage = (liked) => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    if (liked) {
      likedPosts[id] = true;
    } else {
      delete likedPosts[id];
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  };

  // Estado para manejar likes
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(getLikeStateFromStorage());

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

  const handleEnviarReporte = async (formulario) => {
    try {
      console.log(id)
      console.log(formulario.motivo)
      const response = await api.post('/api/reportes/', {
        publicacion_reportada: id,
        motivo: formulario.motivo
      });

      alert("Reporte enviado correctamente.");
      setShowReporteForm(false);
    } catch (error) {
      const data = error.response?.data;
      const mensaje =
        data?.publicacion_reportada?.[0] ||
        data?.non_field_errors?.[0] ||
        "Error desconocido.";
      alert("Hubo un problema al enviar el reporte: " + mensaje);
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
        const newLikedState = data.liked !== undefined ? data.liked : !isLiked;
        
        setCurrentLikes(data.total_likes || currentLikes + (newLikedState ? 1 : -1));
        setIsLiked(newLikedState);
        
        // Guardar en localStorage
        saveLikeStateToStorage(newLikedState);
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      // En caso de error, toggle local y guardar en localStorage
      const newLikedState = !isLiked;
      setCurrentLikes(currentLikes + (newLikedState ? 1 : -1));
      setIsLiked(newLikedState);
      saveLikeStateToStorage(newLikedState);
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
    // Priorizar localStorage sobre la prop
    const storedLikeState = getLikeStateFromStorage();
    setIsLiked(storedLikeState);
  }, [likes, user_has_liked, id]);

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
