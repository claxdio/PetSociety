import PropTypes from "prop-types";
import React from "react";
//import boton from "./boton.png";
//import image from "./image.png";
import "./style.css";

export const BotonTemplate = ({property1, className})=>{
    return (
        <div className={`boton-template ${property1} ${className}`}>
            {property1 === "blanco" ? "blanco": "default"}
        </div>
    );
};

BotonTemplate.propTypes = {
    property1: PropTypes.oneOf(["blanco", "default"])
}

export default BotonTemplate;