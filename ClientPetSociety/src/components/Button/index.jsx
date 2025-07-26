import React from "react";
import "./style.css";

const Button = ({ icono, texto, onClick, width = "200px", height = "55px", iconStyle = {width: "70%", height: "70%"} }) => {
  return (
    <button
      className="custom-button"
      onClick={onClick}
      style={{ width, height }}
    >
      {icono && (
        <img
          src={icono}
          alt={texto || "icono"}
          className="button-icon"
          //style={{ width: "70%", height: "70%", objectFit: "contain" }}
          style={{ ...iconStyle}}
        />
      )}
      {texto && <span>{texto}</span>}
    </button>
  );
};

export default Button;
