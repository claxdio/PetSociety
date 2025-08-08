import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navegador from "../components/Navegador";
import Descripcion from "../components/DescripcionDueño";
import Consulta from "../components/Consulta";
import Chats from "../components/Chats";
import "../styles/SpecificForum.css";
import UserImage from "../assets/icons/user.png";

function SpecificForum() {
  const { id } = useParams(); // obtiene el ID de la URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Cargando...</p>;

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
              fotoPerfil: post?.usuario_perfil?.foto_perfil_url || UserImage,
              totalPublicaciones: post?.usuario_total_publicaciones || 0,
              seguidores: post?.usuario_seguidores || 0,
              seguidos: post?.usuario_seguidos || 0,
            }}
          />
        </div>

        {/* Columna central */}
        <div className="specific-forum-content">
          <Consulta
            usuario={post?.usuario_username}
            titulo={post?.titulo}
            contenido={post?.contenido || "Contenido"}
            usuarioPerfil={post?.usuario_perfil}
          />
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
