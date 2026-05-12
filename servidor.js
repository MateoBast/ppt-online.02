const express = require("express");
const admin = require("firebase-admin");
const path = require("path");
const cors = require("cors"); // Importá cors
const { v4: uuidv4 } = require("uuid"); // Asegúrate de instalar la librería con npm install uuid

const app = express();
app.use(cors()); // Permití CORS para todas las solicitudes
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend/build")));

const PORT = process.env.PORT || 3001;

const serviceAccount = require("./config/firebaseServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pptonline-ed145-default-rtdb.firebaseio.com",
});

const db = admin.database();

function generarShortId(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.post("/rooms", async (req, res) => {
  const { playerOneName } = req.body;

  if (!playerOneName) {
    return res
      .status(400)
      .json({ error: "No se recibió el nombre del jugador" });
  }

  const roomId = uuidv4(); // ID largo
  const shortId = generarShortId(); // ID corto

  const newRoom = {
    shortId, // guardamos el shortId
    players: {
      playerOne: {
        idPlayerOne: `${Date.now()}`,
        name: playerOneName,
        choice: null,
        online: true,
        start: false,
      },
      playerTwo: {
        idPlayerTwo: null,
        name: null,
        choice: null,
        online: false,
        start: false,
      },
    },
  };

  try {
    await db.ref(`rooms/${roomId}`).set(newRoom);
    res.status(201).json({ success: true, roomId, shortId }); // devolvemos ambos
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/rooms/short/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const roomsSnapshot = await db
      .ref("rooms")
      .orderByChild("shortId")
      .equalTo(roomId)
      .once("value");
    const rooms = roomsSnapshot.val();

    if (!rooms) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const roomIdLargo = Object.keys(rooms)[0];
    const roomData = rooms[roomIdLargo];

    res.json({ success: true, roomId: roomIdLargo, roomData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para obtener una room por ID
app.get("/rooms/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const snapshot = await db.ref(`rooms/${roomId}`).once("value");
    const roomData = snapshot.val();

    if (roomData) {
      res.json({ success: true, room: roomData });
    } else {
      res.status(404).json({ success: false, message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/rooms/:roomId/join", async (req, res) => {
  const { roomId } = req.params;
  const { playerName } = req.body;

  try {
    const roomRef = db.ref(`rooms/${roomId}`);
    const roomSnapshot = await roomRef.once("value");

    if (!roomSnapshot.exists()) {
      return res.status(404).json({ error: "Room no encontrada" });
    }

    const roomData = roomSnapshot.val();
    const players = roomData.players || {};

    if (!players.playerOne || !players.playerOne.name) {
      players.playerOne = {
        idPlayerOne: `${Date.now()}`,
        name: playerName,
        choice: null,
        online: true,
        start: false,
      };
    } else if (!players.playerTwo || !players.playerTwo.name) {
      players.playerTwo = {
        idPlayerTwo: `${Date.now()}`,
        name: playerName,
        choice: null,
        online: true,
        start: false,
      };

      await db.ref(`rooms/${roomId}/score`).set({
        playerOneScore: 0,
        playerTwoScore: 0,
      });

      await db.ref(`rooms/${roomId}/currentGame`).set({});
    } else {
      return res.status(400).json({ error: "La room ya está llena" });
    }

    await roomRef.update({ players });
    res.status(200).json({ success: true, message: "Jugador unido a la room" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/rooms/:roomId/players/:playerKey/start", (req, res) => {
  const { roomId, playerKey } = req.params; // playerKey puede ser 'playerOne' o 'playerTwo'

  if (!rooms[roomId]) {
    return res
      .status(404)
      .json({ success: false, message: "Sala no encontrada" });
  }

  const player = rooms[roomId].players[playerKey];
  if (!player) {
    return res
      .status(404)
      .json({ success: false, message: "Jugador no encontrado" });
  }

  player.start = true;

  return res.json({
    success: true,
    message: "Jugador actualizado",
    room: rooms[roomId],
  });
});

// Resto de tu código para jugar, reiniciar, eliminar jugadores...

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
