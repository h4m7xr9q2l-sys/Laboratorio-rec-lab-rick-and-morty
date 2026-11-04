import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MultiversoApp from './MultiversoApp.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MultiversoApp />
  </StrictMode>,
)
