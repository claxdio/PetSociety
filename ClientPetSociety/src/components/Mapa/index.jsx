import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const centerDefault = {
  lat: -18.4783, // Arica
  lng: -70.3126,
};

const Mapa = ({ direccion }) => {
  const [coordenadas, setCoordenadas] = useState(null);
  const [apiCargada, setApiCargada] = useState(false);

  // Cargar la API de Google Maps solo una vez
  useEffect(() => {
    if (window.google) {
      setApiCargada(true);
      return;
    }

    const scriptExistente = document.getElementById("google-maps-script");

    if (!scriptExistente) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAJFXo1bjnU037dOcdXmNpN7IJ5CbVADFo`;
      script.async = true;
      script.defer = true;
      script.onload = () => setApiCargada(true);
      document.body.appendChild(script);
    } else {
      scriptExistente.onload = () => setApiCargada(true);
    }
  }, []);

  // Geocodificar la dirección una vez que la API esté cargada
  useEffect(() => {
    if (!direccion || !apiCargada || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: direccion }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        setCoordenadas({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        console.error("Geocoding fallido:", status);
      }
    });
  }, [direccion, apiCargada]);

  // Esperar a que la API esté cargada
  if (!apiCargada) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coordenadas || centerDefault}
      zoom={14}
    >
      {coordenadas && <Marker position={coordenadas} />}
    </GoogleMap>
  );
};

export default Mapa;
