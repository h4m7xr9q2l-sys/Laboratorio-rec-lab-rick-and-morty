// Panel lateral de favoritos. La fila se extrae a un componente pequeño
// para que el panel solo decida entre la lista y el mensaje vacío.

const FavoritoItem = ({ personaje, onQuitar }) => (
  <li>
    <img src={personaje.image} alt={personaje.name} />
    <span>{personaje.name}</span>
    <button type="button" onClick={() => onQuitar(personaje)}>
      Quitar
    </button>
  </li>
)

const FavoritesPanel = ({ favoritos, onQuitar }) => {
  const hayFavoritos = favoritos.length > 0

  return (
    <aside className="favoritos">
      <h3>Favoritos ({favoritos.length})</h3>

      {hayFavoritos ? (
        <ul>
          {favoritos.map((personaje) => (
            <FavoritoItem key={personaje.id} personaje={personaje} onQuitar={onQuitar} />
          ))}
        </ul>
      ) : (
        <p>Aún no has marcado favoritos</p>
      )}
    </aside>
  )
}

export default FavoritesPanel
