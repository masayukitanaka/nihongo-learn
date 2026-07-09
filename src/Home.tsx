import { useState } from 'react'
import './Home.css'
import { countKanaChars, HIRAGANA_ROWS, KATAKANA_ROWS } from './kana-data'
import {
  DEFAULT_KANA_FONT_ID,
  getKanaFont,
  KANA_FONTS,
  type KanaFontId,
} from './kana-fonts'

type Accent = 'coral' | 'teal'

type KanaSectionProps = {
  title: string
  path: '/hiragana' | '/katakana'
  maxChars: number
  glyph: string
  accent: Accent
  fontId: KanaFontId
}

function KanaSection({
  title,
  path,
  maxChars,
  glyph,
  accent,
  fontId,
}: KanaSectionProps) {
  const [number, setNumber] = useState('')
  const [text, setText] = useState('')

  const goRandom = () => {
    const params = new URLSearchParams({ font: fontId })
    const parsed = Number(number)
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= maxChars) {
      params.set('target', 'random')
      params.set('number', String(parsed))
    }
    window.location.href = `${path}?${params.toString()}`
  }

  const goCustom = () => {
    const params = new URLSearchParams({ font: fontId })
    const trimmed = text.trim()
    if (trimmed) {
      params.set('target', trimmed)
    }
    window.location.href = `${path}?${params.toString()}`
  }

  return (
    <section className={`home-card home-card--${accent}`}>
      <div className="home-card-head">
        <div className="home-card-icon">{glyph}</div>
        <div>
          <div className="home-card-title">{title}</div>
          <div className="home-card-subtitle">{maxChars} basic characters</div>
        </div>
      </div>

      <label className="home-label" htmlFor={`${path}-number`}>
        Random range
      </label>
      <div className="home-option-row">
        <input
          id={`${path}-number`}
          type="number"
          min={1}
          max={maxChars}
          placeholder={`1 – ${maxChars}`}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button type="button" className="home-btn-primary" onClick={goRandom}>
          Start
        </button>
      </div>

      <label className="home-label" htmlFor={`${path}-text`}>
        Specific characters
      </label>
      <div className="home-option-row">
        <textarea
          id={`${path}-text`}
          rows={1}
          placeholder={path === '/katakana' ? 'e.g. アイウエオ' : 'e.g. あいうえお'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="button" className="home-btn-secondary" onClick={goCustom}>
          Start
        </button>
      </div>
    </section>
  )
}

function Home() {
  const [fontId, setFontId] = useState<KanaFontId>(DEFAULT_KANA_FONT_ID)
  const selectedFont = getKanaFont(fontId)

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-mascot" aria-hidden="true">
          <span className="home-mascot-eye home-mascot-eye--left" />
          <span className="home-mascot-eye home-mascot-eye--right" />
          <span className="home-mascot-cheek home-mascot-cheek--left" />
          <span className="home-mascot-cheek home-mascot-cheek--right" />
        </div>
        <div>
          <h1>Japanese Practice</h1>
          <p className="home-subtitle">
            Master hiragana &amp; katakana, one character at a time
          </p>
        </div>
      </div>

      <div className="home-font-picker">
        <label className="home-label" htmlFor="kana-font-select">
          Kana font in practice
        </label>
        <div className="home-font-picker-row">
          <select
            id="kana-font-select"
            value={fontId}
            onChange={(e) => setFontId(e.target.value as KanaFontId)}
          >
            {KANA_FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
          <div
            className="home-font-preview"
            style={{ fontFamily: selectedFont.fontFamily }}
          >
            あいうえお / アイウエオ
          </div>
        </div>
      </div>

      <div className="home-sections">
        <KanaSection
          title="Hiragana"
          path="/hiragana"
          maxChars={countKanaChars(HIRAGANA_ROWS)}
          glyph="あ"
          accent="coral"
          fontId={fontId}
        />
        <KanaSection
          title="Katakana"
          path="/katakana"
          maxChars={countKanaChars(KATAKANA_ROWS)}
          glyph="ア"
          accent="teal"
          fontId={fontId}
        />
      </div>
    </div>
  )
}

export default Home
