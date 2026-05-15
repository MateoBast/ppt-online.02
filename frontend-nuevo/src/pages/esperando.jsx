import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database, ref, onValue, set } from "../firebase";
import "./esperando.css";

const Esperando = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState(null);
  const [score, setScore] = useState(null);
  const [shortId, setShortId] = useState("");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(data.players);
        setScore(data.score);
        setShortId(data.shortId || "");

        const playerRole = localStorage.getItem("playerRole");
        console.log("Rol del jugador:", playerRole); // Log para verificar el rol
        if (playerRole && data.players) {
          setPlayerName(data.players[playerRole]?.name || "");
        }
      } else {
        setError("Sala no encontrada");
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    console.log("Estado de los jugadores:", players); // Log de estado de jugadores
    if (players) {
      const allReady = players.playerOne.start && players.playerTwo.start;
      if (allReady) {
        navigate(`/game/${roomId}/${localStorage.getItem("playerRole")}`); // Navegar con playerRole
      }
    }
  }, [players, navigate, roomId]);

  const handleStart = () => {
    const playerRole = localStorage.getItem("playerRole");
    console.log("Jugador que presionó jugar:", playerRole);
    if (!playerRole) {
      console.error("No se encontró el rol del jugador");
      return;
    }

    const startRef = ref(database, `rooms/${roomId}/players/${playerRole}/start`);

    set(startRef, true)
      .then(() => {
        console.log(`${playerRole} empezó la partida`);
      })
      .catch((error) => {
        console.error("Error al actualizar start:", error);
      });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!players || !score) return <p>Cargando...</p>;

  const playerOne = players.playerOne;
  const playerTwo = players.playerTwo;

  const waitingPlayerName = playerOne.start ? playerTwo.name : playerOne.name;

  return (
    <div className="contenedor-esperando">
      <div className="header-esperando">
        <div className="nombres-esperando">
          <p className="nombre-esperando">{playerOne.name}: <span className="score-esperando">{score.playerOneScore}</span></p>
          <p className="nombre-esperando">{playerTwo.name}: <span className="score-esperando">{score.playerTwoScore}</span></p>
        </div>
        <div className="id-sala">
          <p className="textoSala-esperando">Sala: {shortId}</p>
        </div>
      </div>
      <div className="contenedorTitulo-esperando">
        <h2 className="titulo-esperando">
          Esperando a que <strong>{waitingPlayerName}</strong> presione ¡Jugar!...
        </h2>
      </div>
    </div>
  );
};

export default Esperando;
