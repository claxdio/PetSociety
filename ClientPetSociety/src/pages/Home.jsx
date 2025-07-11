import React, { useState, useEffect } from "react";
import Navegador from "../components/Navegador";
import Scroll from "../components/Scroll";
import Post from "../components/Publicaciones";
import api from "../api.js";
import "../styles/Home.css";

function Home() {

  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const fetchPublicaciones = async () => {
        try {
        const res = await api.get("/api/publicaciones/");
        console.log("Datos publicaciones:", res.data); // Aquí imprimes los datos recibidos
        setPublicaciones(res.data);
        } catch (error) {
        console.error("Error al cargar publicaciones", error);
        }
    };

    fetchPublicaciones();
    }, []);


  return (
    <div className="home-container">
      <Navegador />
      <div className="home-grid">
        <div className="home-calendar">Calendario</div>
        <Scroll>
          {publicaciones.map((post, i) => (
                <Post
                key={i}
                usuario={post.usuario}
                imagen={post.imagen}
                descripcion={post.descripcion}
                fotoUsuario={post.fotoUsuario}
                comentarios={post.comentarios}
                />
            ))}
        </Scroll>
        <div className="home-profile">Mi perfil</div>
      </div>
    </div>
  );
}

export default Home;