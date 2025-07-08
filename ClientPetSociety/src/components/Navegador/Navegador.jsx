import React from "react";
import "./Navegador.css";

export const Navegador = ({ variant = "default" }) => {
  return (
    <nav className={`navegador ${variant}`}>
      <div className="logo">Logo</div>
      <ul className="menu">
        <li>Inicio</li>
        <li>Productos</li>
        <li>Contacto</li>
      </ul>
    </nav>
  );
};