import React, { useState } from "react";
import "../styles/Locate.css";
import Navegador from "../components/Navegador";
import Sugerencia from "../components/Sugerencia";
import Button from "../components/Button/index";
import Mapa from "../components/Mapa";

import icono1 from "../assets/icons/icono1.png";
import icono2 from "../assets/icons/icono2.png";
import icono3 from "../assets/icons/icono3.png";
import icono4 from "../assets/icons/icono4.png";
import icono6 from "../assets/icons/eye-open.png";

const Locate = () => {
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [direccionMapa, setDireccionMapa] = useState("");

  const sugerencias = [
    {
      tipo: "Veterinarios",
      nombre: "Clínica Veterinaria San Ignacio",
      direccion: "San Ignacio de Loyola 305, Arica",
      horario: "Lunes a Sábado, 9:00 - 14:00; 15:00 - 19:00",
      telefono: "+56 9 6374 6807"
    },
    {
      tipo: "Veterinarios",
      nombre: "Hospital Veterinario Limari",
      direccion: "Gonzalo Cerda 1456, Arica",
      horario: "Lunes a Domingo, Abierto las 24 hrs",
      telefono: "+56 2 2272 5487"
    },
    {
      tipo: "Veterinarios",
      nombre: "Veterinaria Salud Animal",
      direccion: "18 de Septiembre 1449, Arica",
      horario: "Lunes a Sábado, 10:00 - 12:00; 16:00 - 18:30",
      telefono: "+56 9 8499 6811"
    },
    {
      tipo: "Veterinarios",
      nombre: "Aura - Centro Veterinario",
      direccion: "José Victorino Lastarria 1537, Arica",
      horario: "Lunes a Viernes, 08:00 - 00:00",
      telefono: "+56 9 4157 9072"
    },
    {
      tipo: "Veterinarios",
      nombre: "Veterinarias San Javier",
      direccion: "Coronel Benedicto 2164, Arica",
      horario: "Lunes a Sábado, 11:00 - 19:00",
      telefono: "+56 9 6567 8955"
    },
    {
      tipo: "Refugios",
      nombre: "Hotel de Mascotas Fonoguau",
      direccion: "Unnamed Rd, Arica",
      horario: "N.A.",
      telefono: "+56 9 9307 5175"
    },
    {
      tipo: "Refugios",
      nombre: "Mi Dulce Refugio",
      direccion: "José Morales Cares, Arica",
      horario: "N.A.",
      telefono: "+56 9 6177 0093"
    },
    {
      tipo: "Tienda de mascotas",
      nombre: "Puppy Happy",
      direccion: "Av. Diego Portales 1593, Arica",
      horario: "Lunes a Sábado, 9:00 - 21:30",
      telefono: "+56 9 9532 1544"
    },
    {
      tipo: "Tienda de mascotas",
      nombre: "Martika Tienda de accesorios",
      direccion: "Gral. Manuel Baquedano 533, Arica",
      horario: "Lunes a Sábado, 11:00 - 20:00",
      telefono: "+56 9 7651 9500"
    },
  ];

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
                onVerMas={(direccion) => setDireccionMapa(direccion)}
              />
            ))}
          </div>
        </div>

        {/* Centro */}
        <div className="locate-map">
          <Mapa direccion={direccionMapa} />
        </div>

        {/* Derecha */}
        <div className="locate-publication">Columna derecha</div>
      </div>
    </div>
  );
};

export default Locate;
