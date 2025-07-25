import React from "react";
import "./style.css";

const Button = ({ icono, texto, onClick }) => {
  return (
    <button className="custom-button" onClick={onClick}>
      {icono && <img src={icono} alt={texto} className="button-icon" />}
      <span>{texto}</span>
    </button>
  );
};

export default Button;
