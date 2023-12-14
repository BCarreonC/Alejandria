// En tu componente principal (por ejemplo, App.js)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Equipos from './Equipos';
import Simulador from './Simulador';
import Registro from './Registro';
import Tierlist from './Tierlist';



function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/equipos" element={<Equipos/>} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/tierlist" element={<Tierlist />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

