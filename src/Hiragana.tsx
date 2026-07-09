import KanaMatchGame from './components/KanaMatchGame'
import { HIRAGANA_ROWS, VOWELS } from './kana-data'

function Hiragana() {
  return (
    <KanaMatchGame
      vowels={VOWELS}
      rows={HIRAGANA_ROWS}
      scriptName="Hiragana"
      clearMessage="You placed all the hiragana correctly."
    />
  )
}

export default Hiragana
