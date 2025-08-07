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

function Agenda() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [vacunacion, setVacunacion] = useState([]);
  const [desparacitacion, setDesparacitacion] = useState([]);
  const [operacion, setOperacion] = useState([]);
  // Tipo seleccionado:;
  const [tipo, setTipo] = useState("vacunacion");
  const [formData, setFormData] = useState({
    fechaCita: "",
    caso: "",
    proximaCita: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // evita recargar la página

    const nuevoElemento = { ...formData };

    if (tipo === "vacunacion") {
      setVacunacion([...vacunacion, nuevoElemento]);
    } else if (tipo === "desparacitacion") {
      setDesparacitacion([...desparacitacion, nuevoElemento]);
    } else if (tipo === "operacion") {
      setOperacion([...operacion, nuevoElemento]);
    }

    setFormData({ fechaCita: "", caso: "", proximaCita: "" }); // limpia formulario
    setMostrarFormulario(false); // oculta el formulario
  };

  const cancelarFormulario = () => {
    setFormData({ fechaCita: "", caso: "", proximaCita: "" }); // limpia formulario
    setMostrarFormulario(false);
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
          <div className="form-btns">
            <button type="submit">Guardar</button>
            <button type="button" onClick={cancelarFormulario}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

Lista.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      fechaCita: PropTypes.string,
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

export default Agenda;
