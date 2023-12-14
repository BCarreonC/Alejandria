import React, { useState, useEffect } from 'react';
import './Tierlist.css';

function Tierlist() {
  // Estados para almacenar la lista de campeones, la lista filtrada, la cadena de búsqueda y las imágenes de arrastre
  const [champions, setChampions] = useState([]);
  const [filteredChampions, setFilteredChampions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedImage, setDraggedImage] = useState(null);

  // Estado para almacenar la lista de campeones y sus respectivos tiers
  const [tierList, setTierList] = useState({});

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

  // Función para manejar el soltar de imágenes en las áreas de selección de tiers
  const handleDrop = (event, tier) => {
    event.preventDefault();
    const championId = event.dataTransfer.getData('championId');

    setTierList(prevTierList => ({
      ...prevTierList,
      [championId]: tier,
    }));

    setDraggedImage(null);
  };

  // Función para permitir el soltar de imágenes
  const allowDrop = (event) => {
    event.preventDefault();
  };

  // Renderización del componente Tierlist
  return (
    <div className="App">
      <h1>League of Legends Tier Maker</h1>

      <div className="tier-list">
        {/* Área de Tier S */}
        <div
          className="tier"
          onDrop={(event) => handleDrop(event, 'S')}
          onDragOver={allowDrop}
        >
          <p className='tier-name'>Tier S</p>
          {/* Mostrar imágenes de campeones en Tier S */}
          {Object.entries(tierList).map(([championId, tier]) => (
            tier === 'S' && (
              <img
                key={championId}
                src={`https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${championId}.png`}
                alt={`Champion ${championId}`}
                className="tier-champion"
              />
            )
          ))}
        </div>
        <br></br>
        {/* Área de Tier A */}
        <div
          className="tier"
          onDrop={(event) => handleDrop(event, 'A')}
          onDragOver={allowDrop}
        >
          <p className='tier-name'>Tier A</p>
          {/* Mostrar imágenes de campeones en Tier A */}
          {Object.entries(tierList).map(([championId, tier]) => (
            tier === 'A' && (
              <img
                key={championId}
                src={`https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${championId}.png`}
                alt={`Champion ${championId}`}
                className="tier-champion"
              />
            )
          ))}
        </div>
        {/* Área de Tier B */}
        <div
          className="tier"
          onDrop={(event) => handleDrop(event, 'B')}
          onDragOver={allowDrop}
        >
          <p className='tier-name'>Tier B</p>
          {/* Mostrar imágenes de campeones en Tier B */}
          {Object.entries(tierList).map(([championId, tier]) => (
            tier === 'B' && (
              <img
                key={championId}
                src={`https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${championId}.png`}
                alt={`Champion ${championId}`}
                className="tier-champion"
              />
            )
          ))}
        </div>
        {/* Área de Tier C */}
        <div
          className="tier"
          onDrop={(event) => handleDrop(event, 'C')}
          onDragOver={allowDrop}
        >
          <p className='tier-name'>Tier C</p>
          {/* Mostrar imágenes de campeones en Tier C */}
          {Object.entries(tierList).map(([championId, tier]) => (
            tier === 'C' && (
              <img
                key={championId}
                src={`https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${championId}.png`}
                alt={`Champion ${championId}`}
                className="tier-champion"
              />
            )
          ))}
        </div>
      </div>
      <br></br>
      {/* Botones de funciones */}
      <div className='functions'>
        <button >Guardar</button>
        <button >Cargar</button>
      </div>

      <hr />

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar..."
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Lista de campeones */}
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

export default Tierlist;
