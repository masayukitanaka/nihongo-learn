export type KanaRow = {
  consonant: string
  chars: (string | null)[]
}

export function countKanaChars(rows: KanaRow[]): number {
  return rows.flatMap((row) => row.chars).filter((c) => c !== null).length
}

export const VOWELS = ['a', 'i', 'u', 'e', 'o']

export const HIRAGANA_ROWS: KanaRow[] = [
  { consonant: '∅', chars: ['あ', 'い', 'う', 'え', 'お'] },
  { consonant: 'k', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { consonant: 's', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { consonant: 't', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { consonant: 'n', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { consonant: 'h', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { consonant: 'm', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { consonant: 'y', chars: ['や', null, 'ゆ', null, 'よ'] },
  { consonant: 'r', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { consonant: 'w', chars: ['わ', null, null, null, 'を', 'ん'] },
]

export const KATAKANA_ROWS: KanaRow[] = [
  { consonant: '∅', chars: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
  { consonant: 'k', chars: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
  { consonant: 's', chars: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
  { consonant: 't', chars: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
  { consonant: 'n', chars: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
  { consonant: 'h', chars: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
  { consonant: 'm', chars: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
  { consonant: 'y', chars: ['ヤ', null, 'ユ', null, 'ヨ'] },
  { consonant: 'r', chars: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
  { consonant: 'w', chars: ['ワ', null, null, null, 'ヲ', 'ン'] },
]
