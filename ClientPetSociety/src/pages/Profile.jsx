import React, { useState } from 'react';
import '../styles/Profile.css';
import Navegador from '../components/NavegadorIzquierdo/index';
import Publicacion from '../components/Publicaciones/index.jsx';
import Form from '../components/Formulario/index.jsx';


const Profile = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  
  const camposFormulario = [
    { nombre: "descripcion", label: "¿Qué quieres compartir?", tipo: "textarea" },
    { nombre: "imagen", label: "Subir imagen", tipo: "file" },
    { 
      nombre: "categoria", 
      label: "Categoría", 
      tipo: "select", 
      opciones: ["Mascotas", "Naturaleza", "Viajes", "Divertido"] 
    }
  ];

  const [publicaciones, setPublicaciones] = useState([
    {
      usuario: "TuUsuario",
      imagen: <img src="https://i.imgur.com/rAJrdgH.jpeg" alt="Gatito" className="post-image" />,
      descripcion: "Mi gatito disfrutando del sol ☀️",
      fotoUsuario: <div className="mini-avatar">T</div>,
      likes: 42,
      categoria: ["#mascotas"],
      comentarios: [
        {
          usuario: "Amigo1",
          descripcion: "¡Qué lindo! 😍",
          fotoUsuario: <div className="mini-avatar">A</div>
        },
        {
          usuario: "Amigo2",
          descripcion: "¿Cómo se llama?",
          fotoUsuario: <div className="mini-avatar">J</div>
        }
      ]
    }
  ]);

  const agregarPublicacion = (nuevaPublicacion) => {
    const nueva = {
      usuario: "TuUsuario",
      imagen: nuevaPublicacion.imagen || <div className="post-image-placeholder">🖼️</div>,
      descripcion: nuevaPublicacion.descripcion,
      fotoUsuario: <div className="mini-avatar">T</div>,
      likes: 0,
      categoria: [`#${nuevaPublicacion.categoria.toLowerCase()}`],
      comentarios: []
    };
    
    setPublicaciones([nueva, ...publicaciones]);
    setMostrarForm(false);
  };

  const mascotas = [
    { nombre: "Michi", icono: "🐱" },
    { nombre: "Firulais", icono: "🐶" },
    { nombre: "Peluche", icono: "🐰" }
  ];

  return (
    <div className="app-container">
      <Navegador />
      <div className="profile-container">
        <div className="main-content">
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-circle">T</div>
              <h2 className="profile-name">TuUsuario</h2>
              <p className="profile-description">Amante de los animales y la naturaleza</p>

              <div className="stats-container">
                <div className="stat-box">
                  <div className="stat-number">{publicaciones.length}</div>
                  <div className="stat-label">Publicaciones</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">156</div>
                  <div className="stat-label">Seguidos</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">189</div>
                  <div className="stat-label">Seguidores</div>
                </div>
              </div>

              <div className="profile-buttons">
                <button>Editar perfil</button>
                <button>Compartir</button>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="pets-section">
            <h3 className="section-title">Mis Mascotas</h3>
            <div className="mascotas-grid">
              {mascotas.map((mascota, index) => (
                <div key={index} className="mascota-item">
                  <div className="mascota-icon">{mascota.icono}</div>
                  <div className="mascota-name">{mascota.nombre}</div>
                </div>
              ))}
              <div className="mascota-item">
                <div className="mascota-icon add">+</div>
                <div className="mascota-name">Añadir</div>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="div-creation">
            <button 
              className="create-button" 
              onClick={() => setMostrarForm(true)}
            >
              +
            </button>
            <span>Crear publicación</span>
          </div>

          <div className="posts">
            {publicaciones.map((post, index) => (
              <Publicacion
                key={index}
                usuario={post.usuario}
                imagen={post.imagen}
                descripcion={post.descripcion}
                fotoUsuario={post.fotoUsuario}
                categoria={post.categoria}
                likes={post.likes}
                comentarios={post.comentarios}
              />
            ))}
          </div>
        </div>
      </div>

      {mostrarForm && (
        <Form 
          campos={camposFormulario} 
          onClose={() => setMostrarForm(false)}
          onSubmit={agregarPublicacion}
        />
      )}
    </div>
  );
};

export default Profile;