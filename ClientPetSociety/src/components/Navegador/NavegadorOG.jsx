import PropTypes from "prop-types";
import React from "react";
import { BotonSample } from "./BotonSample";
import { HorizontalInset } from "./HorizontalInset";
import { VerticalInset } from "./VerticalInset";
import "./style.css";

export const Navegador = ({ property1, className }) => {
  return (
    <div className={`navegador ${property1} ${className}`}>
      <div className="logo">
        {property1 === "default" && (
          <div className="overlap-group">
            <div className="text-wrapper">Logo</div>
          </div>
        )}

        {property1 === "vertical" && (
          <>
            <div className="perfil-foto" />

            <div className="div">Nombre</div>

            <HorizontalInset
              className="horizontal-inset-instance"
              divider="divider-5.svg"
            />
          </>
        )}
      </div>

      <div className="menu">
        {property1 === "default" && (
          <>
            <BotonSample
              className="boton-sample-instance"
              property1="default"
              text="Búsqueda"
            />
            <VerticalInset
              className="vertical-inset-instance"
              divider="divider-2.svg"
            />
            <BotonSample
              className="boton-sample-instance"
              property1="default"
              text="Foro"
            />
            <VerticalInset
              className="vertical-inset-instance"
              divider="divider-3.svg"
            />
            <BotonSample
              className="boton-sample-instance"
              property1="default"
              text="Localizar"
            />
          </>
        )}

        {property1 === "vertical" && (
          <>
            <div className="frame">
              <div className="text-wrapper-2">Página principal</div>
            </div>

            <div className="frame">
              <div className="text-wrapper-3">Buscar</div>
            </div>

            <div className="frame">
              <div className="text-wrapper-3">Foro</div>
            </div>

            <div className="frame">
              <div className="text-wrapper-3">Localización</div>
            </div>

            <div className="frame-2" />
          </>
        )}
      </div>

      <div className="usuario">
        {property1 === "default" && (
          <>
            <BotonSample
              className="boton-sample-instance"
              property1="default"
              text="Iniciar sesión"
            />
            <VerticalInset
              className="vertical-inset-instance"
              divider="divider-4.svg"
            />
            <BotonSample
              className="boton-sample-instance"
              property1="default"
              text="Mascotas"
            />
          </>
        )}

        {property1 === "vertical" && (
          <div className="text-wrapper-4">Acerca de</div>
        )}
      </div>
    </div>
  );
};

Navegador.propTypes = {
  property1: PropTypes.oneOf(["vertical", "default"]),
};