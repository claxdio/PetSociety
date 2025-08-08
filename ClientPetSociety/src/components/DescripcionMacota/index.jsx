import React, { useState, useEffect } from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function DescripcionMascota({ mascotaData, isOwner }) {
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false);
  const [mascotaLocal, setMascotaLocal] = useState({
    nombreMascota: mascotaData?.nombre || "",
    especie: mascotaData?.especie || "",
  });

  const [formData, setFormData] = useState({
    nombreMascota: "",
    especie: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // evita recargar la página
    setMascotaLocal({ ...formData });

    setFormData({ nombreMascota: "", especie: "" }); // limpia formulario
    setMostrarFormularioEditar(false); // oculta el formulario
  };

  const cancelarFormulario = () => {
    setFormData({ nombreMascota: "", especie: "" }); // limpia formulario
    setMostrarFormularioEditar(false);
  };

  // Actualizar estado local cuando cambien los datos de la mascota
  useEffect(() => {
    if (mascotaData) {
      setMascotaLocal({
        nombreMascota: mascotaData.nombre || "",
        especie: mascotaData.especie || "",
      });
    }
  }, [mascotaData]);

  return (
    <div className="descripcion-mascota">
      <img
        src={mascotaData?.foto || UserImage}
        alt={mascotaData?.nombre || "Mascota"}
      />
      <h2>
        {mascotaData?.nombre ||
          mascotaLocal.nombreMascota ||
          "Nombre de mascota"}
      </h2>
      <div className="informacion">
        <div className="mascota-info">
          <h4>Especie </h4>
          <p>{mascotaData?.especie || mascotaLocal.especie || "Especie"}</p>
        </div>
      </div>
      {isOwner && (
        <div className="descripcion-buttons">
          <button
            onClick={() => {
              setMostrarFormularioEditar(true);
            }}
          >
            Editar perfil
          </button>
          <button>Compartir</button>
        </div>
      )}
      <div className="form-wrapper">
        {mostrarFormularioEditar && isOwner && (
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: "20px" }}
            className="formulario"
          >
            <div className="formulario-item">
              <label htmlFor="nombreMascota">Nombre de la mascota:</label>
              <input
                id="nombreMascota"
                placeholder={mascotaData?.nombre || "Nombre de la mascota"}
                value={formData.nombreMascota}
                onChange={(e) =>
                  setFormData({ ...formData, nombreMascota: e.target.value })
                }
                required
              />
            </div>

            <div className="formulario-item">
              <label htmlFor="especie">Especie</label>
              <input
                id="especie"
                placeholder={mascotaData?.especie || "Especie de la mascota"}
                value={formData.especie}
                onChange={(e) =>
                  setFormData({ ...formData, especie: e.target.value })
                }
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Guardar</button>
              <button type="button" onClick={cancelarFormulario}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DescripcionMascota;
