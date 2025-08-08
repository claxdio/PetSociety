import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import NavegadorVertical from "../components/NavegadorVertical";
import api from "../api";
import Agenda from "../components/Agenda/index.jsx";
import Publicacion from "../components/Publicaciones/index.jsx";
import "../styles/PetProfile.css";
import "../styles/Home.css";
import DescripcionMascota from "../components/DescripcionMacota/index.jsx";

function PetProfile() {
  const { id } = useParams();
  const [mascotaData, setMascotaData] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Obtener datos del usuario actual
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/user/info/');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
    }
  };

  // Buscar mascota por ID
  const fetchMascotaData = useCallback(async () => {
    try {
      // Obtener todas las mascotas y buscar por ID
      const response = await api.get('/api/mascotas/');
      const mascotaEncontrada = response.data.find(
        mascota => mascota.id === parseInt(id)
      );
      
      if (mascotaEncontrada) {
        setMascotaData(mascotaEncontrada);
        await fetchPublicacionesMascota(mascotaEncontrada.id);
      } else {
        setError('Mascota no encontrada');
      }
    } catch (err) {
      setError('Error al cargar datos de la mascota');
      console.error('Error:', err);
    }
  }, [id]);

  // Obtener publicaciones donde está etiquetada la mascota
  const fetchPublicacionesMascota = async (mascotaId) => {
    try {
      const response = await api.get('/api/publicaciones/');
      // Filtrar publicaciones donde la mascota está etiquetada
      const publicacionesFiltradas = response.data.filter(publicacion =>
        publicacion.mascotas_etiquetadas.some(mascota => mascota.id === mascotaId)
      );
      setPublicaciones(publicacionesFiltradas);
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser(); // Obtener usuario actual
    if (id) {
      fetchMascotaData();
    }
  }, [id, fetchMascotaData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [mascotaData, publicaciones]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  // Datos de ejemplo para mostrar el componente Publicacion (como fallback)
  const publicacionesEjemplo = [
    {
      usuario: "Pedro",
      imagen: "../assets/icons/publicacion.png",
      descripcion: "Mi gato dormido 😴",
      fotoUsuario: "/fotos/pedro.jpg",
      likes: 1,
      categoria: ["#divertido"],
      comentarios: [
        {
          usuario: "Lucía",
          descripcion: "¡Este post me encantó! 😍",
          fotoUsuario: "/fotos/lucia.jpg",
        },
        {
          usuario: "Carlos",
          descripcion: "¡Qué buena onda este post!",
          fotoUsuario: "/fotos/carlos.jpg",
        },
        {
          usuario: "Ana",
          descripcion: "¡Increíble! 🔥",
          fotoUsuario: "/fotos/ana.jpg",
        },
      ],
    },
    {
      usuario: "Laura",
      imagen: "/fotos/perro2.jpg",
      descripcion: "Amo salir con Rocky 🐕",
      fotoUsuario: "/fotos/laura.jpg",
      likes: 1,
      categoria: ["#divertido"],
      comentarios: [
        {
          usuario: "Lucía",
          descripcion: "¡Este post me encantó! 😍",
          fotoUsuario: "/fotos/lucia.jpg",
        },
        {
          usuario: "Carlos",
          descripcion: "¡Qué buena onda este post!",
          fotoUsuario: "/fotos/carlos.jpg",
        },
        {
          usuario: "Ana",
          descripcion: "¡Increíble! 🔥",
          fotoUsuario: "/fotos/ana.jpg",
        },
      ],
    },
    {
      usuario: "Ana",
      imagen: "/fotos/conejo1.jpg",
      descripcion: "Bruno descubriendo el pasto 🐰🌿",
      fotoUsuario: "/fotos/ana.jpg",
      likes: 1,
      categoria: ["#divertido"],
      comentarios: [
        {
          usuario: "Lucía",
          descripcion: "¡Este post me encantó! 😍",
          fotoUsuario: "../assets/icons/publicacion.png",
        },
        {
          usuario: "Carlos",
          descripcion: "¡Qué buena onda este post!",
          fotoUsuario: "/fotos/carlos.jpg",
        },
        {
          usuario: "Ana",
          descripcion: "¡Increíble! 🔥",
          fotoUsuario: "/fotos/ana.jpg",
        },
      ],
    },
    {
      usuario: "Carlos",
      imagen: "/fotos/gato2.jpg",
      descripcion: "Siempre se duerme encima del teclado 😹",
      fotoUsuario: "/fotos/carlos.jpg",
      likes: 1,
      categoria: ["#divertido"],
      comentarios: [
        {
          usuario: "Lucía",
          descripcion: "¡Este post me encantó! 😍",
          fotoUsuario: "/fotos/lucia.jpg",
        },
        {
          usuario: "Carlos",
          descripcion: "¡Qué buena onda este post!",
          fotoUsuario: "/fotos/carlos.jpg",
        },
        {
          usuario: "Ana",
          descripcion: "¡Increíble! 🔥",
          fotoUsuario: "/fotos/ana.jpg",
        },
      ],
    },
    {
      usuario: "María",
      imagen: "/fotos/perico1.jpg",
      descripcion: "Pipo cantando a las 6 am 🎶🦜",
      fotoUsuario: "/fotos/maria.jpg",
      likes: 1,
      categoria: ["#divertido"],
      comentarios: [
        {
          usuario: "Lucía",
          descripcion: "¡Este post me encantó! 😍",
          fotoUsuario: "/fotos/lucia.jpg",
        },
        {
          usuario: "Carlos",
          descripcion: "¡Qué buena onda este post!",
          fotoUsuario: "/fotos/carlos.jpg",
        },
        {
          usuario: "Ana",
          descripcion: "¡Increíble! 🔥",
          fotoUsuario: "/fotos/ana.jpg",
        },
      ],
    },
    {
      usuario: "Sofía",
      imagen: "/fotos/perro3.jpg",
      descripcion: "Toby después del baño 😂",
      fotoUsuario: "/fotos/sofia.jpg",
      likes: 1,
      categoria: ["#divertido"],
      comentarios: [
        {
          usuario: "Lucía",
          descripcion: "¡Este post me encantó! 😍",
          fotoUsuario: "/fotos/lucia.jpg",
        },
        {
          usuario: "Carlos",
          descripcion: "¡Qué buena onda este post!",
          fotoUsuario: "/fotos/carlos.jpg",
        },
        {
          usuario: "Ana",
          descripcion: "¡Increíble! 🔥",
          fotoUsuario: "/fotos/ana.jpg",
        },
      ],
    },
    {
      usuario: "Sofía",
      imagen: "/fotos/perro3.jpg",
      descripcion: "Toby después del baño 😂",
      fotoUsuario: "/fotos/sofia.jpg",
      likes: 1,
      categoria: ["#divertido"],
      comentarios: [
        {
          usuario: "Lucía",
          descripcion: "¡Este post me encantó! 😍",
          fotoUsuario: "/fotos/lucia.jpg",
        },
        {
          usuario: "Carlos",
          descripcion: "¡Qué buena onda este post!",
          fotoUsuario: "/fotos/carlos.jpg",
        },
        {
          usuario: "Ana",
          descripcion: "¡Increíble! 🔥",
          fotoUsuario: "/fotos/ana.jpg",
        },
      ],
    },
  ];

  // Usar publicaciones reales si están disponibles, sino usar ejemplos
  const publicacionesAMostrar = publicaciones.length > 0 ? publicaciones : publicacionesEjemplo;
  
  // Verificar si el usuario actual es el dueño de la mascota
  const isOwner = currentUser && mascotaData && mascotaData.usuario.id === currentUser.id;

  return (
    <div className="pet-profile">
      <DescripcionMascota mascotaData={mascotaData} isOwner={isOwner} />
      <div className="main-cont">
        <div className="navegadorr">
          <NavegadorVertical />
        </div>
        <div className="center home-posts">
          <div className="home-posts">
            {publicacionesAMostrar.map((post, i) => (
              <Publicacion
                key={post.id || i}
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
                user_has_liked={post.user_has_liked}
              />
            ))}
          </div>
        </div>
        {isOwner && (
          <div className="fechas">
            <Agenda />
          </div>
        )}
      </div>
    </div>
  );
}

export default PetProfile;
