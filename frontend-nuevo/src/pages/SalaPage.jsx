import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Salapage.css";

const CrearSala = () => {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState(null);
  const [shortId, setShortId] = useState(null); // Estado para el shortId
  const navigate = useNavigate();

  const crearSala = async () => {
    if (!playerName) {
      setError("Tenés que poner tu nombre");
      return;
    }
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerOneName: playerName }),
      });
      const data = await response.json();
      console.log(data); // Acá ves qué te devuelve el backend
if (data.success) {
  setShortId(data.shortId); // Guardar el shortId en el estado
  localStorage.setItem('playerRole', 'playerOne'); // Asignar como jugador 1
        navigate(`/nombre-room/${data.roomId}`);
      }
    } catch (err) {
      setError("Error creando la sala");
    }
  };

  return (
    <div className="contenedorCrearSala">
      <input
        className="crearSalaInput"
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button className="crearSalaBoton" onClick={crearSala}>
        Crear Sala
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {shortId && (
        <div>
          <h2>¡Sala creada!</h2>
          <p>Compartí este código con tu amigo: <strong>{shortId}</strong></p>
        </div>
      )}
    </div>
  );
};

export default CrearSala;
