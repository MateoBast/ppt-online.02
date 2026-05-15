import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { database } from "../firebase.js";
import Manos from "../componentes/manos";
import "./nombreRoom.css";

const NombreRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const playerName = queryParams.get("playerName");

  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomData(data);
      } else {
        setError("Sala no encontrada");
      }
    }, (error) => {
      setError("Error al leer la sala");
    });

    return () => {
      off(roomRef);
    };
  }, [roomId]);

  // Asignar rol según si ya existe playerOne en la sala
useEffect(() => {
  const role = localStorage.getItem('playerRole');
  console.log("Rol actual:", role); // Agregar este log
  if (!role && roomData) {
    if (roomData.players?.playerOne) {
      localStorage.setItem('playerRole', 'playerTwo');
      console.log("Asignando rol: playerTwo");
    } else {
      localStorage.setItem('playerRole', 'playerOne');
      console.log("Asignando rol: playerOne");
    }
  }
}, [roomData]);

  useEffect(() => {
    if (roomData && roomData.players?.playerOne && roomData.players?.playerTwo) {
      if (roomData.players.playerOne.name && roomData.players.playerTwo.name) {
        navigate(`/confirm/${roomId}`);
      }
    }
  }, [roomData, navigate, roomId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!roomData) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="contenedor-nombreRoom">
      <div className="header">
        <div className="jugadores">
          <span className="jugador">
            {roomData.players.playerOne.name} <strong>{roomData.players.playerOne.score}</strong>
          </span>
          <br />
          <span className="jugador">
            {roomData.players.playerTwo.name} <strong>{roomData.players.playerTwo.score}</strong>
          </span>
          {playerName && (
            <span className="jugador">
              {playerName}: <strong>0</strong>
            </span>
          )}
        </div>
        <div className="codigo-sala">
          <h2>
            Sala: <strong>{roomData.shortId}</strong>
          </h2>
        </div>
      </div>

      <h2 className="titulo-nomRoom">Compartí el código:</h2>
      <h1 className="codigo">{roomData.shortId}</h1>
      <h2 className="titulo-nomRoom">Con tu contrincante</h2>

      <Manos 
  manejarSeleccion={() => {}} 
  seleccionActual={null} 
  disabled={true} 
/>
    </div>
  );
};

export default NombreRoom;
