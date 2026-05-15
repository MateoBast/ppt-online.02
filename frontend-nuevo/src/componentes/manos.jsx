import React from 'react';
import manoPiedra from '../imagenes/piedra.png';
import manoPapel from '../imagenes/papel.png';
import manoTijera from '../imagenes/tijera.png';
import "./manos.css";

const Manos = ({ manejarSeleccion, seleccionActual, disabled }) => {
  return (
    <div className="contenedor-manos">
      <img
        className={`mano piedra ${
          seleccionActual
            ? (seleccionActual === 'piedra' ? 'seleccionada' : 'no-seleccionada')
            : ''
        }`}
        src={manoPiedra}
        alt="Piedra"
        onClick={disabled ? undefined : () => manejarSeleccion('piedra')}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      />
      <img
        className={`mano papel ${
          seleccionActual
            ? (seleccionActual === 'papel' ? 'seleccionada' : 'no-seleccionada')
            : ''
        }`}
        src={manoPapel}
        alt="Papel"
        onClick={disabled ? undefined : () => manejarSeleccion('papel')}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      />
      <img
        className={`mano tijera ${
          seleccionActual
            ? (seleccionActual === 'tijera' ? 'seleccionada' : 'no-seleccionada')
            : ''
        }`}
        src={manoTijera}
        alt="Tijera"
        onClick={disabled ? undefined : () => manejarSeleccion('tijera')}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      />
    </div>
  );
};




export default Manos;
