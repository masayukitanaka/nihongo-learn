import KanaMatchGame from './components/KanaMatchGame'
import { KATAKANA_ROWS, VOWELS } from './kana-data'

function Katakana() {
  return (
    <KanaMatchGame
      vowels={VOWELS}
      rows={KATAKANA_ROWS}
      clearMessage="You placed all the katakana correctly."
    />
  )
}

export default Katakana
