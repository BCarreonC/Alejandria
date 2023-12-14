import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  // Crear una referencia para el elemento nav
  const navRef = useRef();

  // Renderizar el componente Navbar
  return (
    <header>
      {/* Barra de navegación */}
      <nav ref={navRef}>
        {/* Logo */}
        <h3>Logo</h3>

        {/* Título de la aplicación */}
        <h3 className='title'>Alejandría</h3>

        {/* Enlaces de navegación */}
        <Link className='nav-link' to="/equipos">Equipos / Jugadores</Link>
        <hr className='nav-hr'></hr>
        <Link className='nav-link' to="/simulador">Simulador Picks / Bans</Link>
        <hr className='nav-hr'></hr>
        <Link className='nav-link' to="/registro">Registro de Scrims</Link>
        <hr className='nav-hr'></hr>
        <Link className='nav-link' to="/tierlist">Generar Tierlist</Link>
        <hr className='nav-hr'></hr>
      </nav>
    </header>
  );
}

// Exportar el componente Navbar
export default Navbar;
