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

    setFormData({ fechaCita: "", peso: "", caso: "", proximaCita: "" }); // limpia formulario
    setMostrarFormulario(false); // oculta el formulario
  };
  return (
    <div className="Fechas">
      <div className="fecha">
        <h1>Fechas de vacunación</h1>
        <Lista data={vacunacion} />
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
        <Lista data={desparacitacion} />
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
        <Lista data={operacion} />
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
          <input
            type="text"
            placeholder="Fecha de la cita"
            value={formData.fechaCita}
            onChange={(e) =>
              setFormData({ ...formData, fechaCita: e.target.value })
            }
            required
          />
          <br />
          <input
            type="text"
            placeholder="Peso"
            value={formData.peso}
            onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
            required
          />
          <br />
          <textarea
            placeholder="Descripción del caso"
            value={formData.caso}
            onChange={(e) => setFormData({ ...formData, caso: e.target.value })}
            required
          ></textarea>
          <input
            type="text"
            placeholder="Fecha de la próxima cita"
            value={formData.proximaCita}
            onChange={(e) =>
              setFormData({ ...formData, proximaCita: e.target.value })
            }
            required
          />
          <br />
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
};

function Lista({ data }) {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className="tarjeta">
          <p>
            <strong>Fecha:</strong> {item.fechaCita}
          </p>
          <p>
            <strong>Peso:</strong> {item.peso}
          </p>
          <p>
            <strong>Caso:</strong> {item.caso}
          </p>
          <p>
            <strong>Próxima cita:</strong> {item.proximaCita}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Fechas;
