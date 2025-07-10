import React from "react";
import {BotonTemplate} from "./components/Boton";
import { DateTemplate } from "./components/Cita";
import { NotiTemplate } from "./components/Notificacion"; // ajusta el path si es distinto
import Publicaciones from "./components/Publicaciones";
import ScrollContainer from "./components/Scroll";
import SearchInput from "./components/SearchInput";
import Navegador from "./components/Navegador";


function App() {
  return (
    <div>
      <h1>PetSociety</h1>
      <Navegador />
      <ScrollContainer>
        <BotonTemplate property1="blanco" className=""/>
        <BotonTemplate property1="default" className=""/>
        <DateTemplate />
        <SearchInput />
        <NotiTemplate className= "property-coment" property1="coment"/>
        {[...Array(30)].map((_, i) => ( /*para probar el scroll */
          <div key={i}>Item {i + 1}</div>
        ))}
      </ScrollContainer>
    </div>
  )
}

export default App;