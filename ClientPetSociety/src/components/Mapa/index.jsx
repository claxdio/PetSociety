import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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

  useEffect(() => {
    if (!direccion) return;

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
  }, [direccion]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAJFXo1bjnU037dOcdXmNpN7IJ5CbVADFo"> {/* ← PON AQUÍ TU CLAVE */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordenadas || centerDefault}
        zoom={14}
      >
        {coordenadas && <Marker position={coordenadas} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Mapa;
