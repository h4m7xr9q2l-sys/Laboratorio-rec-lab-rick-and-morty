// Raíz de la aplicación. Concentra el estado de favoritos y distribuye
// los datos del catálogo entre el listado y el panel lateral.

import { useCallback, useReducer } from 'react'
import PersonajeList from './components/PersonajeList.jsx'
import FavoritesPanel from './components/FavoritesPanel.jsx'
import { usePersonajes } from './hooks/usePersonajes.js'

const ACCIONES_FAVORITOS = Object.freeze({
  ALTERNAR: 'favoritos/alternar',
  QUITAR: 'favoritos/quitar',
})

const quitarPorId = (favoritos, id) => favoritos.filter((item) => item.id !== id)

const favoritosReducer = (estado, accion) => {
  switch (accion.type) {
    case ACCIONES_FAVORITOS.ALTERNAR: {
      const personaje = accion.payload
      const yaGuardado = estado.some((item) => item.id === personaje.id)

      return yaGuardado ? quitarPorId(estado, personaje.id) : [...estado, personaje]
    }

    case ACCIONES_FAVORITOS.QUITAR:
      return quitarPorId(estado, accion.payload.id)

    default:
      return estado
  }
}

const MultiversoApp = () => {
  const { personajes, cargando, error } = usePersonajes()
  const [favoritos, despacharFavoritos] = useReducer(favoritosReducer, [])

  const toggleFavorito = useCallback((personaje) => {
    despacharFavoritos({ type: ACCIONES_FAVORITOS.ALTERNAR, payload: personaje })
  }, [])

  const quitarFavorito = useCallback((personaje) => {
    despacharFavoritos({ type: ACCIONES_FAVORITOS.QUITAR, payload: personaje })
  }, [])

  return (
    <>
      <h1>Rick and Morty Universo</h1>

      <main className="layout">
        <PersonajeList
          personajes={personajes}
          favoritos={favoritos}
          onToggleFavorito={toggleFavorito}
          cargando={cargando}
          error={error}
        />
        <FavoritesPanel favoritos={favoritos} onQuitar={quitarFavorito} />
      </main>
    </>
  )
}

export default MultiversoApp
