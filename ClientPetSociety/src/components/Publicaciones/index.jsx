import React, { useState, useEffect } from "react";
import "./style.css";
import Comentario from "../Comentario";
import { ACCESS_TOKEN } from "../../constants";

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
    window.location.href = `/perfil/${username}`;
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
              style={{ cursor: 'pointer', color: '#007bff' }}
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
        <button className="report-button">❕</button>
      </div>
      <div className="post-image-container">
        <div className="post-image">
          {imagen ? <img src={imagen} alt="Publicación" style={{width: '100%', height: 'auto'}} /> : '🖼️ Sin imagen'}
        </div>
        <button className="like-button" onClick={handleLike}>
          {currentLikes || 0}{isLiked ? '❤️' : '🤍'}
        </button>
      </div>
      {descripcion}
      <div className="categoria-frame">
        {/* Mostrar tipo de publicación */}
        {categoria && <div className="categoria-item">{categoria}</div>}
        {/* Mostrar categorías específicas como hashtags */}
        {Array.isArray(categorias) && categorias.length > 0 && categorias.map((cat, index) => (
          <div key={index} className="categoria-item">#{cat.nombre}</div>
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
              type="text"
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              disabled={enviandoComentario}
            />
            <button type="submit" disabled={enviandoComentario || !nuevoComentario.trim()}>
              {enviandoComentario ? '...' : 'Enviar'}
            </button>
          </form>
        </div>
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
