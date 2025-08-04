import Navegador from "../components/Navegador";
import Descripcion from "../components/DescripcionDueño";
import Consulta from "../components/Consulta";
import Chats from "../components/Chats";
import "../styles/SpecificForum.css";

function SpecificForum() {
  return (
    <div>
      <header>
        <Navegador />
      </header>

      <main>
        {/* Columna izquierda */}
        <div className="specific-forum-user">
          <Descripcion />
        </div>

        {/* Columna central */}
        <div className="specific-forum-content">
          <Consulta />
          <Consulta />
          <Consulta />
        </div>

        {/* Columna derecha */}
        <div className="specific-forum-chats">
          <Chats />
        </div>
      </main>
    </div>
  );
}

export default SpecificForum;
