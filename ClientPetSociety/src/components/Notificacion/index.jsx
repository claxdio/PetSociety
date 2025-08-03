import PropTypes from 'prop-types'
import './style.css'

export const Notificacion = ({ property1, className }) => {
  return (
    <div className={`notificacion ${className}`}>
      {property1 === "coment" ? (
        <div className="contenido-comentario">
          <span>Nuevo comentario</span>
        </div>
      ) : (
        <div className="contenido-default">
          <span>Nueva notificación</span>
        </div>
      )}
    </div>
  )
}

Notificacion.propTypes = {
  property1: PropTypes.oneOf(["coment", "default"]),
  className: PropTypes.string
}