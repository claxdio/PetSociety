import React, { useState } from "react";
import "./style.css";

function Form({ onClose, camposFormulario, onPublicar }) {
  const [formulario, setFormulario] = useState({});
  const [archivoNombre, setArchivoNombre] = useState("");
  const [enviando, setEnviando] = useState(false);

  

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormulario(prev => ({
        ...prev,
        [name]: file
      }));
      setArchivoNombre(file ? file.name : '');
    } else if (type === 'checkbox') {
      // Para multi-select con checkboxes
      const currentValue = formulario[name] || [];
      const numericValue = parseInt(value);
      
      if (e.target.checked) {
        setFormulario(prev => ({
          ...prev,
          [name]: [...currentValue, numericValue]
        }));
      } else {
        setFormulario(prev => ({
          ...prev,
          [name]: currentValue.filter(item => item !== numericValue)
        }));
      }
    } else {
      setFormulario(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;
    
    console.log('Datos del formulario antes de enviar:', formulario);
    
    setEnviando(true);
    try {
      await onPublicar(formulario);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setEnviando(false);
    }
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
                value={formulario[campo.nombre] || ''}
                onChange={handleChange}
                required={campo.required}
              />
            ) : campo.tipo === "select" ? (
              <select
                id={campo.nombre}
                name={campo.nombre}
                value={formulario[campo.nombre] || ''}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                {campo.opciones.map((opcion, index) => (
                  <option key={opcion} value={opcion}>
                    {campo.labels ? campo.labels[index] : opcion}
                  </option>
                ))}
              </select>
            ) : campo.tipo === "multi-select" ? (
              <div className="multi-select">
                {campo.opciones.map((opcion) => (
                  <label key={opcion.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={campo.nombre}
                      value={opcion.value}
                      onChange={handleChange}
                      checked={(formulario[campo.nombre] || []).includes(opcion.value)}
                    />
                    {opcion.label}
                  </label>
                ))}
              </div>
            ) : campo.tipo === "file" ? (
              <>
                <input
                  type="file"
                  id={campo.nombre}
                  name={campo.nombre}
                  accept={campo.accept || "image/*"}
                  onChange={handleChange}
                />
                {archivoNombre && <small>Archivo: {archivoNombre}</small>}
              </>
            ) : (
              <input
                type={campo.tipo}
                id={campo.nombre}
                name={campo.nombre}
                value={formulario[campo.nombre] || ''}
                onChange={handleChange}
                required={campo.required}
              />
            )}
          </div>
        ))}

        <button className="button" type="submit" disabled={enviando}>
          {enviando ? 'Publicando...' : 'Publicar'}
        </button>
        <button className="button" type="button" onClick={onClose} disabled={enviando}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default Form;
