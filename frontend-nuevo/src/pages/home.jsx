import React from 'react'; // Eliminar useRef
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Manos from '../componentes/manos';
import Boton from '../componentes/boton';
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='contenedor-home'>
      <div className='contenedor-titulo'>

       <p className='titulo1'>Piedra </p>
       <p className='titulo2'>Papel ó  </p>
       <p className='titulo3'>Tijera </p>
      </div>
      <div className='contenedorBotones'>
        
      <Boton to="/Prejuego">Nuevo juego</Boton>
      <Boton to="/ingresar" className="boton2">ingresar a una sala</Boton>
      </div>
      <Manos 
  manejarSeleccion={() => {}} 
  seleccionActual={null} 
  disabled={true} 
/>
    </div>
  );
};

export default Home;