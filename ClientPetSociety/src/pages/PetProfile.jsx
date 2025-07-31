import React from "react";
import NavegadorVertical from "../components/NavegadorVertical";
import Fechas from "../components/Fechas";
import Publicacion from "../components/Publicaciones/index.jsx";
import DescripcionUsuario from "../components/DescripcionUsuario/index.jsx";
import "../styles/PetProfile.css";

function PetProfile() {
  // Datos de ejemplo para mostrar el componente Publicacion
  const publicacionEjemplo = {
    usuario: "Usuario Ejemplo",
    imagen: (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#D9D9D9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Imagen de ejemplo
      </div>
    ),
    descripcion: <p>Esta es una descripción de ejemplo para la publicación</p>,
    fotoUsuario: (
      <img
        src="/src/assets/icons/user.png"
        alt="Usuario"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />
    ),
    comentarios: [
      {
        usuario: "Comentador 1",
        descripcion: "¡Muy bonita publicación!",
        fotoUsuario: (
          <img
            src="/src/assets/icons/user.png"
            alt="Usuario"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
        ),
      },
    ],
    categoria: ["Mascotas", "Adopción"],
    likes: 5,
  };

  return (
    <div className="pet-profile">
      <div className="profile-layout">
        <div className="sidebar">
          <NavegadorVertical />
        </div>
        <div className="main-content">
          <DescripcionUsuario />
          <div className="publications-section">
            <h2>Mis Publicaciones</h2>
            <Publicacion {...publicacionEjemplo} />
          </div>
        </div>
        <div className="fechas">
          <Fechas />
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
