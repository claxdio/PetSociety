import React, { useState, useEffect } from "react";
import axios from "axios";
import Navegador from "../components/Navegador";
import "../styles/Forum.css";
import { Link } from "react-router-dom";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest", "most_voted"

  // Suplente temporal para ID del usuario actual (debería venir de contexto o auth real)
  const usuarioId = 1;

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("access"); // Asegúrate de que el token exista

      try {
        const response = await axios.get(
          "http://localhost:8000/api/foro/?tipo=pregunta",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(response.data);
        setFilteredPosts(response.data);
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
    const initial = username ? username.charAt(0).toUpperCase() : "U";

    return <div className="avatar-initial">{initial}</div>;
  };

  // Función para filtrar y ordenar posts
  const filterAndSortPosts = (searchText, sortType, postsArray) => {
    let filtered = postsArray;

    // Filtrar por búsqueda
    if (searchText.trim()) {
      filtered = postsArray.filter(post => 
        post.titulo?.toLowerCase().includes(searchText.toLowerCase()) ||
        post.contenido?.toLowerCase().includes(searchText.toLowerCase()) ||
        post.usuario_username?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Ordenar
    if (sortType === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
    } else if (sortType === "most_voted") {
      filtered = filtered.sort((a, b) => (b.total_votos || 0) - (a.total_votos || 0));
    }

    return filtered;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSearch = () => {
    const filtered = filterAndSortPosts(searchTerm, sortOrder, posts);
    setFilteredPosts(filtered);
  };

  const handleVote = async (postId, voteType) => {
    const token = localStorage.getItem("access");
    
    try {
      const response = await axios.post(
        `http://localhost:8000/api/foro/${postId}/vote/`,
        { tipo_voto: voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar el estado local
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, total_votos: response.data.total_votos, user_vote: response.data.user_vote }
          : post
      ));
    } catch (error) {
      console.error("Error al votar:", error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      }
    }
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
      const response = await axios.post(
        "http://localhost:8000/api/foro/",
        nuevaPregunta,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPosts = [response.data, ...posts];
      setPosts(updatedPosts);
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
          {/* Barra de búsqueda y filtros */}
          <div className="forum-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar en el foro..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="filter-controls">
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="newest">Más recientes</option>
                <option value="most_voted">Más votadas</option>
              </select>
              <button 
                type="button" 
                onClick={handleSearch}
                className="search-button"
              >
                Buscar
              </button>
            </div>
          </div>

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
            ) : filteredPosts.length === 0 ? (
              <div className="empty-posts">
                <p>{searchTerm ? 'No se encontraron resultados para tu búsqueda.' : 'No hay publicaciones aún. ¡Sé el primero en publicar!'}</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="post-wrapper">
                  <div className="vote-section">
                    <button 
                      className={`vote-btn upvote ${post.user_vote === 'up' ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleVote(post.id, 'up');
                      }}
                    >
                      ▲
                    </button>
                    <span className="vote-count">{post.total_votos || 0}</span>
                    <button 
                      className={`vote-btn downvote ${post.user_vote === 'down' ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleVote(post.id, 'down');
                      }}
                    >
                      ▼
                    </button>
                  </div>
                  <Link
                    to={`/forum/${post.id}`}
                    className="post-box-link"
                  >
                    <div className="post-box">
                      <div className="post-header">
                        {getAvatarContent(
                          post.usuario_username,
                          post.usuario_foto_perfil
                        )}
                        <div className="user-info">
                          <span className="post-user">{post.usuario_username}</span>
                          {post.usuario_perfil?.tipo_usuario && (
                            <span className={`user-type user-type-${post.usuario_perfil.tipo_usuario}`}>
                              {post.usuario_perfil.tipo_usuario === 'normal' ? 'Usuario' : 
                               post.usuario_perfil.tipo_usuario === 'veterinario' ? 'Veterinario' :
                               post.usuario_perfil.tipo_usuario === 'organizacion' ? 'Refugio' : 
                               post.usuario_perfil.tipo_usuario}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="post-question">{post.titulo}</h3>
                      <p className="post-description">{post.contenido}</p>
                    </div>
                  </Link>
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
