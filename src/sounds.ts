// Web Audio API sound effects — no mp3 files, synthesized on the fly.

let audioCtx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return null
  if (!audioCtx) audioCtx = new Ctor()
  // Browsers start the context suspended until a user gesture; resume it.
  if (audioCtx.state === 'suspended') void audioCtx.resume()
  return audioCtx
}

type Note = {
  freq: number
  start: number // seconds from now
  duration: number
  type?: OscillatorType
  gain?: number
}

function playNotes(notes: Note[]) {
  const ctx = getContext()
  if (!ctx) return
  const now = ctx.currentTime
  for (const note of notes) {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.type = note.type ?? 'sine'
    osc.frequency.value = note.freq

    const startTime = now + note.start
    const endTime = startTime + note.duration
    const peak = note.gain ?? 0.18

    // Quick attack, smooth exponential release for a soft, pleasant tone.
    gainNode.gain.setValueAtTime(0.0001, startTime)
    gainNode.gain.exponentialRampToValueAtTime(peak, startTime + 0.012)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(endTime + 0.02)
  }
}

// Bright, rising major arpeggio — a satisfying "correct!" chime.
export function playCorrect() {
  playNotes([
    { freq: 523.25, start: 0, duration: 0.12, type: 'triangle' }, // C5
    { freq: 659.25, start: 0.09, duration: 0.12, type: 'triangle' }, // E5
    { freq: 783.99, start: 0.18, duration: 0.14, type: 'triangle' }, // G5
    { freq: 1046.5, start: 0.27, duration: 0.22, type: 'triangle', gain: 0.14 }, // C6
  ])
}

// Gentle, brief falling minor second — a soft "not quite" without being harsh.
export function playWrong() {
  playNotes([
    { freq: 311.13, start: 0, duration: 0.16, type: 'sine', gain: 0.12 }, // Eb4
    { freq: 277.18, start: 0.12, duration: 0.22, type: 'sine', gain: 0.1 }, // C#4
  ])
}
