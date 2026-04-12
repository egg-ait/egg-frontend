export interface Challenge {
  pattern: string; // 초성 패턴 (예: 'ㄱㅇㅈ')
  answer: string;  // 정답 단어 (예: '강아지') — 오프라인 모드용
}

export const CHALLENGE_LIST: Challenge[] = [
  { pattern: 'ㄱㅇㅈ', answer: '강아지' },
  { pattern: 'ㄱㅇㄷ', answer: '고등어' },
  { pattern: 'ㄱㅂㅌ', answer: '갈비탕' },
  { pattern: 'ㄱㅊㅇ', answer: '기차역' },
  { pattern: 'ㄴㅈㄱ', answer: '냉장고' },
  { pattern: 'ㄴㅌㅂ', answer: '노트북' },
  { pattern: 'ㄷㄹㄱ', answer: '드래곤' },
  { pattern: 'ㄷㄹㅈ', answer: '다람쥐' },
  { pattern: 'ㄷㄱㄹ', answer: '돌고래' },
  { pattern: 'ㄷㅅㄱ', answer: '도서관' },
  { pattern: 'ㄷㅁㅇ', answer: '동물원' },
  { pattern: 'ㄷㅂㅇ', answer: '떡볶이' },
  { pattern: 'ㅂㄴㄴ', answer: '바나나' },
  { pattern: 'ㅂㄱㄱ', answer: '불고기' },
  { pattern: 'ㅂㅂㅂ', answer: '비빔밥' },
  { pattern: 'ㅂㅎㅈ', answer: '백화점' },
  { pattern: 'ㅂㅁㄱ', answer: '박물관' },
  { pattern: 'ㅅㄱㅅ', answer: '삼겹살' },
  { pattern: 'ㅅㄱㅌ', answer: '삼계탕' },
  { pattern: 'ㅅㄹㅌ', answer: '설렁탕' },
  { pattern: 'ㅅㅂㄱ', answer: '소방관' },
  { pattern: 'ㅅㄷㅂ', answer: '순두부' },
  { pattern: 'ㅅㅇㅈ', answer: '수영장' },
  { pattern: 'ㅅㅅㄴ', answer: '선생님' },
  { pattern: 'ㅅㅍㄱ', answer: '선풍기' },
  { pattern: 'ㅅㅁㅇ', answer: '식물원' },
  { pattern: 'ㅇㄹㅅ', answer: '요리사' },
  { pattern: 'ㅇㅅㅇ', answer: '원숭이' },
  { pattern: 'ㅇㅈㅇ', answer: '오징어' },
  { pattern: 'ㅇㄴㅋ', answer: '유니콘' },
  { pattern: 'ㅈㄷㅊ', answer: '자동차' },
  { pattern: 'ㅈㅎㄱ', answer: '전화기' },
  { pattern: 'ㅈㅎㅊ', answer: '지하철' },
  { pattern: 'ㅈㅈㅁ', answer: '자장면' },
  { pattern: 'ㅉㅈㅁ', answer: '짜장면' },
  { pattern: 'ㅋㅇㄹ', answer: '코알라' },
  { pattern: 'ㅋㄲㄹ', answer: '코끼리' },
  { pattern: 'ㅋㅍㅌ', answer: '컴퓨터' },
  { pattern: 'ㅌㄱㄷ', answer: '태권도' },
  { pattern: 'ㅌㄴㅅ', answer: '테니스' },
  { pattern: 'ㅌㅅㅇ', answer: '탕수육' },
  { pattern: 'ㅍㅇㅈ', answer: '편의점' },
  { pattern: 'ㅎㄹㅇ', answer: '호랑이' },
  { pattern: 'ㅎㄷㅍ', answer: '헤드폰' },
  { pattern: 'ㅎㅂㄱ', answer: '햄버거' },
  { pattern: 'ㅁㄹㅌ', answer: '마라탕' },
  { pattern: 'ㅁㅈㄱ', answer: '무지개' },
  { pattern: 'ㅁㅅㄱ', answer: '미술관' },
];

export function getShuffledChallenges(): Challenge[] {
  const shuffled = [...CHALLENGE_LIST];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
