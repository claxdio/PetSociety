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
  const [filteredResults, setFilteredResults] = useState([]);
  const [filters, setFilters] = useState({
    usuario: '',
    categoria: ''
  });
  const [suggestions, setSuggestions] = useState({
    usuarios: [],
    categorias: []
  });
  const [showSuggestions, setShowSuggestions] = useState({
    usuario: false,
    categoria: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicacionesRes, categoriasRes] = await Promise.all([
          api.get('/api/publicaciones/'),
          api.get('/api/categorias/'),
        ]);

        setPublicaciones(publicacionesRes.data);
        setCategorias(categoriasRes.data);

        const usuariosUnicos = [...new Map(
          publicacionesRes.data
            .filter(pub => pub.usuario?.username)
            .map(pub => [pub.usuario.username, pub.usuario])
        ).values()];

        setSuggestions({
          usuarios: usuariosUnicos,
          categorias: categoriasRes.data
        });
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const params = {};
        if (filters.usuario) params.usuario = filters.usuario;
        if (filters.categoria) params.categoria = filters.categoria;

        const response = await api.get('/api/publicaciones/filtrar/', { params });
        setFilteredResults(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilteredData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));

    if (name === 'usuario' && value) {
      setShowSuggestions(prev => ({ ...prev, usuario: true }));
    } else if (name === 'categoria' && value) {
      setShowSuggestions(prev => ({ ...prev, categoria: true }));
    } else {
      setShowSuggestions({ usuario: false, categoria: false });
    }
  };

  const selectSuggestion = (type, value) => {
    if (type === 'usuario') {
      setFilters(prev => ({ ...prev, usuario: value }));
    } else if (type === 'categoria') {
      setFilters(prev => ({ ...prev, categoria: value }));
    }
    setShowSuggestions({ usuario: false, categoria: false });
  };

  const clearFilters = () => {
    setFilters({
      usuario: '',
      categoria: ''
    });
  };

  const filteredSuggestions = {
    usuarios: suggestions.usuarios.filter(user =>
      user.username.toLowerCase().includes(filters.usuario.toLowerCase())
    ),
    categorias: suggestions.categorias.filter(cat =>
      cat.nombre.toLowerCase().includes(filters.categoria.toLowerCase())
    )
  };

  return (
    <div className="search-container">
      <Navegador />
      <div className="search-grid">
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              value={filters.usuario}
              onChange={handleFilterChange}
              placeholder="Buscar usuario..."
              autoComplete="off"
            />
            {showSuggestions.usuario && filteredSuggestions.usuarios.length > 0 && (
              <div className="suggestions-dropdown">
                {filteredSuggestions.usuarios.map(user => (
                  <div
                    key={user.username}
                    className="suggestion-item"
                    onClick={() => selectSuggestion('usuario', user.username)}
                  >
                    @{user.username}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="categoria">Categoría</label>
            <input
              id="categoria"
              name="categoria"
              type="text"
              value={filters.categoria}
              onChange={handleFilterChange}
              placeholder="Buscar categoría..."
              autoComplete="off"
            />
            {showSuggestions.categoria && filteredSuggestions.categorias.length > 0 && (
              <div className="suggestions-dropdown">
                {filteredSuggestions.categorias.map(cat => (
                  <div
                    key={cat.id}
                    className="suggestion-item"
                    onClick={() => selectSuggestion('categoria', cat.nombre)}
                  >
                    #{cat.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={clearFilters} className="clear-filters">
            Limpiar filtros
          </button>
        </div>

        <div className="search-posts">
          {filteredResults.length > 0 ? (
            filteredResults.map(post => (
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
            <div>No hay publicaciones que coincidan con los filtros</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
