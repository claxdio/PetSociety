import React, { useState, useEffect } from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function DescripcionMascota() {
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false);
  const [mascotaData, setMascotaData] = useState({
    nombreMascota: "",
    especie: "",
  });

  const [formData, setFormData] = useState({
    nombreMascota: "",
    especie: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // evita recargar la página
    setMascotaData({ ...formData });

    setFormData({ nombreMascota: "", especie: "" }); // limpia formulario
    setMostrarFormularioEditar(false); // oculta el formulario
  };

  const cancelarFormulario = () => {
    setFormData({ nombreMascota: "", especie: "" }); // limpia formulario
    setMostrarFormularioEditar(false);
  };

  return (
    <div className="descripcion-mascota">
      <img src={UserImage} alt="User" />
      <h2>{mascotaData.nombreMascota}</h2>
      <div className="informacion">
        <div className="mascota-info">
          <h4>Especie </h4>
          <p>{mascotaData.especie}</p>
        </div>
      </div>
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
      <div className="form-wrapper">
        {mostrarFormularioEditar && (
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: "20px" }}
            className="formulario"
          >
            <div className="formulario-item">
              <label htmlFor="nombreMascota">Nombre de la mascota:</label>
              <input
                id="nombreMascota"
                placeholder="Nombre de la mascota"
                value={formData.nombreMascota}
                onChange={(e) =>
                  setFormData({ ...formData, nombreMascota: e.target.value })
                }
                required
              />
            </div>

            <div className="formulario-item">
              <label htmlFor="especie">Descripción del caso:</label>
              <input
                id="especie"
                placeholder="Especie de la mascota"
                value={formData.especie}
                onChange={(e) =>
                  setFormData({ ...formData, especie: e.target.value })
                }
                required
              ></input>
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
