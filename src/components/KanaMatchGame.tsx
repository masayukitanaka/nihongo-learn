import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import type { KanaRow } from '../kana-data'
import './KanaMatchGame.css'

type KanaMatchGameProps = {
  vowels: string[]
  rows: KanaRow[]
  clearTitle?: string
  clearMessage?: string
}

type CardState = {
  id: number
  char: string
  x: number
  y: number
  rotation: number
  zIndex: number
  hue: number
  placed: boolean
  preplaced: boolean
}

const CARD_SIZE = 64
const SNAP_THRESHOLD = CARD_SIZE * 0.6

function pickPileChars(chars: string[]): Set<string> {
  const params = new URLSearchParams(window.location.search)
  const target = params.get('target')

  if (target === 'random') {
    const number = Number(params.get('number'))
    if (!Number.isInteger(number) || number < 1 || number > chars.length) {
      return new Set(chars)
    }
    const shuffled = [...chars].sort(() => Math.random() - 0.5)
    return new Set(shuffled.slice(0, number))
  }

  if (target) {
    const chosen = [...target].filter((c) => chars.includes(c))
    if (chosen.length > 0) {
      return new Set(chosen)
    }
  }

  return new Set(chars)
}

function createInitialCards(chars: string[]): Omit<CardState, 'x' | 'y'>[] {
  const pileChars = pickPileChars(chars)
  return chars.map((char, index) => ({
    id: index,
    char,
    rotation: Math.random() * 40 - 20,
    zIndex: index,
    hue: Math.random() * 360,
    placed: !pileChars.has(char),
    preplaced: !pileChars.has(char),
  }))
}

type Confetti = {
  id: number
  left: number
  delay: number
  duration: number
  hue: number
  drift: number
}

function createConfetti(): Confetti[] {
  return Array.from({ length: 120 }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.6,
    hue: Math.random() * 360,
    drift: Math.random() * 120 - 60,
  }))
}

function KanaMatchGame({
  vowels,
  rows,
  clearTitle = 'Clear!',
  clearMessage = 'You placed all the kana correctly.',
}: KanaMatchGameProps) {
  const chars = rows.flatMap((row) => row.chars).filter(
    (c): c is string => c !== null,
  )

  const [cards, setCards] = useState<CardState[] | null>(null)
  const [shakingId, setShakingId] = useState<number | null>(null)
  const [cleared, setCleared] = useState(false)
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [runId, setRunId] = useState(0)
  const topZRef = useRef(chars.length)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const pileRef = useRef<HTMLDivElement | null>(null)
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const draggingRef = useRef<{
    id: number
    offsetX: number
    offsetY: number
    homeX: number
    homeY: number
    homeRotation: number
  } | null>(null)

  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const pile = pileRef.current
    if (!overlay || !pile) return
    const overlayRect = overlay.getBoundingClientRect()
    const pileRect = pile.getBoundingClientRect()
    const originX = pileRect.left - overlayRect.left
    const originY = pileRect.top - overlayRect.top
    const width = pileRect.width - CARD_SIZE
    const height = pileRect.height - CARD_SIZE
    setCleared(false)
    setConfetti([])
    setCards(
      createInitialCards(chars).map((card) => {
        if (card.preplaced) {
          const cell = cellRefs.current.get(card.char)
          if (cell) {
            const cellRect = cell.getBoundingClientRect()
            return {
              ...card,
              x: cellRect.left - overlayRect.left + cellRect.width / 2 - CARD_SIZE / 2,
              y: cellRect.top - overlayRect.top + cellRect.height / 2 - CARD_SIZE / 2,
              rotation: 0,
            }
          }
        }
        return {
          ...card,
          x: originX + Math.random() * Math.max(width, 0),
          y: originY + Math.random() * Math.max(height, 0),
        }
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId])

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    card: CardState,
  ) => {
    if (card.preplaced) return
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    const rect = target.getBoundingClientRect()
    draggingRef.current = {
      id: card.id,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      homeX: card.x,
      homeY: card.y,
      homeRotation: card.rotation,
    }
    topZRef.current += 1
    const newZ = topZRef.current
    setCards((prev) =>
      prev
        ? prev.map((c) =>
            c.id === card.id ? { ...c, zIndex: newZ, placed: false } : c,
          )
        : prev,
    )
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragging = draggingRef.current
    if (!dragging) return
    const overlay = overlayRef.current
    if (!overlay) return
    const overlayRect = overlay.getBoundingClientRect()
    const x = event.clientX - overlayRect.left - dragging.offsetX
    const y = event.clientY - overlayRect.top - dragging.offsetY
    setCards((prev) =>
      prev
        ? prev.map((c) => (c.id === dragging.id ? { ...c, x, y } : c))
        : prev,
    )
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragging = draggingRef.current
    if (!dragging) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    draggingRef.current = null

    const overlay = overlayRef.current
    const card = cards?.find((c) => c.id === dragging.id)
    if (!overlay || !card) return
    const overlayRect = overlay.getBoundingClientRect()
    const cardCenterX = card.x + CARD_SIZE / 2
    const cardCenterY = card.y + CARD_SIZE / 2

    const targetCell = cellRefs.current.get(card.char)
    let snapped = false
    if (targetCell) {
      const cellRect = targetCell.getBoundingClientRect()
      const cellCenterX = cellRect.left - overlayRect.left + cellRect.width / 2
      const cellCenterY = cellRect.top - overlayRect.top + cellRect.height / 2
      const distance = Math.hypot(
        cardCenterX - cellCenterX,
        cardCenterY - cellCenterY,
      )
      if (distance < SNAP_THRESHOLD) {
        snapped = true
        setCards((prev) => {
          if (!prev) return prev
          const next = prev.map((c) =>
            c.id === card.id
              ? {
                  ...c,
                  x: cellCenterX - CARD_SIZE / 2,
                  y: cellCenterY - CARD_SIZE / 2,
                  rotation: 0,
                  placed: true,
                }
              : c,
          )
          if (next.every((c) => c.placed)) {
            setConfetti(createConfetti())
            setCleared(true)
          }
          return next
        })
      }
    }

    if (!snapped) {
      setShakingId(card.id)
      setTimeout(() => {
        setCards((prev) =>
          prev
            ? prev.map((c) =>
                c.id === card.id
                  ? {
                      ...c,
                      x: dragging.homeX,
                      y: dragging.homeY,
                      rotation: dragging.homeRotation,
                    }
                  : c,
              )
            : prev,
        )
        setShakingId(null)
      }, 300)
    }
  }

  const handlePlayAgain = () => {
    setRunId((id) => id + 1)
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="kana-page">
      <a href="/" className="kana-top-link">
        Top
      </a>
      <div className="kana-split" ref={overlayRef}>
        <div className="kana-left">
          <div
            className="kana-target"
            style={{
              gridTemplateColumns: `32px repeat(${vowels.length}, 64px) 64px`,
              gridTemplateRows: `24px repeat(${rows.length}, 64px)`,
            }}
          >
            <div className="kana-target-corner" />
            {vowels.map((vowel) => (
              <div className="kana-target-header" key={vowel}>
                {vowel}
              </div>
            ))}
            <div className="kana-target-corner" />
            {rows.map((row, rowIndex) => (
              <Fragment key={`row-${rowIndex}`}>
                <div className="kana-target-header">{row.consonant}</div>
                {row.chars.slice(0, vowels.length).map((char, colIndex) =>
                  char ? (
                    <div
                      className="kana-target-cell"
                      key={`${rowIndex}-${colIndex}`}
                      ref={(el) => {
                        if (el) cellRefs.current.set(char, el)
                        else cellRefs.current.delete(char)
                      }}
                    />
                  ) : (
                    <div
                      className="kana-target-cell kana-target-cell--empty"
                      key={`${rowIndex}-${colIndex}`}
                      aria-hidden="true"
                    />
                  ),
                )}
                {row.chars[vowels.length] ? (
                  <div
                    className="kana-target-cell kana-target-cell--n"
                    ref={(el) => {
                      const char = row.chars[vowels.length]
                      if (!char) return
                      if (el) cellRefs.current.set(char, el)
                      else cellRefs.current.delete(char)
                    }}
                  />
                ) : (
                  <div
                    className="kana-target-cell kana-target-cell--empty"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
        <div className="kana-right">
          <div className="kana-pile" ref={pileRef} />
        </div>
        {cards?.map((card) => (
          <div
            key={card.id}
            className={`kana-card kana-card--pile${
              card.placed ? ' kana-card--placed' : ''
            }${card.preplaced ? ' kana-card--preplaced' : ''}${
              shakingId === card.id ? ' kana-card--shake' : ''
            }`}
            style={{
              left: card.x,
              top: card.y,
              transform: `rotate(${card.rotation}deg)`,
              zIndex: card.zIndex,
              background: card.preplaced
                ? undefined
                : `hsl(${card.hue} 55% 88%)`,
            }}
            onPointerDown={(e) => handlePointerDown(e, card)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {card.char}
          </div>
        ))}
        {cleared && (
          <div className="kana-confetti" aria-hidden="true">
            {confetti.map((c) => (
              <span
                key={c.id}
                className="kana-confetti-piece"
                style={{
                  left: `${c.left}%`,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`,
                  background: `hsl(${c.hue} 80% 65%)`,
                  ['--drift' as string]: `${c.drift}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      {cleared && (
        <div className="kana-dialog-backdrop">
          <div
            className="kana-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kana-dialog-title"
          >
            <h2 id="kana-dialog-title">{clearTitle}</h2>
            <p>{clearMessage}</p>
            <div className="kana-dialog-actions">
              <button type="button" onClick={handlePlayAgain}>
                Play Again
              </button>
              <button
                type="button"
                className="kana-dialog-secondary"
                onClick={handleGoHome}
              >
                Top page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KanaMatchGame
