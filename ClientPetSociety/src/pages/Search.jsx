import React, { useState, useEffect } from "react";
import Navegador from "../components/Navegador";
import Post from "../components/Publicaciones/index.jsx";
import Input from "../components/SearchInput/index.jsx";
import api from "../api.js";
import "../styles/Search.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Search() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchType, setSearchType] = useState("text"); // 'text' o 'category'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const [publicacionesRes, categoriasRes] = await Promise.all([
          api.get('/api/publicaciones/'),
          api.get('/api/categorias/'),
        ]);

        setPublicaciones(publicacionesRes.data);
        setCategorias(categoriasRes.data);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.href = '/login';
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!query) {
        setFilteredResults([]);
        setSearchType("text");
        return;
      }

      const lowerQuery = query.toLowerCase();

      if (lowerQuery.startsWith("#")) {
        setSearchType("category");
        // Mostrar categorías que coinciden
        const cleanQuery = lowerQuery.slice(1);
        const matchedCategories = categorias
          .filter(cat => cat.nombre.toLowerCase().includes(cleanQuery))
          .map(cat => ({ type: "category", nombre: cat.nombre, id: cat.id }));
        setFilteredResults(matchedCategories);
      } else {
        setSearchType("text");
        // Mostrar publicaciones que coinciden en descripción o usuario
        const filteredPubs = publicaciones
          .filter(pub =>
            pub.descripcion?.toLowerCase().includes(lowerQuery) ||
            pub.usuario?.username?.toLowerCase().includes(lowerQuery)
          )
          .map(pub => ({ type: "post", ...pub }));
        setFilteredResults(filteredPubs);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, publicaciones, categorias]);

  // Cuando el usuario hace click en una categoría sugerida, mostramos solo posts con esa categoría
  const filterPostsByCategory = (categoryName) => {
    setQuery(`#${categoryName}`);
    setSearchType("category");
    const filteredPosts = publicaciones
      .filter(pub =>
        pub.categorias?.some(cat => cat.nombre.toLowerCase() === categoryName.toLowerCase())
      )
      .map(pub => ({ type: "post", ...pub }));
    setFilteredResults(filteredPosts);
  };

  // Qué posts mostrar: si estamos buscando categoría y ya filtramos posts, mostrar esos,
  // si estamos buscando texto, mostrar los resultados (posts),
  // o si no hay query mostrar todos
  const postsToShow = searchType === "category"
    ? filteredResults.filter(item => item.type === "post")
    : (query && filteredResults.length > 0
      ? filteredResults.filter(item => item.type === "post")
      : publicaciones);

  return (
    <div className="search-container">
      <Navegador />
      <div className="search-grid">
        <div className="search-sugestions">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar publicaciones o #categoría..."
          />

          <div className="search-results">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, i) => (
                <div
                  key={item.id || i}
                  className="search-result-item"
                  style={{ cursor: item.type === "category" ? "pointer" : "default" }}
                  onClick={() => {
                    if (item.type === "category") filterPostsByCategory(item.nombre);
                  }}
                >
                  <div className="search-result-text">
                    {item.type === "category"
                      ? `#${item.nombre}`
                      : `${item.usuario.username}: ${item.descripcion}`}
                  </div>
                </div>
              ))
            ) : (
              <div className="search-result-text">Sin resultados</div>
            )}
          </div>
        </div>

        <div className="search-posts">
          {postsToShow.length > 0 ? (
            postsToShow.map(post => (
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
            ))
          ) : (
            <div>No hay publicaciones</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
