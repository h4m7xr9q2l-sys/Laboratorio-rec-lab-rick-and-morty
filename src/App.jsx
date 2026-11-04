import { useState, useEffect } from 'react';

export function App() {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((res) => res.json())
      .then((data) => setCharacters(data.results || []))
      .catch((err) => console.error(err));
  }, []);

  const toggleFavorite = (char) => {
    if (favorites.some((fav) => fav.id === char.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== char.id));
    } else {
      setFavorites([...favorites, char]);
    }
  };

  return (
    <div style={{ padding: '25px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <header style={{ marginBottom: '25px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <h1 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>Rick and Morty - Laboratorio Recuperatorio</h1>
        <p style={{ color: '#555', margin: 0 }}>Total de favoritos seleccionados: <strong>{favorites.length}</strong></p>
      </header>

      {/* Sección de Favoritos */}
      <section style={{ marginBottom: '35px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#16a085', fontSize: '20px', marginTop: 0 }}>⭐ Mis Favoritos</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {favorites.length === 0 && <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Aún no hay personajes en favoritos. ¡Agrega algunos de la lista de abajo!</p>}
          {favorites.map((char) => (
            <div key={char.id} style={{ border: '2px solid #2ecc71', padding: '10px', borderRadius: '8px', width: '140px', backgroundColor: '#e8f8f5', textAlign: 'center' }}>
              <img src={char.image} alt={char.name} style={{ width: '100%', borderRadius: '6px' }} />
              <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '8px 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{char.name}</p>
              <button onClick={() => toggleFavorite(char)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>
                Quitar ❌
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Lista General de Personajes */}
      <section>
        <h2 style={{ color: '#2980b9', fontSize: '20px' }}>📋 Lista de Personajes</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {characters.map((char) => {
            const isFav = favorites.some((fav) => fav.id === char.id);
            return (
              <div key={char.id} style={{ border: '1px solid #dcdde1', padding: '12px', borderRadius: '8px', width: '160px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <img src={char.image} alt={char.name} style={{ width: '100%', borderRadius: '6px' }} />
                <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '8px 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{char.name}</p>
                <p style={{ fontSize: '11px', color: '#7f8c8d', margin: '0 0 10px 0' }}>{char.species} - {char.status}</p>
                <button 
                  onClick={() => toggleFavorite(char)} 
                  style={{ backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}
                >
                  {isFav ? 'Quitar de Favoritos' : '⭐ Agregar'}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default App;
