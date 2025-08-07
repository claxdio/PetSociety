import React, { useState, useEffect } from "react";
import axios from "axios";
import Navegador from "../components/Navegador";
import "../styles/Forum.css";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Suplente temporal para ID del usuario actual (debería venir de contexto o auth real)
  const usuarioId = 1;

  useEffect(() => {
  const fetchPosts = async () => {
    const token = localStorage.getItem("access"); // Asegúrate de que el token exista

    try {
      const response = await axios.get("http://localhost:8000/api/foro/?tipo=pregunta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(response.data);
    } catch (error) {
      console.error("Error al obtener preguntas del foro:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, []);

const getAvatarContent = (username, fotoPerfil) => {
  if (fotoPerfil) {
    return <img src={fotoPerfil} alt="Avatar" className="user-avatar" />;
  }
  
  // Obtener la primera letra del username
  const initial = username ? username.charAt(0).toUpperCase() : 'U';
  
  return (
    <div className="avatar-initial">
      {initial}
    </div>
  );
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newPost.trim() || !newDescription.trim()) return;

  const nuevaPregunta = {
    titulo: newPost,
    contenido: newDescription,
    parent: null,
  };

  const token = localStorage.getItem("access");

  try {
    const response = await axios.post("http://localhost:8000/api/foro/", nuevaPregunta, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts([response.data, ...posts]);
    setNewPost("");
    setNewDescription("");
  } catch (error) {
    console.error("Error al publicar pregunta:", error);
  }
};


  return (
    <div className="forum-container">
      <header className="forum-header">
        <Navegador />
      </header>

      <main className="forum-main-layout">
        <aside className="forum-sidebar left"></aside>

        <section className="forum-content">
          <form onSubmit={handleSubmit} className="post-input-box">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="¿Qué quieres preguntar?"
              className="post-input"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Agrega una descripción"
              className="post-input"
              rows="3"
            ></textarea>
            <button type="submit" className="post-button">
              Publicar
            </button>
          </form>

          <div className="posts-container">
            {loading ? (
              <p>Cargando publicaciones...</p>
            ) : posts.length === 0 ? (
              <div className="empty-posts">
                <p>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="post-box">
                  <div className="post-header">
                     {getAvatarContent(post.usuario_username, post.usuario_foto_perfil)}
                    <span className="post-user">{post.usuario_username}</span>
                  </div>
                  <h3 className="post-question">{post.titulo}</h3>
                  <p className="post-description">{post.contenido}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Forum;
