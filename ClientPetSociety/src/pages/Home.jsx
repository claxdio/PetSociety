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
  const [mostrarForm, setMostrarForm] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mascotas, setMascotas] = useState([]);

const listaDeMascotas = [
  { nombre: "Fido" },
  { nombre: "Luna" },
  { nombre: "Max" },
  { nombre: "Mia" },
  { nombre: "Toby" },
];

  useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                
                // Fetch publicaciones, categorías y mascotas en paralelo
                const [publicacionesRes, categoriasRes, mascotasRes] = await Promise.all([
                    api.get('/api/publicaciones/'),
                    api.get('/api/categorias/'),
                    api.get('/api/mascotas/')
                ]);
                
                setPublicaciones(publicacionesRes.data);
                setCategorias(categoriasRes.data);
                setMascotas(mascotasRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Error status:', error.response?.status);
                console.error('Error data:', error.response?.data);
                // Redirige a login si es un error 401 o 403
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem(ACCESS_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                    window.location.href = '/login';
                }
            }
        };

        fetchData();
    }, []);

    // Crear campos de formulario dinámicamente
    const camposFormulario = [
        { 
            nombre: "descripcion", 
            label: "Descripción", 
            tipo: "textarea",
            required: true 
        },
        { 
            nombre: "tipo_publicacion", 
            label: "Tipo de Publicación", 
            tipo: "select", 
            opciones: ["general", "adopcion", "mascota_perdida"],
            labels: ["General", "Adopción", "Mascota Perdida"]
        },
        { 
            nombre: "categorias", 
            label: "Categorías (#hashtags)", 
            tipo: "multi-select",
            opciones: categorias.map(cat => ({value: cat.id, label: cat.nombre}))
        },
        { 
            nombre: "mascotas_etiquetadas", 
            label: "Etiquetar Mascotas", 
            tipo: "multi-select",
            opciones: mascotas.map(mascota => ({value: mascota.id, label: mascota.nombre}))
        },
        { 
            nombre: "archivo", 
            label: "Imágenes/Videos", 
            tipo: "file",
            accept: "image/*,video/*"
        }
    ];

    // Función para manejar la creación de publicación
    const handlePublicar = async (datosFormulario) => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            
            // Crear la publicación primero (test simple sin relaciones)
            const publicacionData = {
                descripcion: datosFormulario.descripcion || 'Test descripcion',
                tipo_publicacion: datosFormulario.tipo_publicacion || 'general'
            };
            
            // Solo agregar arrays si tienen contenido
            if (datosFormulario.categorias && datosFormulario.categorias.length > 0) {
                publicacionData.categoria_ids = datosFormulario.categorias;
            }
            
            if (datosFormulario.mascotas_etiquetadas && datosFormulario.mascotas_etiquetadas.length > 0) {
                publicacionData.mascota_ids = datosFormulario.mascotas_etiquetadas;
            }
            
            console.log('Enviando datos:', publicacionData);
            
            const response = await api.post('/api/publicaciones/', publicacionData);
            const nuevaPublicacion = response.data;
            
            // Si hay archivo, subirlo
            if (datosFormulario.archivo) {
                const formData = new FormData();
                formData.append('archivo', datosFormulario.archivo);
                
                await api.post(`/api/publicaciones/${nuevaPublicacion.id}/upload/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            // Actualizar la lista de publicaciones
            const publicacionesRes = await api.get('/api/publicaciones/');
            setPublicaciones(publicacionesRes.data);
            
            setMostrarForm(false);
            
        } catch (error) {
            console.error('Error al crear publicación:', error);
            console.error('Error data:', error.response?.data);
            console.error('Datos enviados:', publicacionData);
            console.error('Response status:', error.response?.status);
        }
    };

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
                key={post.id}
                id={post.id}
                usuario={post.usuario}
                imagen={post.imagen}
                descripcion={post.descripcion}
                fotoUsuario={null}
                categorias={post.categorias}
                categoria={post.tipo_publicacion}
                likes={post.likes}
                comentarios={post.comentarios}
                mascotas_etiquetadas={post.mascotas_etiquetadas}
                />
            ))}
          </div>
        </div>
        <div className="home-profile">
          <div className="home-title">Mascotas</div>
          <Mascotas items={listaDeMascotas} />
        </div>
      </div>
      {mostrarForm && <Form camposFormulario={camposFormulario} onClose={() => setMostrarForm(false)} onPublicar={handlePublicar} />}
    </div>
  );
}

export default Home;