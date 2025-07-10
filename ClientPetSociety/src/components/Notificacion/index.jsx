// NotiTemplate className= "property-coment" property1="coment"/>
import PropTypes from "prop-types";
import React from "react";
import icon from "./icon.svg";
import "./style.css";

export const NotiTemplate = ({ property1, className})=>{
    return (
        <div className={`noti-template ${className}`}>
        {property1 === "coment" ? (
            <>
            <div className="left">
                <img className="icon" alt="Icon" src={icon} />
                <div className={`nombre ${property1}`}>Nombre</div>
            </div>
            <div className="comentario">Comentario</div>
            </>
        ) : (
            <div className={`nombre ${property1}`}>notification</div>
        )}
        </div>

    );
};

NotiTemplate.propTypes = {
    property1: PropTypes.oneOf(["coment", "default"])
};