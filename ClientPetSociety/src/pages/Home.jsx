import React, { useState, useEffect } from "react";
import Navegador from "../components/Navegador";
import Post from "../components/Publicaciones/index.jsx";
import Form from "../components/Formulario/index.jsx";
import Cita from "../components/Cita/index.jsx";
import Mascotas from "../components/Mascotas/index.jsx";
import api from "../api.js";
import "../styles/Home.css";

function Home() {

  const camposFormulario = [
  { nombre: "nombre", label: "Nombre", tipo: "texto" },
  { nombre: "email", label: "Correo electrónico", tipo: "email" },
  { nombre: "mensaje", label: "Mensaje", tipo: "textarea" },
  { nombre: "categoria", label: "Categoría", tipo: "select", opciones: ["General", "Sugerencia", "Bug"] },
  { nombre: "imagen", label: "Subir imagen", tipo: "file" },
];

  const [mostrarForm, setMostrarForm] = useState(false);

  const publicaciones = [
  {
    usuario: "Pedro",
    imagen: "/fotos/gato1.jpg",
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
  }
]
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
  }
]
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
  }
]
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
  }
]
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
  }
]
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
  }
]
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
  }
]
  }
];

const listaDeMascotas = [
  { nombre: "Fido" },
  { nombre: "Luna" },
  { nombre: "Max" },
  { nombre: "Mia" },
  { nombre: "Toby" },
];


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