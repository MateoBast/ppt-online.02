import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Manos from "../componentes/manos";
import Boton from "../componentes/boton";
import "./ingresar.css";

const Ingresar = () => {
  const [roomId, setRoomId] = useState(""); // Estado para el shortId
  const [playerName, setPlayerName] = useState(""); // Estado para el nombre del jugador
  const navigate = useNavigate(); // Hook para redirigir

  // Definición de la función handleIngresar
 const handleIngresar = async () => {
  console.log("Click en ingresar a la sala");
  if (roomId && playerName) {
    try {
      const response = await fetch(`http://localhost:3001/rooms/short/${roomId}`);
      const data = await response.json();

      if (data.success) {
        const roomIdLargo = data.roomId;

        // Agregar al jugador 2 usando el roomId largo
        const addPlayerResponse = await fetch(`http://localhost:3001/rooms/${roomIdLargo}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName }),
        });

        const addPlayerData = await addPlayerResponse.json();

        if (addPlayerData.success) {
          // Asignar el rol del jugador en localStorage
          localStorage.setItem('playerRole', 'playerTwo'); // Asignar como jugador 2
          // Redirigir a la sala usando el roomId largo
          navigate(`/nombre-room/${roomIdLargo}?playerName=${playerName}`);
        } else {
          console.log("Error al agregar el jugador:", addPlayerData.message);
        }
      } else {
        console.log("Sala no encontrada");
      }
    } catch (error) {
      console.log("Error al ingresar a la sala:", error);
    }
  } else {
    console.log("Por favor, ingresa un código de sala y tu nombre.");
  }
};

  return (
    <div className='contenedor-ingresar'>
      <div className='contenedor-titulo-ingresar'>
        <p className='titulo1-ingresar'>Piedra </p>
        <p className='titulo2-ingresar'>Papel ó  </p>
        <p className='titulo3-ingresar'>Tijera </p>
      </div>
      <div className='contenedorBotonesIngresar'>
        <input
          className="inputIngresar"
          type="text"
          placeholder="tu nombre"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)} // Captura el valor del nombre
        />
        <input
          className="inputIngresar"
          type="text"
          placeholder="código"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)} // Captura el valor del input
        />
        <Boton className="boton-ingresar" onClick={handleIngresar}>ingresar a la sala</Boton>
      </div>
      <Manos 
  manejarSeleccion={() => {}} 
  seleccionActual={null} 
  disabled={true} 
/>
    </div>
  );
};

export default Ingresar;
