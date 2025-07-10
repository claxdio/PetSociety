// Usage <DateTemplate />;
import React from "react";
import "./style.css";

export const DateTemplate = () => {
    return (
        <div className="date-template">
            <div className="item">fecha cita</div>
            <div className="divider"></div>
            <div className="item">peso</div>
            <div className="divider"></div>
            <div className="item">caso</div>
            <div className="divider"></div>
            <div className="item">prox. cita</div>
        </div>


    )
}