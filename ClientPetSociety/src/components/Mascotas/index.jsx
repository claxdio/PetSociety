import React from "react";
import "./style.css";

const Mascotas = ({ items }) => {
  return (
    <div className="scrollable-list">
      {items.map((item, index) => (
        <div key={index} className="list-item">
          <div className="circle circle-normal">
            {item.foto ? (
              <img 
                src={item.foto} 
                alt={item.nombre} 
                className="pet-photo"
              />
            ) : (
              <div className="no-photo">
                {item.nombre ? item.nombre.charAt(0).toUpperCase() : "M"}
              </div>
            )}
          </div>
          <div className="name">{item.nombre}</div>
        </div>
      ))}

      {/* Item fijo al final */}
    </div>
  );
};

export default Mascotas;
