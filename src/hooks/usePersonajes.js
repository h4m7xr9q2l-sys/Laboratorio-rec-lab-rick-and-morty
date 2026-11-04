import { useEffect, useReducer } from 'react'
import { fetchPersonajes } from '../services/fetchPersonajes.js'

// El catálogo se modela con un único estado de situación en lugar de
// varias banderas sueltas; la vista recibe siempre los mismos campos.

const ESTADOS_CATALOGO = Object.freeze({
  CARGANDO: 'cargando',
  LISTO: 'listo',
  FALLIDO: 'fallido',
})

const estadoInicial = {
  lista: [],
  situacion: ESTADOS_CATALOGO.CARGANDO,
  detalle: null,
}

const catalogoReducer = (estado, accion) => {
  switch (accion.type) {
    case 'carga:inicio':
      return { ...estadoInicial, situacion: ESTADOS_CATALOGO.CARGANDO }

    case 'carga:exito':
      return { lista: accion.payload, situacion: ESTADOS_CATALOGO.LISTO, detalle: null }

    case 'carga:fallo':
      return { lista: [], situacion: ESTADOS_CATALOGO.FALLIDO, detalle: accion.payload }

    default:
      return estado
  }
}

export const usePersonajes = () => {
  const [estado, despachar] = useReducer(catalogoReducer, estadoInicial)

  useEffect(() => {
    const controlador = new AbortController()

    despachar({ type: 'carga:inicio' })

    fetchPersonajes({ signal: controlador.signal })
      .then((lista) => {
        if (!controlador.signal.aborted) {
          despachar({ type: 'carga:exito', payload: lista })
        }
      })
      .catch((error) => {
        if (!controlador.signal.aborted) {
          despachar({ type: 'carga:fallo', payload: error.message })
        }
      })

    // Al desmontar se cancela la petición para no actualizar estado inútil.
    return () => controlador.abort()
  }, [])

  return {
    personajes: estado.lista,
    cargando: estado.situacion === ESTADOS_CATALOGO.CARGANDO,
    error: estado.detalle,
  }
}
