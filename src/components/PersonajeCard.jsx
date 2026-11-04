// Ficha de un personaje. No maneja estado propio: recibe los datos, si
// está marcado como favorito y la función que alterna esa marca.

const CLASES_POR_ESTADO = Object.freeze({
  alive: 'estado-alive',
  dead: 'estado-dead',
  unknown: 'estado-unknown',
})

const claseEstado = (estado) => {
  const clave = typeof estado === 'string' ? estado.toLowerCase() : ''

  return CLASES_POR_ESTADO[clave] ?? CLASES_POR_ESTADO.unknown
}

const PersonajeCard = ({ personaje, esFavorito, onToggleFavorito }) => {
  const { image, name, status, species } = personaje
  const claseTarjeta = esFavorito ? 'card fav' : 'card'

  return (
    <article className={claseTarjeta}>
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <p className={`estado ${claseEstado(status)}`}>
        {status} - {species}
      </p>
      <button type="button" onClick={() => onToggleFavorito(personaje)}>
        {esFavorito ? '★ Quitar de favoritos' : '☆ Agregar a favoritos'}
      </button>
    </article>
  )
}

export default PersonajeCard
