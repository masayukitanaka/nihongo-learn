import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import Hiragana from './Hiragana.tsx'
import Katakana from './Katakana.tsx'

function getPage() {
  switch (window.location.pathname) {
    case '/hiragana':
      return <Hiragana />
    case '/katakana':
      return <Katakana />
    default:
      return <Home />
  }
}

const page = getPage()

createRoot(document.getElementById('root')!).render(
  <StrictMode>{page}</StrictMode>,
)
