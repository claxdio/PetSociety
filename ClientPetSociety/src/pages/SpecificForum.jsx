import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navegador from "../components/Navegador";
import "../styles/SpecificForum.css";

function SpecificForum() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [answerSortOrder, setAnswerSortOrder] = useState("newest");

  const fetchPost = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/foro/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPost(response.data);
    } catch (error) {
      console.error("Error al cargar el post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleVote = async (postId, voteType) => {
    const token = localStorage.getItem("access");
    try {
      await axios.post(
        `http://localhost:8000/api/foro/${postId}/vote/`,
        { tipo_voto: voteType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPost(); // Re-fetch the post to update vote counts
    } catch (error) {
      console.error("Error al votar:", error);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    const token = localStorage.getItem("access");
    try {
      await axios.post(
        "http://localhost:8000/api/foro/",
        {
          contenido: newAnswer,
          parent: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewAnswer("");
      fetchPost(); // Re-fetch post to show new answer
    } catch (error) {
      console.error("Error al publicar respuesta:", error);
    }
  };

  const getAvatarContent = (username, fotoPerfil) => {
    if (fotoPerfil) {
      return <img src={fotoPerfil} alt="Avatar" className="user-avatar" />;
    }
    const initial = username ? username.charAt(0).toUpperCase() : "U";
    return <div className="avatar-initial">{initial}</div>;
  };

  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.round((now - new Date(date)) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `hace ${seconds} segundos`;
    if (minutes < 60) return `hace ${minutes} minutos`;
    if (hours < 24) return `hace ${hours} horas`;
    return `hace ${days} días`;
  };

  if (loading) return <p>Cargando...</p>;
  if (!post) return <p>No se encontró el post.</p>;

  const sortedAnswers = post.respuestas ? [...post.respuestas].sort((a, b) => {
    if (answerSortOrder === "newest") {
      return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    } else {
      return (b.total_votos || 0) - (a.total_votos || 0);
    }
  }) : [];

  return (
    <div className="specific-forum-container">
      <header className="specific-forum-header">
        <Navegador />
      </header>

      <main className="specific-forum-main-layout">
        <section className="specific-forum-content">
          <div className="question-section">
            <div className="post-wrapper">
              <div className="vote-section">
                <button
                  className={`vote-btn upvote ${post.user_vote === 'up' ? 'active' : ''}`}
                  onClick={() => handleVote(post.id, 'up')}
                >
                  ▲
                </button>
                <span className="vote-count">{post.total_votos || 0}</span>
                <button
                  className={`vote-btn downvote ${post.user_vote === 'down' ? 'active' : ''}`}
                  onClick={() => handleVote(post.id, 'down')}
                >
                  ▼
                </button>
              </div>
              <div className="post-box">
                <div className="post-header">
                  {getAvatarContent(post.usuario_username, post.usuario_perfil?.foto_perfil_url)}
                  <div className="user-info">
                    <span className="post-user">{post.usuario_username}</span>
                    {post.usuario_perfil?.tipo_usuario && (
                      <span className={`user-type user-type-${post.usuario_perfil.tipo_usuario}`}>
                        {post.usuario_perfil.tipo_usuario}
                      </span>
                    )}
                  </div>
                  <span className="post-date">{timeAgo(post.fecha_creacion)}</span>
                </div>
                <h2 className="post-question">{post.titulo}</h2>
                <p className="post-description">{post.contenido}</p>
              </div>
            </div>
          </div>

          <div className="answers-section">
            <div className="filter-controls">
              <select
                value={answerSortOrder}
                onChange={(e) => setAnswerSortOrder(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Más recientes</option>
                <option value="most_voted">Más votadas</option>
              </select>
            </div>
            <h3>Respuestas</h3>
            {sortedAnswers.map((answer) => (
              <div key={answer.id} className="post-wrapper">
                <div className="vote-section">
                  <button
                    className={`vote-btn upvote ${answer.user_vote === 'up' ? 'active' : ''}`}
                    onClick={() => handleVote(answer.id, 'up')}
                  >
                    ▲
                  </button>
                  <span className="vote-count">{answer.total_votos || 0}</span>
                  <button
                    className={`vote-btn downvote ${answer.user_vote === 'down' ? 'active' : ''}`}
                    onClick={() => handleVote(answer.id, 'down')}
                  >
                    ▼
                  </button>
                </div>
                <div className="post-box">
                  <div className="post-header">
                    {getAvatarContent(answer.usuario_username, answer.usuario_perfil?.foto_perfil_url)}
                    <div className="user-info">
                      <span className="post-user">{answer.usuario_username}</span>
                      {answer.usuario_perfil?.tipo_usuario && (
                        <span className={`user-type user-type-${answer.usuario_perfil.tipo_usuario}`}>
                          {answer.usuario_perfil.tipo_usuario}
                        </span>
                      )}
                    </div>
                    <span className="post-date">{timeAgo(answer.fecha_creacion)}</span>
                  </div>
                  <p className="post-answer-content">{answer.contenido}</p>
                </div>
              </div>
            ))}
            <form onSubmit={handleAnswerSubmit} className="answer-form">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Escribe tu respuesta..."
                rows="4"
              ></textarea>
              <button type="submit">Publicar Respuesta</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SpecificForum;