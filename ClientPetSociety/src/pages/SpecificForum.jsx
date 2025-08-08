import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Navegador from "../components/Navegador";
import Descripcion from "../components/DescripcionDueño";
import Consulta from "../components/Consulta";
import Chats from "../components/Chats";
import "../styles/SpecificForum.css";
import UserImage from "../assets/icons/user.png";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function SpecificForum() {
  const { id } = useParams(); // obtiene el ID de la URL
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(true);
  const [resps, setResps] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/foro/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Post recibido de la API:", response.data);
        setPost(response.data);
      } catch (error) {
        console.error("Error al cargar el post:", error);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchResps = async () => {
      const token = localStorage.getItem("access"); // Asegúrate de que el token exista

      try {
        const response = await axios.get(
          `http://localhost:8000/api/foro/?parent=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResps(response.data);
      } catch (error) {
        console.error("Error al obtener preguntas del foro:", error);
      } finally {
        setLoadingResponse(false);
      }
    };

    fetchResps();
  }, [id]);

  const getAvatarContent = (username, fotoPerfil) => {
    if (fotoPerfil) {
      return <img src={fotoPerfil} alt="Avatar" className="user-avatar" />;
    }

    // Obtener la primera letra del username
    const initial = username ? username.charAt(0).toUpperCase() : "U";

    return <div className="avatar-initial">{initial}</div>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !newDescription.trim()) return;

    const nuevaRespuesta = {
      titulo: newPost,
      contenido: newDescription,
      parent: id,
    };

    const token = localStorage.getItem("access");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/foro/",
        nuevaRespuesta,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResps([response.data, ...resps]);
      setNewPost("");
      setNewDescription("");
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
      }
      console.error("Error al publicar pregunta:", error);
    }
  };

  if (loadingPost) return <p>Cargando...</p>;
  if (loadingResponse) return <p>Cargando...</p>;

  if (!post) return <p>No se encontró el post.</p>;

  return (
    <div>
      <header>
        <Navegador />
      </header>

      <main>
        {/* Columna izquierda */}
        <div className="specific-forum-user">
          <Descripcion
            usuario={{
              username: post?.usuario_username,
              descripcion: post?.usuario_foto_perfil_biografia,
              fotoPerfil: post?.usuario_perfil?.foto_perfil_url,
              totalPublicaciones: post?.usuario_total_publicaciones || 0,
              seguidores: post?.usuario_seguidores || 0,
              seguidos: post?.usuario_seguidos || 0,
            }}
          />
        </div>

        {/* Columna central */}
        <div className="specific-forum-content">
          <form onSubmit={handleSubmit} className="post-input-box">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="¿Qué quieres responder?"
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
          <Consulta
            foto={post.usuario_foto_perfil || UserImage}
            usuario={post?.usuario_username || "U"}
            titulo={post?.titulo}
            contenido={post?.contenido}
          />
          <div className="posts-container">
            {loadingResponse ? (
              <p>Cargando publicaciones...</p>
            ) : resps.length === 0 ? (
              <div className="empty-posts">
                <p>No hay respuestas aún. ¡Sé el primero en responder!</p>
              </div>
            ) : (
              resps.map((resp) => (
                <Link
                  to={`/forum/${resp.id}`}
                  key={resp.id}
                  className="post-box-link"
                >
                  <Consulta
                    foto={resp.usuario_foto_perfil || UserImage}
                    usuario={resp?.usuario_username || "U"}
                    titulo={resp?.titulo}
                    contenido={resp?.contenido || "Contenido"}
                  />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="specific-forum-chats">
          <Chats />
        </div>
      </main>
    </div>
  );
}

export default SpecificForum;
