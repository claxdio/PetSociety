// index.jsx
import React from "react";
import "./style.css";

const Cita = ({ fecha, peso, caso, proxima }) => {
  return (
    <div className="date-template">
      <div className="item">{fecha}</div>
      <div className="divider"></div>
      <div className="item">{peso}</div>
      <div className="divider"></div>
      <div className="item">{caso}</div>
      <div className="divider"></div>
      <div className="item">{proxima}</div>
    </div>
  );
};

export default Cita;