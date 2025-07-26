import React, { useState } from "react";
import "../styles/Locate.css";
import Navegador from "../components/Navegador";
import Sugerencia from "../components/Sugerencia"; // Nuevo nombre del componente
import Button from "../components/Button/index";

import icono1 from "../assets/icons/icono1.png";  
import icono2 from "../assets/icons/icono2.png";
import icono3 from "../assets/icons/icono3.png";
import icono4 from "../assets/icons/icono4.png";
import icono5 from "../assets/icons/lupa.png";
import icono6 from "../assets/icons/eye-open.png";

const Locate = () => {
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null); // Nuevo estado

  const sugerencias = [
    {
      tipo: "Veterinarios",
      nombre: "Veterinaria Los Andes",
      direccion: "Av. Principal 123, Santiago",
      horario: "Lunes a Sábado, 9:00 - 18:00",
      telefono: "+56 9 1234 5678"
    },
    {
      tipo: "Veterinarios",
      nombre: "Clínica Animal Sur",
      direccion: "Calle Sur 456, Concepción",
      horario: "Lunes a Viernes, 10:00 - 19:00",
      telefono: "+56 9 8765 4321"
    },
    {
      tipo: "Refugios",
      nombre: "Refugio Animal Esperanza",
      direccion: "Camino Rural s/n, Chillán",
      horario: "Lunes a Domingo, 10:00 - 17:00",
      telefono: "+56 9 3333 4444"
    },
    {
      tipo: "Tienda de mascotas",
      nombre: "PetStore HappyPets",
      direccion: "Mall Plaza Local 25, Valparaíso",
      horario: "Todos los días, 9:00 - 21:00",
      telefono: "+56 9 5555 6666"
    },
    {
      tipo: "Tienda de mascotas",
      nombre: "PetStore AngryPets",
      direccion: "Mall Plaza Local 25, Valparaíso",
      horario: "Todos los días, 9:00 - 21:00",
      telefono: "+56 9 5555 6666"
    },{
      tipo: "Tienda de mascotas",
      nombre: "PetStore HungryPets",
      direccion: "Mall Plaza Local 25, Valparaíso",
      horario: "Todos los días, 9:00 - 21:00",
      telefono: "+56 9 5555 6666"
    },{
      tipo: "Tienda de mascotas",
      nombre: "PetStore SadPets",
      direccion: "Mall Plaza Local 25, Valparaíso",
      horario: "Todos los días, 9:00 - 21:00",
      telefono: "+56 9 5555 6666"
    }
  ];

  // Filtrado por tipo (y podrías agregar por texto también si quieres)
  const sugerenciasFiltradas = sugerencias.filter(item => {
    const coincideTipo = !tipoSeleccionado || item.tipo === tipoSeleccionado;

    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto =
      item.nombre.toLowerCase().includes(textoBusqueda) ||
      item.direccion.toLowerCase().includes(textoBusqueda) ||
      item.telefono.toLowerCase().includes(textoBusqueda) ||
      item.horario.toLowerCase().includes(textoBusqueda);

    return coincideTipo && coincideTexto;
  });

  return (
    <div className="locate-container">
      <Navegador />

      <div className="locate-buttons">
        <Button 
          icono={icono1}
          texto="Mascotas perdidas"
          onClick={() => setTipoSeleccionado("Mascotas perdidas")}
          iconStyle={{ width: "30px", height: "30px" }}
        />
        <Button 
          icono={icono2}
          texto="Veterinarios"
          onClick={() => setTipoSeleccionado("Veterinarios")}
          iconStyle={{ width: "30px", height: "30px" }}
        />
        <Button 
          icono={icono3}
          texto="Refugios"
          onClick={() => setTipoSeleccionado("Refugios")}
          iconStyle={{ width: "30px", height: "30px" }}
        />
        <Button 
          icono={icono4}
          texto="Tienda de mascotas"
          onClick={() => setTipoSeleccionado("Tienda de mascotas")}
          iconStyle={{ width: "60px", height: "30px" }}
        />
        <Button 
          icono={icono6}
          texto="Todos" 
          onClick={() => setTipoSeleccionado(null)} 
          iconStyle={{ width: "30px", height: "30px" }} 
        />
      </div>

      <div className="locate-grid">
        {/* Columna izquierda */}
        <div className="locate-search">
          <h2 className="locate-title">Localizador</h2>

          <div className="locate-search-bar">
            <input
              type="text"
              className="locate-input"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="locate-sugerencias">
            {sugerenciasFiltradas.map((item, index) => (
              <Sugerencia
                key={index}
                tipo={item.tipo}
                nombre={item.nombre}
                direccion={item.direccion}
                horario={item.horario}
                telefono={item.telefono}
              />
            ))}
          </div>
        </div>

        {/* Centro */}
        <div className="locate-map">Centro</div>

        {/* Derecha */}
        <div className="locate-publication">Columna derecha</div>
      </div>
    </div>
  );
};

export default Locate;
