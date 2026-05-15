import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database, ref, onValue, update } from "../firebase";
import Manos from '../componentes/manos';
import Boton from '../componentes/boton';
import "./confirm.css";

const Confirm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameData(data);
      } else {
        setError("Sala no encontrada");
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const manejarJugar = () => {
    const playerRole = localStorage.getItem('playerRole');
    if (!playerRole) {
      setError("No se encontró el rol del jugador");
      return;
    }

    const playerStartRef = ref(database, `rooms/${roomId}/players/${playerRole}`);

    update(playerStartRef, { start: true })
      .then(() => {
        navigate(`/esperando/${roomId}`);
      })
      .catch(() => {
        setError("Error al actualizar el estado del jugador");
      });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!gameData) return <p>Cargando...</p>;

  const { players } = gameData;
  const playerOneId = Object.keys(players)[0];
  const playerTwoId = Object.keys(players)[1];

  if (!players[playerOneId] || !players[playerTwoId]) {
    return <p>Cargando jugadores...</p>;
  }

  return (
    <div className='contenedor-confirm'>
      <div className="Header-confirm">
        <div className="contenedorNames-confrim">
          <p className="nombre-confirm">{players[playerOneId].name}</p>
          <p className="nombre-confirm">{players[playerTwoId].name}</p>
        </div>
        <div className="contenedorId-confirm">
          <p className="id-confirm">Sala</p>
          <p className="id-confirm">{gameData.shortId}</p>
        </div>
      </div>
      <div className="contenedorTexto-confrim">
        <h2 className="texto-confrim">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</h2>
      </div>
      <Boton className="boton-confirm" onClick={manejarJugar}>¡jugar!</Boton>
      <Manos className="manos-confirm" />
    </div>
  );
};

export default Confirm;
