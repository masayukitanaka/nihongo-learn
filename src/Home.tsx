import { useState } from 'react'
import './Home.css'
import { countKanaChars, HIRAGANA_ROWS, KATAKANA_ROWS } from './kana-data'

type KanaSectionProps = {
  title: string
  path: '/hiragana' | '/katakana'
  maxChars: number
}

function KanaSection({ title, path, maxChars }: KanaSectionProps) {
  const [number, setNumber] = useState('')
  const [text, setText] = useState('')

  const goRandom = () => {
    const parsed = Number(number)
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= maxChars) {
      window.location.href = `${path}?target=random&number=${parsed}`
    } else {
      window.location.href = path
    }
  }

  const goCustom = () => {
    const trimmed = text.trim()
    if (trimmed) {
      window.location.href = `${path}?target=${encodeURIComponent(trimmed)}`
    } else {
      window.location.href = path
    }
  }

  return (
    <section className="home-section">
      <h2>{title}</h2>
      <div className="home-option">
        <label htmlFor={`${path}-number`}>Random characters</label>
        <div className="home-option-row">
          <input
            id={`${path}-number`}
            type="number"
            min={1}
            max={maxChars}
            placeholder={`1-${maxChars}`}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <button type="button" onClick={goRandom}>
            Start
          </button>
        </div>
      </div>
      <div className="home-option">
        <label htmlFor={`${path}-text`}>Specific characters</label>
        <div className="home-option-row">
          <textarea
            id={`${path}-text`}
            rows={2}
            placeholder="e.g. あいうえお"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="button" onClick={goCustom}>
            Start
          </button>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <div className="home-page">
      <h1>Japanese Practice</h1>
      <div className="home-sections">
        <KanaSection
          title="Practice Hiragana"
          path="/hiragana"
          maxChars={countKanaChars(HIRAGANA_ROWS)}
        />
        <KanaSection
          title="Practice Katakana"
          path="/katakana"
          maxChars={countKanaChars(KATAKANA_ROWS)}
        />
      </div>
    </div>
  )
}

export default Home
