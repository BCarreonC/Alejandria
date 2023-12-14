import React, { useState, useEffect } from 'react';
import './Simulador.css';

function Simulador() {
  // Estados para almacenar la lista de campeones, la lista filtrada, la cadena de búsqueda y las imágenes de arrastre
  const [champions, setChampions] = useState([]);
  const [filteredChampions, setFilteredChampions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedImage, setDraggedImage] = useState(null);

  // Estados para las imágenes de campeones seleccionados y baneados
  const [droppedImages, setDroppedImages] = useState(Array(10).fill(null));
  const [bannedImages, setBannedImages] = useState(Array(10).fill(null));

  // Efecto para cargar la lista de campeones al montar el componente
  useEffect(() => {
    fetchChampions();
  }, []);

  // Función para obtener la lista de campeones desde la API de League of Legends
  const fetchChampions = async () => {
    try {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json');
      const data = await response.json();
      const championsData = Object.values(data.data);
      setChampions(championsData);
      setFilteredChampions(championsData);
    } catch (error) {
      console.error('Error fetching champions:', error);
    }
  };

  // Función para manejar la búsqueda de campeones
  const handleSearch = (event) => {
    const searchTermLower = event.target.value.toLowerCase();
    setSearchTerm(searchTermLower);

    const filtered = champions.filter(champion => champion.name.toLowerCase().includes(searchTermLower));
    setFilteredChampions(filtered);
  };

  // Funciones para el manejo del arrastre y soltar de imágenes
  const handleDragStart = (event, championId) => {
    event.dataTransfer.setData('championId', championId);
    setDraggedImage(championId);
  };

  const handleDragEnd = () => {
    setDraggedImage(null);
  };

  // Funciones para manejar el soltar de imágenes en las áreas de selección y ban
  const handleDrop = (event, dropIndex) => {
    event.preventDefault();
    const championId = event.dataTransfer.getData('championId');
    const imageUrl = `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${championId}.png`;

    const newDroppedImages = [...droppedImages];
    newDroppedImages[dropIndex] = imageUrl;

    setDroppedImages(newDroppedImages);
    setDraggedImage(null);
  };

  const handleBan = (event, banIndex) => {
    event.preventDefault();
    const championId = event.dataTransfer.getData('championId');
    const imageUrl = `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${championId}.png`;

    const newBannedImages = [...bannedImages];
    newBannedImages[banIndex] = imageUrl;

    setBannedImages(newBannedImages);
    setDraggedImage(null);
  };

  // Función para permitir el soltar de imágenes
  const allowDrop = (event) => {
    event.preventDefault();
  };

  // Renderización del componente Simulador
  return (
    <div className="App">
      <h1>League of Legends Pick & Ban Champion Tool</h1>

      <div className="drop-ban-areas">
        <p className='blue-team'>Blue Team</p>
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="drop-ban-row">
            <div
              className="drop-area"
              onDrop={(event) => handleDrop(event, index)}
              onDragOver={allowDrop}
            >
              {droppedImages[index] && (
                <img src={droppedImages[index]} alt={`Dropped Champion ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
              )}
              {!droppedImages[index] && <p>Pick #{index + 1}</p>}
            </div>
            <br/>
            <div
              className="ban-area"
              onDrop={(event) => handleBan(event, index)}
              onDragOver={allowDrop}
            >
              {bannedImages[index] && (
                <img src={bannedImages[index]} alt={`Banned Champion ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
              )}
              {!bannedImages[index] && <p>Ban #{index + 1}</p>}
            </div>
          </div>
        ))}
        <p className='red-team'>Red Team</p>
      </div>
      
      <br/>
      <hr></hr>
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="champion-list">
        {filteredChampions.map(champion => (
          <div
            key={champion.id}
            className={`champion ${draggedImage === champion.id ? 'dragging' : ''}`}
            draggable={true}
            onDragStart={(event) => handleDragStart(event, champion.id)}
            onDragEnd={handleDragEnd}
          >
            <img src={`https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${champion.id}.png`} alt={champion.name} />
            <p>{champion.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Simulador;
