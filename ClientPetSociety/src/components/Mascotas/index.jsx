import React from "react";
import "./style.css";

const Mascotas = ({ items }) => {
  return (
    <div className="scrollable-list">
      {items.map((item, index) => (
        <div key={index} className="list-item">
          <div className="circle circle-normal"></div>
          <div className="name">{item.nombre}</div>
        </div>
      ))}

      {/* Item fijo al final */}
    </div>
  );
};

export default Mascotas;
