import React, { useState, useEffect } from "react";
import Navegador from "../components/Navegador";
import Post from "../components/Publicaciones/index.jsx";
import Input from "../components/SearchInput/index.jsx";
import api from "../api.js";
import "../styles/Search.css";

function Search() {

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


  return (
    <div className="search-container">
      <Navegador />
      <div className="search-grid">
        <div className="search-sugestions">
          Buscar
          <Input></Input>
          <div className="search-results">
            <div className="search-results">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="search-result-item">
                  <div className="search-result-text">Resultado {i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="search-posts">
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
    </div>
  );
}

export default Search;