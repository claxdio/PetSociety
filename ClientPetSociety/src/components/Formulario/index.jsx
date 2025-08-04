import React, { useState } from "react";
import "./style.css";


const camposFormulario = [
  { nombre: "nombre", label: "Nombre", tipo: "texto" },
  { nombre: "email", label: "Correo electrónico", tipo: "email" },
  { nombre: "mensaje", label: "Mensaje", tipo: "textarea" },
  { nombre: "categoria", label: "Categoría", tipo: "select", opciones: ["General", "Sugerencia", "Bug"] },
  { nombre: "imagen", label: "Subir imagen", tipo: "file" },
];

function Form({ onClose, camposFormulario, onPublicar }) {
  const [formulario, setFormulario] = useState({});
  const [archivoNombre, setArchivoNombre] = useState("");

  

  const handleChange = (e) => {
  };


  const handleSubmit = async (e) => {
};




  return (
    <div className="overlay-lock">
      <form className="formulario-popup" onSubmit={handleSubmit}>
        <h2>Crear Publicación</h2>

        {camposFormulario.map((campo) => (
          <div key={campo.nombre} className="form-group">
            <label htmlFor={campo.nombre}>{campo.label}</label>

            {campo.tipo === "textarea" ? (
              <textarea
                id={campo.nombre}
                name={campo.nombre}
                onChange={handleChange}
              />
            ) : campo.tipo === "select" ? (
              <select
                id={campo.nombre}
                name={campo.nombre}
                onChange={handleChange}
              >
                {campo.opciones.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : campo.tipo === "file" ? (
              <>
                <input
                  type="file"
                  id={campo.nombre}
                  name={campo.nombre}
                  accept="image/*"
                  onChange={handleChange}
                />
                {archivoNombre && <small>Archivo: {archivoNombre}</small>}
              </>
            ) : (
              <input
                type={campo.tipo}
                id={campo.nombre}
                name={campo.nombre}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <button className="button" type="submit">Enviar</button>
        <button className="button" type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}

export default Form;
