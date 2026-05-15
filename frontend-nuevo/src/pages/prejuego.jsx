import React from 'react';
import Manos from "../componentes/manos";
import Boton from "../componentes/boton";
import CrearSala from "./SalaPage"
import "./prejuego.css";

const Prejuego = () => {
  // Definí la función handleTerminar aquí
  const handleTerminar = () => {
    console.log('¡Se terminó el conteo!');
    // Acá podés agregar la lógica que quieras cuando termine el contador
  };

    return (
    <div className='contenedor-prejuego'>
      <div className='contenedor-titulo-prejuego'>

       <p className='titulo1-pre'>Piedra </p>
       <p className='titulo2-pre'>Papel ó  </p>
       <p className='titulo3-pre'>Tijera </p>
      </div>
        <label  className='labelPrejuego'>Tu Nombre</label>
      <CrearSala className="boton-prejuego" />

      <Manos
  manejarSeleccion={() => {}} 
  seleccionActual={null} 
  disabled={true} 
/>
    </div>
  );
};

export default Prejuego;