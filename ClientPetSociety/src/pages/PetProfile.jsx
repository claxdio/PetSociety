import React from "react";
import NavegadorVertical from "../components/NavegadorVertical";
import Agenda from "../components/Agenda/index.jsx";
import Publicacion from "../components/Publicaciones/index.jsx";
import "../styles/PetProfile.css";
import DescripcionMascota from "../components/DescripcionMacota/index.jsx";

function PetProfile() {
  // Datos de ejemplo para mostrar el componente Publicacion
  const publicaciones = [
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

  return (
    <div className="pet-profile">
      <DescripcionMascota />
      <div className="main-cont">
        <div className="navegadorr">
          <NavegadorVertical />
        </div>
        <div className="center">
          <div className="publications-section">
            {publicaciones.map((post, i) => (
              <Publicacion
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
        <div className="fechas">
          <Agenda />
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
