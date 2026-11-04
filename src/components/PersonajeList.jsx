// Listado de personajes. Decide qué aviso mostrar mientras el catálogo
// no está disponible y, cuando lo está, dibuja cada ficha.

import { useMemo } from 'react'
import PersonajeCard from './PersonajeCard.jsx'

const avisoDeEstado = (cargando, error) => {
  if (cargando) return <p className="mensaje">Cargando...</p>
  if (error) return <p className="mensaje error">{error}</p>

  return null
}

const PersonajeList = ({
  personajes,
  favoritos,
  onToggleFavorito,
  cargando = false,
  error = null,
}) => {
  const idsFavoritos = useMemo(
    () => new Set(favoritos.map((item) => item.id)),
    [favoritos],
  )

  const aviso = avisoDeEstado(cargando, error)

  if (aviso) return aviso

  return (
    <div className="grid">
      {personajes.map((personaje) => (
        <PersonajeCard
          key={personaje.id}
          personaje={personaje}
          esFavorito={idsFavoritos.has(personaje.id)}
          onToggleFavorito={onToggleFavorito}
        />
      ))}
    </div>
  )
}

export default PersonajeList
