import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ToasterProvider } from './components/Toaster/Toaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToasterProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToasterProvider>
  </StrictMode>,
)
