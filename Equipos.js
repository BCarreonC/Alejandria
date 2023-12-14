import React, { useState } from 'react';
import './App.css';

// Estados para los nombres de los invocadores, datos de los invocadores, y errores
function App() {
  const [summoner1, setSummoner1] = useState('');
  const [summoner2, setSummoner2] = useState('');
  const [summonerData1, setSummonerData1] = useState(null);
  const [summonerData2, setSummonerData2] = useState(null);
  const [error, setError] = useState(null);

  // Función asincrónica para obtener datos del invocador desde la API
  const fetchData = async (summonerName, setSummonerData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/summoner_info?summoner_name=${summonerName}`);
      const data = await response.json();

      if (response.ok) {
        setSummonerData(data);
      } else {
        setError(data.error || 'Error en la solicitud');
      }
    } catch (error) {
      setError('Error de red');
    }
  };
  // Manejar el clic en el botón para obtener información del invocador
  const handleButtonClick = () => {
    if (summoner1) {
      fetchData(summoner1, setSummonerData1);
    }
    if (summoner2) {
      fetchData(summoner2, setSummonerData2);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  // Función para renderizar las estadísticas por campeón
  const renderChampionStats = (championStats) => {
    // Extraer nombres de campeones y estadísticas
    const champions = Object.keys(championStats);
    const stats = Object.values(championStats);

    // Encontrar el índice del campeón más jugado y menos jugado
    const mostPlayedIndex = stats.findIndex((stat) => stat.played === Math.max(...stats.map((s) => s.played)));
    const leastPlayedIndex = stats.findIndex((stat) => stat.played === Math.min(...stats.map((s) => s.played)));

    return (
      <div>
        <h3>Estadísticas por campeón:</h3>
        {champions.map((champion, index) => (
          <div className='champion-stats' key={champion}>
            <p>Campeón: {champion}</p>
            <p>Veces jugado: {stats[index].played}</p>
            <p>Veces ganado: {stats[index].won}</p>
            <p>KDA promedio: {stats[index].avg_kda.toFixed(2)}</p>
            <p>Creep Score promedio: {stats[index].avg_creep_score.toFixed(2)}</p>
            <hr />
          </div>
        ))}

        {/* Mostrar el campeón más jugado y menos jugado */}
        <p>El campeón más jugado es: {champions[mostPlayedIndex]}</p>
        <p>El campeón menos jugado es: {champions[leastPlayedIndex]}</p>
      </div>
    );
  };
   // Renderizar la interfaz de usuario
  return (
    <div>
      <h1>Información del Invocador</h1>

      <div>
        <label>Invocador 1: </label>
        <input type="text" value={summoner1} onChange={(e) => setSummoner1(e.target.value)} />
      </div>

      {summonerData1 && (
        <div>
          <p>ID de Summoner: {summonerData1.id}</p>
          <p>Account ID: {summonerData1.accountId}</p>
          <p>PUUID: {summonerData1.puuid}</p>
          <p>Nombre de Summoner: {summonerData1.name}</p>
          {renderChampionStats(summonerData1.champion_stats)}
        </div>
      )}

      <div>
        <label>Invocador 2: </label>
        <input type="text" value={summoner2} onChange={(e) => setSummoner2(e.target.value)} />
      </div>

      {summonerData2 && (
        <div>
          <p>ID de Summoner: {summonerData2.id}</p>
          <p>Account ID: {summonerData2.accountId}</p>
          <p>PUUID: {summonerData2.puuid}</p>
          <p>Nombre de Summoner: {summonerData2.name}</p>
          {renderChampionStats(summonerData2.champion_stats)}
        </div>
      )}
      {/* Botón para obtener información */}
      <button onClick={handleButtonClick}>Obtener Información</button>
    </div>
  );
}

export default App;
