import React, { useState } from "react";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import "./style.css";

function Form({ onClose, camposFormulario, onPublicar, onCrear, title="Formulario"}) {
  const [formulario, setFormulario] = useState({});
  const [opcionesDinamicas, setOpcionesDinamicas] = useState(() => {
    const initial = {};
    camposFormulario.forEach(campo => {
      if (campo.tipo === "multi-select" && campo.creable) {
        initial[campo.nombre] = campo.opciones || [];
      }
    });
    return initial;
  });

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
      // Este bloque puede eliminarse si no usas checkboxes para multi-select
      const currentValue = formulario[name] || [];
      const numericValue = isNaN(value) ? value : parseInt(value);

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
        <h2>{title}</h2>

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
                required={campo.required}
              >
                <option value="">Seleccionar...</option>
                {campo.opciones.map((opcion, index) => (
                  <option key={opcion.value || opcion} value={opcion.value || opcion}>
                    {campo.labels ? campo.labels[index] : (opcion.label || opcion)}
                  </option>
                ))}
              </select>
            ) : campo.tipo === "multi-select" ? (
              campo.creable ? (
                <CreatableSelect
                  isMulti
                  name={campo.nombre}
                  options={opcionesDinamicas[campo.nombre]}
                  value={opcionesDinamicas[campo.nombre].filter(opcion =>
                    (formulario[campo.nombre] || []).includes(opcion.value)
                  )}
                  onChange={(selectedOptions) => {
                    setFormulario(prev => ({
                      ...prev,
                      [campo.nombre]: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                    }));
                  }}
                  onCreateOption={async (inputValue) => {
                    try {
                      // Crear la categoría en el backend y obtener el nuevo valor
                      const nuevaOpcion = await onCrear(inputValue);
                      // Agregar la nueva opción a las opciones visibles
                      campo.opciones.push(nuevaOpcion);
                      // Actualizar el formulario para incluir la nueva categoría
                      setFormulario(prev => ({
                        ...prev,
                        [campo.nombre]: [...(prev[campo.nombre] || []), nuevaOpcion.value]
                      }));
                    } catch (error) {
                      alert('No se pudo crear la categoría.');
                    }
                  }}
                />
              ) : (
                <Select
                  isMulti
                  name={campo.nombre}
                  options={campo.opciones}
                  value={campo.opciones.filter(opcion =>
                    (formulario[campo.nombre] || []).includes(opcion.value)
                  )}
                  onChange={(selectedOptions) => {
                    setFormulario(prev => ({
                      ...prev,
                      [campo.nombre]: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                    }));
                  }}
                />
              )
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