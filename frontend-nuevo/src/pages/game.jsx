import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Manos from '../componentes/manos';
import ContadorRegresivo from '../componentes/contador';
import { database, ref, onValue, update, get } from "../firebase";
import "./game.css";

const Game = () => {
  const { roomId, playerKey } = useParams();
  const navigate = useNavigate();
  const [playerChoice, setPlayerChoice] = useState(null);
  const [players, setPlayers] = useState(null);
  const [score, setScore] = useState(null);
  const roundProcessed = useRef(false);

  useEffect(() => {
    setPlayers(null);
    setScore(null);
    roundProcessed.current = false;
  }, [roomId]);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const roomData = snapshot.val();
      if (!roomData) return;

      setPlayers(roomData.players);
      setScore(roomData.score);

      if (roomData.roundFinished) {
        const winnerKey = roomData.winnerKey;
        const loserKey = roomData.loserKey;

        if (winnerKey === null && loserKey === null) {
          // Empate
          navigate(`/empataste/${roomId}`, { state: { players: roomData.players, score: roomData.score } });
        } else {
          const winner = roomData.players[winnerKey];
          const loser = roomData.players[loserKey];

          if (playerKey === winnerKey) {
            navigate(`/ganaste/${roomId}`, { state: { winner, loser, winnerKey, loserKey, score: roomData.score } });
          } else if (playerKey === loserKey) {
            navigate(`/perdiste/${roomId}`, { state: { winner, loser, winnerKey, loserKey, score: roomData.score } });
          }
        }

        // Reseteamos el flag para la próxima ronda
        update(ref(database, `rooms/${roomId}`), {
          roundFinished: false,
          winnerKey: null,
          loserKey: null,
        });
      }
    });

    return () => unsubscribe();
  }, [roomId, playerKey, navigate]);

  const enviarEleccion = async () => {
  if (roundProcessed.current) return;
  roundProcessed.current = true;

  try {
    if (!playerChoice) {
      alert("Debes hacer una elección antes de que termine el tiempo.");
      roundProcessed.current = false;
      return;
    }

    await update(ref(database, `rooms/${roomId}/players/${playerKey}`), {
      choice: playerChoice,
    });

    const snapshot = await get(ref(database, `rooms/${roomId}/players`));
    const playersData = snapshot.val();

    const p1Choice = playersData?.playerOne?.choice;
    const p2Choice = playersData?.playerTwo?.choice;

    if (p1Choice && p2Choice) {
      const ganador = determinarGanador(p1Choice, p2Choice);

      if (ganador === 'Empate') {
        // Reseteamos choices para sincronizar
        await update(ref(database, `rooms/${roomId}/players/playerOne`), { choice: null });
        await update(ref(database, `rooms/${roomId}/players/playerTwo`), { choice: null });

        // Reseteamos el estado de start a false
        await update(ref(database, `rooms/${roomId}/players/playerOne`), { start: false });
        await update(ref(database, `rooms/${roomId}/players/playerTwo`), { start: false });

        // Indicamos que la ronda terminó sin ganador
        await update(ref(database, `rooms/${roomId}`), {
          roundFinished: true,
          winnerKey: null,
          loserKey: null,
        });

        // Navegar a la pantalla de empate
        navigate(`/empataste/${roomId}`, { state: { players: playersData, score } });
      } else {
        const winnerKey = ganador === 'Player One gana' ? 'playerOne' : 'playerTwo';
        const loserKey = winnerKey === 'playerOne' ? 'playerTwo' : 'playerOne';

        await actualizarScore(winnerKey);

        await update(ref(database, `rooms/${roomId}`), {
          roundFinished: true,
          winnerKey,
          loserKey,
        });

        // Reseteamos choices para la próxima ronda
        await update(ref(database, `rooms/${roomId}/players/playerOne`), { choice: null });
        await update(ref(database, `rooms/${roomId}/players/playerTwo`), { choice: null });
      }
    }
  } catch (error) {
    console.error("Error en enviarEleccion:", error);
  } finally {
    roundProcessed.current = false;
  }
};

  const actualizarScore = async (winnerKey) => {
    const scoreRef = ref(database, `rooms/${roomId}/score`);

    try {
      const snapshot = await get(scoreRef);
      const currentScore = snapshot.val() || { playerOneScore: 0, playerTwoScore: 0 };

      const updates = {};
      if (winnerKey === 'playerOne') {
        updates.playerOneScore = currentScore.playerOneScore + 1;
      } else {
        updates.playerTwoScore = currentScore.playerTwoScore + 1;
      }

      await update(scoreRef, updates);
    } catch (error) {
      console.error("Error al actualizar el score:", error);
    }
  };

  const determinarGanador = (choiceOne, choiceTwo) => {
    if (choiceOne === choiceTwo) return 'Empate';
    if (
      (choiceOne === 'piedra' && choiceTwo === 'tijera') ||
      (choiceOne === 'tijera' && choiceTwo === 'papel') ||
      (choiceOne === 'papel' && choiceTwo === 'piedra')
    ) {
      return 'Player One gana';
    }
    return 'Player Two gana';
  };

  const manejarSeleccion = (opcion) => {
    setPlayerChoice(opcion);
  };

  return (
    <div className='contenedor-game'>
      <div className='contenido-central'>
        <ContadorRegresivo onFinish={enviarEleccion} />
        <Manos 
          manejarSeleccion={manejarSeleccion} 
          seleccionActual={playerChoice} 
          disabled={false}
        />
      </div>
    </div>
  );
};

export default Game;
