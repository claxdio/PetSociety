import React, { useState } from "react";
import "./style.css";
import PropTypes from "prop-types";

// PropTypes para el componente Fechas (opcional ya que no recibe props)
// Fechas.propTypes = {
//   fechaCita: PropTypes.string.isRequired,
//   peso: PropTypes.string.isRequired,
//   caso: PropTypes.string.isRequired,
//   proximaCita: PropTypes.string.isRequired,
// };

function Fechas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [vacunacion, setVacunacion] = useState([]);
  const [desparacitacion, setDesparacitacion] = useState([]);
  const [operacion, setOperacion] = useState([]);
  // Tipo seleccionado:;
  const [tipo, setTipo] = useState("vacunacion");
  const [formData, setFormData] = useState({
    fechaCita: "",
    peso: "",
    caso: "",
    proximaCita: "",
  });
  const [errores, setErrores] = useState({
    peso: "",
  });

  // Función para validar el peso
  const validarPeso = (peso) => {
    if (!peso.trim()) {
      return "El peso es requerido";
    }

    // Permitir formato: número + unidad (ej: "5.2 kg", "12 lbs", "3.5")
    const pesoRegex = /^(\d+(?:\.\d+)?)\s*(kg|lbs|g|lb)?$/i;
    const match = peso.match(pesoRegex);

    if (!match) {
      return "Formato inválido. Use: número + unidad (ej: 5.2 kg, 12 lbs)";
    }

    const valor = parseFloat(match[1]);
    const unidad = match[2]?.toLowerCase() || "kg";

    // Validar rangos según la unidad
    if (unidad === "kg" && (valor < 0.1 || valor > 200)) {
      return "El peso debe estar entre 0.1 y 200 kg";
    }
    if (unidad === "lbs" && (valor < 0.2 || valor > 440)) {
      return "El peso debe estar entre 0.2 y 440 lbs";
    }
    if (unidad === "g" && (valor < 100 || valor > 200000)) {
      return "El peso debe estar entre 100g y 200kg";
    }
    if (unidad === "lb" && (valor < 0.2 || valor > 440)) {
      return "El peso debe estar entre 0.2 y 440 lb";
    }

    return ""; // Sin errores
  };

  const handlePesoChange = (e) => {
    const nuevoPeso = e.target.value;
    setFormData({ ...formData, peso: nuevoPeso });

    // Validar en tiempo real
    const errorPeso = validarPeso(nuevoPeso);
    setErrores({ ...errores, peso: errorPeso });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // evita recargar la página

    // Validar todos los campos antes de enviar
    const errorPeso = validarPeso(formData.peso);

    if (errorPeso) {
      setErrores({ peso: errorPeso });
      return; // No enviar si hay errores
    }

    const nuevoElemento = { ...formData };

    if (tipo === "vacunacion") {
      setVacunacion([...vacunacion, nuevoElemento]);
    } else if (tipo === "desparacitacion") {
      setDesparacitacion([...desparacitacion, nuevoElemento]);
    } else if (tipo === "operacion") {
      setOperacion([...operacion, nuevoElemento]);
    }

    setFormData({ fechaCita: "", peso: "", caso: "", proximaCita: "" }); // limpia formulario
    setErrores({ peso: "" }); // limpia errores
    setMostrarFormulario(false); // oculta el formulario
  };

  // Función para formatear la fecha para mostrar
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="Fechas">
      <div className="fecha">
        <h1>Fechas de vacunación</h1>
        <Lista data={vacunacion} formatearFecha={formatearFecha} />
        <button
          onClick={() => {
            setTipo("vacunacion");
            setMostrarFormulario(true);
          }}
        >
          +
        </button>
      </div>

      <div className="ficha">
        <h1>Fechas de desparacitación</h1>
        <Lista data={desparacitacion} formatearFecha={formatearFecha} />
        <button
          onClick={() => {
            setTipo("desparacitacion");
            setMostrarFormulario(true);
          }}
        >
          +
        </button>
      </div>

      <div className="ficha">
        <h1>Fechas de operaciones</h1>
        <Lista data={operacion} formatearFecha={formatearFecha} />
        <button
          onClick={() => {
            setTipo("operacion");
            setMostrarFormulario(true);
          }}
        >
          +
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div className="form-group">
            <label htmlFor="fechaCita">Fecha de la cita:</label>
            <input
              type="date"
              id="fechaCita"
              placeholder="Fecha de la cita"
              value={formData.fechaCita}
              onChange={(e) =>
                setFormData({ ...formData, fechaCita: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="peso">Peso:</label>
            <input
              type="text"
              id="peso"
              placeholder="Ej: 5.2 kg, 12 lbs"
              value={formData.peso}
              onChange={handlePesoChange}
              className={errores.peso ? "error" : ""}
              required
            />
            {errores.peso && (
              <div className="error-message">{errores.peso}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="caso">Descripción del caso:</label>
            <textarea
              id="caso"
              placeholder="Descripción del caso"
              value={formData.caso}
              onChange={(e) =>
                setFormData({ ...formData, caso: e.target.value })
              }
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="proximaCita">Fecha de la próxima cita:</label>
            <input
              type="date"
              id="proximaCita"
              placeholder="Fecha de la próxima cita"
              value={formData.proximaCita}
              onChange={(e) =>
                setFormData({ ...formData, proximaCita: e.target.value })
              }
              required
            />
          </div>

          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  );
}

Lista.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      fechaCita: PropTypes.string,
      peso: PropTypes.string,
      caso: PropTypes.string,
      proximaCita: PropTypes.string,
    })
  ),
  formatearFecha: PropTypes.func.isRequired,
};

function Lista({ data, formatearFecha }) {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className="tarjeta">
          <p>
            <strong>Fecha:</strong> {formatearFecha(item.fechaCita)}
          </p>
          <p>
            <strong>Peso:</strong> {item.peso}
          </p>
          <p>
            <strong>Caso:</strong> {item.caso}
          </p>
          <p>
            <strong>Próxima cita:</strong> {formatearFecha(item.proximaCita)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Fechas;
