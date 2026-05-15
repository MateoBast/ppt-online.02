import miImagen from '../imagenes/perdiste.png'; // Importar imagen local
import React from 'react';
const Perdedor = () => {
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

export default Perdedor;