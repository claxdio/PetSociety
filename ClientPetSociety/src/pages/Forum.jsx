import React, { useState, useEffect } from "react";
import Navegador from "../components/Navegador";
import Publicaciones from "../components/Publicaciones";
import Sugerencia from "../components/Sugerencia";
import "../styles/Forum.css";

function NotificationsContainer() {
  return (
    <div className="notifications-container">
      <h2>Notificaciones</h2>
      
      <div className="notification-box">
        <p className="notification-text">Tienes una nueva respuesta</p>
      </div>
      
      <div className="notification-box">
        <p className="notification-text">Han comentado tu publicación</p>
      </div>
      
      <div className="notification-box">
        <p className="notification-text">Usuario X comentó tu publicación</p>
      </div>

      <div className="notification-box">
        <p className="notification-text">Tu publicación tiene 15 likes</p>
      </div>
      
      <div className="notification-box">
        <p className="notification-text">Nuevo seguidor: PetLover22</p>
      </div>
      
      <div className="notification-box">
        <p className="notification-text">Recordatorio: Vacuna anual el próximo viernes</p>
      </div>
      
      <div className="notification-box">
        <p className="notification-text">Mensaje nuevo de María García</p>
      </div>
    </div>
  );
}


function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setPosts([
        { 
          id: 1, 
          usuario: "Yuliana Pérez", 
          pregunta: "¿Cómo cuido a mi perro?", 
          descripcion: "Mi perro tiene 3 meses y no sé qué alimentación darle" 
        },
        { 
          id: 2, 
          usuario: "Carlos López", 
          pregunta: "Vacunas recomendadas", 
          descripcion: "Quiero saber qué vacunas son esenciales para mi gato de 6 meses" 
        },
        { 
          id: 3, 
          usuario: "Joseph Joestar", 
          pregunta: "Veterinarios recomendados", 
          descripcion: "Hola necesito un veterinario de confianza en mi zona, ¿alguna recomendación?"
           
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() && newDescription.trim()) {
      const newPostObj = {
        id: posts.length + 1,
        usuario: "Tú",
        pregunta: newPost,
        descripcion: newDescription
      };
      setPosts([newPostObj, ...posts]);
      setNewPost("");
      setNewDescription("");
    }
  };

  return (
    <div className="forum-container">
      <header className="forum-header">
        <Navegador />
      </header>

      <main className="forum-main-layout">
        <aside className="forum-sidebar left">
          <NotificationsContainer /> 
        </aside>

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
                    <span className="post-user">{post.usuario}</span>
                  </div>
                  <h3 className="post-question">{post.pregunta}</h3>
                  <p className="post-description">{post.descripcion}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="forum-sidebar right">
          <div className="sidebar-box">
            <h2 className="section-title">Usuarios</h2>
            <div className="users-list">
              <div className="user-with-avatar">
                <div className="user-avatar-circle"></div>
                <span>Yuliana Pérez</span>
              </div>
              <div className="user-with-avatar">
                <div className="user-avatar-circle"></div>
                <span>Carlos López</span>
              </div>
              <div className="user-with-avatar">
                <div className="user-avatar-circle"></div>
                <span>María García</span>
              </div>
              <div className="user-with-avatar">
                <div className="user-avatar-circle"></div>
                <span>Juan Martínez</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Forum;
