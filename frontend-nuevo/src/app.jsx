import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home'; 
import Ingresar from "./pages/ingresar";
import Prejuego from './pages/prejuego';
import SalaPage from "./pages/SalaPage"; 
import NombreRoom from "./pages/nombreRoom";
import Confirm from "./pages/confirm"
import Game from "./pages/game"
import Esperando from"./pages/esperando"
import Ganaste from './pages/ganaste';
import Perdiste from "./pages/perdiste";
import Empataste from "./pages/empataste";




const App = () => {
  return (
    <Router>
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/ingresar" element={<Ingresar />} />
    <Route path="/prejuego" element={<Prejuego />} />
    <Route path="/crear-sala" element={<SalaPage />} />
    <Route path="/nombre-room/:roomId" element={<NombreRoom />} />
    <Route path="/confirm/:roomId" element={<Confirm />} />
    <Route path="/esperando/:roomId" element={<Esperando />} />
    <Route path="/game/:roomId/:playerKey" element={<Game />} /> {/* Ruta con playerKey */}
<Route path="/ganaste/:roomId" element={<Ganaste />} />
<Route path="/perdiste/:roomId" element={<Perdiste />} />
<Route path="/empataste/:roomId" element={<Empataste />} />
</Routes>

    </Router>   
  );
};



export default App;
