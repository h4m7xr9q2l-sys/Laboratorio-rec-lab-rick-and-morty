// Cliente de la API de personajes. Además de leer la respuesta, absorbe
// fallos pasajeros con un tiempo límite y reintentos automáticos.

const URL_PERSONAJES = 'https://rickandmortyapi.com/api/character'

const MAX_INTENTOS = 3
const TIEMPO_LIMITE_MS = 6000
const ESPERA_BASE_MS = 400

class ErrorDeApi extends Error {
  constructor(mensaje, { estadoHttp = null, reintentable = false } = {}) {
    super(mensaje)
    this.name = 'ErrorDeApi'
    this.estadoHttp = estadoHttp
    this.reintentable = reintentable
  }
}

const peticionCancelada = (signal) =>
  signal?.reason ?? new DOMException('Petición cancelada.', 'AbortError')

const esperar = (milisegundos) =>
  new Promise((resolver) => {
    setTimeout(resolver, milisegundos)
  })

const leerCuerpo = async (respuesta) => {
  try {
    return await respuesta.json()
  } catch {
    throw new ErrorDeApi('La API devolvió datos que no se pueden interpretar.')
  }
}

const errorPorEstado = (estadoHttp) => {
  if (estadoHttp === 429) {
    return new ErrorDeApi(
      'La API recibió demasiadas solicitudes. Esperá unos segundos y reintentá.',
      { estadoHttp, reintentable: true },
    )
  }

  if (estadoHttp >= 500) {
    return new ErrorDeApi(
      `El servidor de personajes no está disponible en este momento (HTTP ${estadoHttp}).`,
      { estadoHttp, reintentable: true },
    )
  }

  return new ErrorDeApi(`Error al cargar los personajes (HTTP ${estadoHttp}).`, {
    estadoHttp,
  })
}

const solicitarUnaVez = async (signalExterno) => {
  if (signalExterno?.aborted) throw peticionCancelada(signalExterno)

  const controlador = new AbortController()
  let seAgotoElTiempo = false

  const abortarPorCancelacion = () => controlador.abort()
  signalExterno?.addEventListener('abort', abortarPorCancelacion, { once: true })

  const temporizador = setTimeout(() => {
    seAgotoElTiempo = true
    controlador.abort()
  }, TIEMPO_LIMITE_MS)

  try {
    const respuesta = await fetch(URL_PERSONAJES, { signal: controlador.signal })

    if (!respuesta.ok) {
      throw errorPorEstado(respuesta.status)
    }

    const datos = await leerCuerpo(respuesta)

    return Array.isArray(datos?.results) ? datos.results : []
  } catch (causa) {
    if (signalExterno?.aborted) throw peticionCancelada(signalExterno)

    if (seAgotoElTiempo) {
      throw new ErrorDeApi('La API tardó demasiado en responder.', { reintentable: true })
    }

    if (causa instanceof ErrorDeApi) throw causa

    if (causa?.name === 'AbortError') throw peticionCancelada(signalExterno)

    // Un TypeError de fetch suele indicar un corte de red, DNS o TLS.
    throw new ErrorDeApi(
      'No se pudo contactar con el servidor de personajes. ' +
        'Puede ser un problema temporal; reintentá en unos segundos.',
      { reintentable: true },
    )
  } finally {
    clearTimeout(temporizador)
    signalExterno?.removeEventListener('abort', abortarPorCancelacion)
  }
}

export const fetchPersonajes = async ({ signal } = {}) => {
  let ultimoError = null

  for (let intento = 1; intento <= MAX_INTENTOS; intento += 1) {
    if (signal?.aborted) throw peticionCancelada(signal)

    try {
      return await solicitarUnaVez(signal)
    } catch (causa) {
      if (signal?.aborted) throw peticionCancelada(signal)

      ultimoError = causa

      const sinIntentos = intento === MAX_INTENTOS
      const noReintentable = !(causa instanceof ErrorDeApi) || !causa.reintentable

      if (sinIntentos || noReintentable) break

      await esperar(ESPERA_BASE_MS * intento)
    }
  }

  throw ultimoError
}
