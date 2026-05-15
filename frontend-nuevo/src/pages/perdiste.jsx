import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./perdiste.css";
import Perdedor from "../componentes/cartel-perdiste";
import Boton from "../componentes/boton";
import { database, ref, onValue, update } from "../firebase";

const Perdiste = () => {
  const location = useLocation();
  const { winner, loser, winnerKey, loserKey } = location.state || {};
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState({ playerOneScore: 0, playerTwoScore: 0 });

  useEffect(() => {
    const scoreRef = ref(database, `rooms/${roomId}/score`);
    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setScore(data);
    });
    return () => unsubscribe();
  }, [roomId]);

  const handleVolverAJugar = async () => {
    // Limpiar elecciones en Firebase
    await update(ref(database, `rooms/${roomId}/players/playerOne`), { choice: null, start: false });
    await update(ref(database, `rooms/${roomId}/players/playerTwo`), { choice: null, start: false });

    // Navegar a la pantalla de confirmación
    navigate(`/confirm/${roomId}`);
  };

  return (
    <div className="contenedor-perdiste">
      <div className="perd-overlay-rojo"></div>
      <Perdedor />
      <div className="score">
        <h2 className="titulo-perdiste">Resultado</h2>
        <p className="nombre-score">{winner?.name}: {score?.[winnerKey + 'Score'] || 0}</p>
        <p className="nombre-score">{loser?.name}: {score?.[loserKey + 'Score'] || 0}</p>
      </div>
      <Boton className="boton-ganaste" onClick={handleVolverAJugar}>
        Volver a jugar
      </Boton>
    </div>
  );
};

export default Perdiste;
