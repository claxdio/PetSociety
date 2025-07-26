import React from "react";
import "./style.css";

function Sugerencia({ nombre, direccion, horario, telefono }) {
  
  const handleMasInformacion = () => {
    console.log("Hola mundo");
  };

  return (
    <div className="sugerencia-card">
      <h3 className="sugerencia-nombre">{nombre}</h3>
      <p className="sugerencia-direccion">{direccion}</p>
      <p className="sugerencia-horario">{horario}</p>
      <p className="sugerencia-telefono">{telefono}</p>
      <button className="sugerencia-mas-info" onClick={handleMasInformacion}>
        &gt; Más información
      </button>
    </div>
  );
}

export default Sugerencia;