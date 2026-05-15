import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';

import miImagen from '../imagenes/ganaste.png'; // Importar imagen local
const Ganador = () => {
  return (
    <div>
      <img
        className='cartel-ganador'
        src={miImagen} 
        alt="Descripción de la imagen" 
      />
    </div>
  );
};

export default Ganador;