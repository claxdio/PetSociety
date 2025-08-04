import React, { useState, useEffect } from "react";
import Navegador from "../components/Navegador";
import Post from "../components/Publicaciones/index.jsx";
import Form from "../components/Formulario/index.jsx";
import Cita from "../components/Cita/index.jsx";
import Mascotas from "../components/Mascotas/index.jsx";
import api from "../api.js";
import "../styles/Home.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";


function Home() {
  

const camposFormulario = [
  { 
    nombre: "descripcion", 
    label: "Descripción", 
    tipo: "textarea",
    required: true 
  },
  { 
    nombre: "categoria", 
    label: "Categoría", 
    tipo: "select", 
    opciones: ["General", "Adopción", "Mascota Perdida"] 
  },
  { 
    nombre: "archivos", 
    label: "Imágenes/Videos", 
    tipo: "file" 
  },
];

const listaDeMascotas = [
  { nombre: "Fido" },
  { nombre: "Luna" },
  { nombre: "Max" },
  { nombre: "Mia" },
  { nombre: "Toby" },
];

  const [mostrarForm, setMostrarForm] = useState(false);

  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    throw new Error('No authentication token found');
                }
                const response = await api.get('/api/publicaciones/');
                setPublicaciones(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Redirige a login si es un error 401
                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            }
        };

        fetchPublicaciones();
    }, []);


  return (
    <div className="home-container">
      <Navegador />
      <div className="home-grid">
        <div className="home-calendar">
          <div className="home-title">Agenda</div>
          <div className="calendar-div">
           <Cita
              fecha="30/07/2025"
              peso="12kg"
              caso="Chequeo general"
              proxima="30/08/2025"
            />
          </div>
        </div>
        <div className="home-center">
          <div className="div-creation">
            <button className="create-button" onClick={() => setMostrarForm(true)}>+</button>
            Publicar
          </div>
          <div className="home-posts">
          {publicaciones.map((post, i) => (
                <Post
                key={i}
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
        <div className="home-profile">
          <div className="home-title">Mascotas</div>
          <Mascotas items={listaDeMascotas} />
        </div>
      </div>
      {mostrarForm && <Form camposFormulario={camposFormulario} onClose={() => setMostrarForm(false)}  />}
    </div>
  );
}

export default Home;