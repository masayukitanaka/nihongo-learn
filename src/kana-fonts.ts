export type KanaFontId = 'zen-maru' | 'noto-sans' | 'yuji-syuku'

export type KanaFont = {
  id: KanaFontId
  label: string
  fontFamily: string
}

export const KANA_FONTS: KanaFont[] = [
  {
    id: 'zen-maru',
    label: 'Zen Maru Gothic (default)',
    fontFamily: "'Zen Maru Gothic', sans-serif",
  },
  {
    id: 'noto-sans',
    label: 'Noto Sans JP',
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  {
    id: 'yuji-syuku',
    label: 'Yuji Syuku (brush)',
    fontFamily: "'Yuji Syuku', serif",
  },
]

export const DEFAULT_KANA_FONT_ID: KanaFontId = 'zen-maru'

export function getKanaFont(id: string | null): KanaFont {
  return (
    KANA_FONTS.find((font) => font.id === id) ??
    KANA_FONTS.find((font) => font.id === DEFAULT_KANA_FONT_ID)!
  )
}
