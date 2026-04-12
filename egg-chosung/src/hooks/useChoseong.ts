const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

export function extractChoseong(word: string): string {
  return [...word]
    .map((char) => {
      const code = char.charCodeAt(0) - 0xac00;
      if (code < 0 || code > 11171) return char;
      return CHOSEONG[Math.floor(code / 28 / 21)];
    })
    .join('');
}

// "사과" → ["ㅅ", "ㄱ"]
export function extractChoseongArray(word: string): string[] {
  return [...word].map((char) => {
    const code = char.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return char;
    return CHOSEONG[Math.floor(code / 28 / 21)];
  });
}

export function normalizeAnswer(input: string): string {
  return input.trim().replace(/\s+/g, '');
}

export function checkAnswer(input: string, word: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(word);
}
