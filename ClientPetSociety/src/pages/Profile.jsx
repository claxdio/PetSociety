import '../styles/Profile.css';
import Navegador from '../components/NavegadorIzquierdo/index';
import Publicacion from '../components/Publicaciones/index.jsx';
import Form from '../components/Formulario/index.jsx';
import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Profile = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarFormMascota, setMostrarFormMascota] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [mostrarFormularioPerfil, setMostrarFormularioPerfil] = useState(false);
  const [perfilData, setPerfilData] = useState(null);
  const getIconoMascota = (especie) => {
    const iconos = {
      perro: '🐶',
      gato: '🐱',
      ave: '🐦',
      roedor: '🐹',
      reptil: '🦎',
      default: '🐾'
    };

    return iconos[especie?.toLowerCase()] || iconos.default;
  };
  const cargarDatosPerfil = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/user/profile/', config);
      setPerfilData(response.data);
    } catch (error) {
      console.error("Error cargando perfil", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Obtener información del usuario actual
        const userInfoRes = await api.get('/api/user/info/', config);
        const perfilRes = await api.get('/api/user/profile/', config);

        setUsuarioActual({
          ...userInfoRes.data,
          ...perfilRes.data
        });

        const mascotasRes = await api.get(`/api/usuarios/${userInfoRes.data.username}/mascotas/`, config);
        setMascotas(mascotasRes.data);

        const categoriasRes = await api.get('/api/categorias/', config);
        setCategorias(categoriasRes.data);

        const publicacionesRes = await api.get('/api/publicaciones/', config);
        const publicacionesUsuario = publicacionesRes.data.filter(
          pub => pub.usuario?.username === userInfoRes.data.username
        );
        setPublicaciones(publicacionesUsuario);

      } catch (error) {
        console.error("Error cargando perfil", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.href = '/login';
        }
      }
    };

    fetchData();
  }, []);

  const handlePublicar = async (datosFormulario) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const publicacionData = {
        descripcion: datosFormulario.descripcion,
        tipo_publicacion: datosFormulario.tipo_publicacion
      };

      if (datosFormulario.categorias?.length > 0) {
        publicacionData.categoria_ids = datosFormulario.categorias;
      }

      if (datosFormulario.mascotas_etiquetadas?.length > 0) {
        publicacionData.mascota_ids = datosFormulario.mascotas_etiquetadas;
      }

      // Crear publicación
      const response = await api.post('/api/publicaciones/', publicacionData, config);
      const nuevaPublicacion = response.data;

      // Subir archivo si existe
      if (datosFormulario.archivo) {
        const formData = new FormData();
        formData.append('archivo', datosFormulario.archivo);

        await api.post(
          `/api/publicaciones/${nuevaPublicacion.id}/upload/`, 
          formData, 
          {
            headers: { 
              'Content-Type': 'multipart/form-data', 
              Authorization: `Bearer ${token}` 
            }
          }
        );
      }

      // Actualizar lista de publicaciones
      const publicacionesRes = await api.get('/api/publicaciones/', config);
      const publicacionesUsuario = publicacionesRes.data.filter(
        pub => pub.usuario?.username === usuarioActual.username
      );
      setPublicaciones(publicacionesUsuario);
      setMostrarForm(false);

    } catch (error) {
      console.error("Error al publicar:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
      }
    }
  };

  const handleCrearMascota = async (datosMascota) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const formData = new FormData();

      formData.append('nombre', datosMascota.nombre);
      formData.append('especie', datosMascota.especie);

      if (datosMascota.imagen) {
        formData.append('foto', datosMascota.imagen);
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.post('/api/mascotas/', formData, config);

      const mascotasRes = await api.get(`/api/usuarios/${usuarioActual.username}/mascotas/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMascotas(mascotasRes.data);
      setMostrarFormMascota(false);

    } catch (error) {
      console.error("Error detallado:", error.response?.data);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
      }
    }
  };

  const handleActualizarPerfil = async (formData) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const formDataToSend = new FormData();

      formDataToSend.append('nombre', formData.nombre || '');
      formDataToSend.append('apellido', formData.apellido || '');
      formDataToSend.append('biografia', formData.biografia || '');
      formDataToSend.append('direccion', formData.direccion || '');
      if (formData.foto_perfil) {
        formDataToSend.append('foto_perfil', formData.foto_perfil);
      }

      const response = await api.patch('/api/user/profile/', formDataToSend, config);

      setUsuarioActual(prev => ({
        ...prev,
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        bio: response.data.biografia,
        direccion: response.data.direccion,
        foto_perfil: response.data.foto_perfil
      }));

      await cargarDatosPerfilCompletos();

      setMostrarFormularioPerfil(false);
      window.location.reload();

    } catch (error) {
      console.error("Error actualizando perfil:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
      }
    }
  };

  const cargarDatosPerfilCompletos = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const userInfoRes = await api.get('/api/user/info/', config);
      const perfilRes = await api.get('/api/user/profile/', config);

      const usuarioData = {
        ...userInfoRes.data,
        ...perfilRes.data,
        foto_perfil: perfilRes.data.foto_perfil 
          ? `http://localhost:8000${perfilRes.data.foto_perfil}`
          : null
      };

      setUsuarioActual(usuarioData);

    } catch (error) {
      console.error("Error cargando perfil", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
      }
    }
  };

  const handleMascotaClick = (mascotaID) => {
    window.location.href = `/mascota/${mascotaID}`;
  };

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
      creable: true,
      opciones: categorias.map(cat => ({value: cat.id, label: cat.nombre}))
    },
    {
      nombre: "mascotas_etiquetadas",
      label: "Etiquetar Mascotas",
      tipo: "multi-select",
      creable: false,
      opciones: mascotas.map(mascota => ({value: mascota.id, label: mascota.nombre}))
    },
    {
      nombre: "archivo",
      label: "Imágenes/Videos",
      tipo: "file",
      accept: "image/*,video/*"
    }
  ];

  const camposMascota = [
    {
      nombre: "nombre",
      label: "Nombre",
      tipo: "text",
      required: true
    },
    {
      nombre: "especie",
      label: "Especie",
      tipo: "select",
      opciones: ["perro", "gato", "ave", "roedor", "reptil", "otro"],
      required: true
    },
    {
      nombre: "imagen",  // Este nombre es solo para el frontend
      label: "Foto de la mascota",
      tipo: "file",
      accept: "image/*",
      required: false
    }
  ];

  const camposPerfil = [
    {
      nombre: "nombre",
      label: "Nombre",
      tipo: "text",
      required: false
    },
    {
      nombre: "apellido",
      label: "Apellido",
      tipo: "text",
      required: false
    },
    {
      nombre: "biografia",
      label: "Biografía",
      tipo: "textarea",
      required: false
    },
    {
      nombre: "direccion",
      label: "Dirección",
      tipo: "text",
      required: false
    },
    {
      nombre: "foto_perfil",
      label: "Foto de Perfil",
      tipo: "file",
      accept: "image/*",
      required: false
    }
  ];

  return (
    <div className="app-container">
      <Navegador />
      <div className="profile-container">
        <div className="main-content">
          <div className="profile-section">
            <div className="profile-header">
              {usuarioActual?.foto_perfil ? (
                <img 
                  src={usuarioActual.foto_perfil} 
                  alt="Foto de perfil" 
                  className="profile-photo"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div className="profile-circle">
                  {usuarioActual?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              <h2 className="profile-name">
                {usuarioActual?.nombre_completo || usuarioActual?.username || 'Usuario'}
              </h2>

              <p className="profile-description">
                {usuarioActual?.bio || usuarioActual?.biografia || 'Amante de los animales y la naturaleza'}
              </p>

              <div className="profile-buttons">
                <button onClick={() => {
                  cargarDatosPerfil();
                  setMostrarFormularioPerfil(true);
                }}>
                  Editar perfil
                </button>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="pets-section">
            <h3 className="section-title">Mis Mascotas</h3>
            <div className="mascotas-grid">
              {mascotas.map((mascota, index) => (
                <div key={index} className="mascota-item" onClick={() => handleMascotaClick(mascota.id)}>
                  <div className="mascota-content">
                    <div className="mascota-icon">
                      {getIconoMascota(mascota.especie)}
                    </div>
                    <span className="mascota-name">{mascota.nombre}</span>
                  </div>
                </div>
              ))}
              <div
                className="mascota-item"
                onClick={() => setMostrarFormMascota(true)}
                style={{ cursor: 'pointer' }}
              >
                <div className="mascota-content">
                  <div className="mascota-icon add">+</div>
                  <span className="mascota-name">Añadir</span>
                </div>
              </div>
            </div>
          </div>
          <div className="section-divider"></div>

          <div className="div-creation">
            <button
              className="create-button"
              onClick={() => setMostrarForm(true)}
            >
              +
            </button>
            <span>Crear publicación</span>
          </div>
          <div className="posts">
            {publicaciones.map((post) => (
              <Publicacion
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
      </div>

      {mostrarForm && (
        <Form 
          camposFormulario={camposFormulario}
          onClose={() => setMostrarForm(false)}
          onPublicar={handlePublicar}
        />
      )}
      {mostrarFormMascota && (
        <Form 
          camposFormulario={camposMascota}
          onClose={() => setMostrarFormMascota(false)}
          onPublicar={handleCrearMascota}
          titulo="Añadir Nueva Mascota"
        />
      )}
      {mostrarFormularioPerfil && perfilData && (
        <Form 
          camposFormulario={camposPerfil}
          valoresIniciales={perfilData}
          onClose={() => setMostrarFormularioPerfil(false)}
          onPublicar={handleActualizarPerfil}
          titulo="Editar Perfil"
        />
      )}
    </div>
  );
};

export default Profile;
