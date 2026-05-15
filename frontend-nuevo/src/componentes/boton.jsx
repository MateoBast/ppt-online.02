import React from 'react';
import { Link } from 'react-router-dom'; // <-- Agregalo acá
import './boton.css';

const Boton = ({ children, to, onClick, className = "" }) => {
  const clases = `boton ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={clases}>
        {children}
      </Link>
    );
  }
  return (
    <button className={clases} onClick={onClick}>
      {children}
    </button>
  );
};


export default Boton;
