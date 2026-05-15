import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Boton from "../componentes/boton";
import "./empataste.css";

const Empataste = () => {
  const location = useLocation();
  const { players, score } = location.state || {};
  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleVolverAJugar = () => {
    // Navegar a la ruta de confirmación
    navigate(`/confirm/${roomId}`);
  };

  return (
    <div className="contenedor-duelo-emp">
      <div className="overlay-amarillo-emp"></div>
      <h2 className="titulo-emp">¡Empate!</h2>
      <div className="score-emp">
        <h3 className="score-titulo">Resultado:</h3>
        <p className="score-player">{players?.playerOne?.name}: {score?.playerOneScore || 0}</p>
        <p className="score-player">{players?.playerTwo?.name}: {score?.playerTwoScore || 0}</p>
      </div>
      <Boton className="boton-emp" onClick={handleVolverAJugar}>Volver a jugar</Boton>
    </div>
  );
};

export default Empataste;
