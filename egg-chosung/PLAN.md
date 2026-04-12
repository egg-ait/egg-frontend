# 초성게임 v3 구현 계획

## 변경 개요 (4가지)
1. 임시 오프라인 정답 판정 (Supabase 복구 시 1줄 플래그 전환)
2. 10초 타이머 프로그레스바 (timeout → wrong/correct 처리)
3. 입력 UX 개편 (초성 subtitle 전환 + autoFocus + 3글자 제한)
4. 블랙 & 화이트 전체 디자인

---

## Phase 0: 현재 코드 상태 (탐색 완료)

### 핵심 파일 현황
| 파일 | 현재 상태 | 변경 필요 |
|---|---|---|
| `src/data/challenges.ts` | `CHALLENGE_LIST: string[]` (패턴만) | `{ pattern, answer }[]` 로 교체 |
| `src/types/game.ts` | phase: playing/checking/correct/wrong/... | `'timeout'` 추가, `failReason` 필드 추가 |
| `src/hooks/useGameState.ts` | submitAnswer → Supabase async | 오프라인 분기 + handleTimeout 추가 |
| `src/components/ChoseongDisplay.tsx` | 별도 컴포넌트 | GameInput으로 흡수 (삭제) |
| `src/components/AnswerInput.tsx` | 별도 컴포넌트 | GameInput으로 흡수 (삭제) |
| `src/components/GameScreen.tsx` | ChoseongDisplay + AnswerInput 조합 | TimerBar + GameInput 통합, input 상태 lift-up |
| 모든 컴포넌트 | 흰색/파란 라이트 테마 | 검정 배경 다크 테마 |

### 확인된 타입/인터페이스
```typescript
// 현재 GamePhase (types/game.ts)
type GamePhase = 'playing' | 'checking' | 'correct' | 'wrong' | 'ad-watching' | 'completed'

// 현재 GameState
interface GameState {
  currentStage: number;
  currentChallengeIndex: number;
  phase: GamePhase;
  score: number;
}

// 현재 challenges.ts
CHALLENGE_LIST: string[]  // 예: 'ㄱㅇㅈ'
getShuffledChallenges(): string[]
```

### 현재 App.tsx phase 라우팅
```
completed → GameComplete
correct   → ResultFeedback (1.5초 후 nextStage)
wrong | ad-watching → AdGate
playing | checking  → GameScreen (loading=checking)
```

---

## Phase 1: 데이터 구조 + 오프라인 모드

**목표:** challenges.ts에 answer 추가, USE_OFFLINE_MODE 플래그로 Supabase ↔ 오프라인 전환

### 1-1. src/data/challenges.ts 전면 교체

```typescript
export interface Challenge {
  pattern: string;  // 초성 패턴 (예: 'ㄱㅇㅈ')
  answer: string;   // 정답 단어 (예: '강아지') — 오프라인 모드용
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
```

### 1-2. src/types/game.ts 수정

```typescript
export type GamePhase =
  | 'playing'
  | 'checking'
  | 'correct'
  | 'wrong'
  | 'timeout'      // ← 추가: 타이머 종료 (입력값 없거나 오답)
  | 'ad-watching'
  | 'completed';

export type FailReason = 'wrong-answer' | 'timeout' | null;

export interface GameState {
  currentStage: number;
  currentChallengeIndex: number;
  phase: GamePhase;
  score: number;
  failReason: FailReason;  // ← 추가
}

export interface SavedProgress {
  currentStage: number;
  currentChallengeIndex: number;
  score: number;
  savedAt: number;
}
```

### 1-3. src/hooks/useGameState.ts 수정

핵심: `USE_OFFLINE_MODE` 플래그 + `handleTimeout` 추가

```typescript
// ============================================================
// 오프라인 모드 플래그 — Supabase 복구 시 false로 변경
// ============================================================
const USE_OFFLINE_MODE = true;

// buildInitialState: failReason: null 추가
// submitAnswer:
//   if (USE_OFFLINE_MODE) {
//     // 오프라인: pattern 일치 + answer 정확 일치
//     const isCorrect = normalizeAnswer(input) === challenge.answer;
//     setState(prev => ({ ...prev, phase: isCorrect ? 'correct' : 'wrong', failReason: isCorrect ? null : 'wrong-answer', score: isCorrect ? prev.score + 10 : prev.score }))
//   } else {
//     // [기존 Supabase 로직 — 주석 아님, 실제 코드]
//     setState checking → supabase.from('initial_game_word')...
//   }

// handleTimeout(currentInput: string):
//   if (phase !== 'playing') return
//   const normalized = normalizeAnswer(currentInput)
//   if (normalized) {
//     // 입력값 있으면 정답 체크
//     const isCorrect = USE_OFFLINE_MODE
//       ? normalized === challenge.answer
//       : ... (offline과 동일 처리)
//     setState phase: isCorrect ? 'correct' : 'wrong', failReason: isCorrect ? null : 'timeout'
//   } else {
//     // 입력값 없으면 바로 wrong (timeout)
//     setState phase: 'wrong', failReason: 'timeout'
//   }
```

**중요:** `submitAnswer`의 초성 체크 로직 (`extractChoseong(input) !== pattern → wrong`) 은 오프라인/온라인 모두 공통 적용.

### 1-4. useGameState가 반환하는 `currentChallenge` 타입 변경

```typescript
// 변경 전: currentChallenge: string, currentChallengeArray: string[]
// 변경 후:
currentChallenge: Challenge          // { pattern, answer }
currentChallengeArray: string[]      // [...challenge.pattern] 동일
```

### 검증
- `tsc --noEmit` 에러 없음
- USE_OFFLINE_MODE=true 에서 정답('강아지') 입력 → correct
- USE_OFFLINE_MODE=true 에서 오답('고양이') 입력 → wrong (초성 불일치로 즉시)
- USE_OFFLINE_MODE=true 에서 초성 맞지만 다른 단어('갈아지') → wrong (answer 불일치)

---

## Phase 2: 타이머 (useTimer + TimerBar)

**목표:** 10초 카운트다운 프로그레스바, timeout 처리

### 2-1. src/hooks/useTimer.ts (신규)

```typescript
// useTimer(active: boolean, onExpire: () => void)
// - active가 true로 바뀌는 순간 10초 타이머 시작
// - active가 false → 타이머 정지 및 리셋
// - onExpire: 10초 경과 시 콜백
// - 반환: { elapsed: number (0~10), remaining: number (10~0) }

import { useEffect, useRef, useState } from 'react';

const DURATION = 10; // 초

export function useTimer(active: boolean, onExpire: () => void) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);

  // onExpire가 바뀌어도 ref는 최신값 유지
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
      return;
    }

    setElapsed(0);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const newElapsed = Math.min((Date.now() - start) / 1000, DURATION);
      setElapsed(newElapsed);
      if (newElapsed >= DURATION) {
        clearInterval(intervalRef.current!);
        onExpireRef.current();
      }
    }, 100); // 100ms 간격으로 부드럽게

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  return { elapsed, remaining: DURATION - elapsed };
}
```

### 2-2. src/components/TimerBar.tsx (신규)

```typescript
// props: elapsed (0~10)
// - progress = 1 - elapsed/10  (1 → 0)
// - width: `${progress * 100}%`
// - 방향: 왼쪽 정렬 (오른쪽에서 왼쪽으로 줄어드는 효과 = width 감소)
// - 색상: elapsed < 5 → #3182F6 (파랑), elapsed >= 5 → #FF3B30 (빨강)
// - transition: background-color 0.3s

interface TimerBarProps { elapsed: number; }

export default function TimerBar({ elapsed }: TimerBarProps) {
  const progress = Math.max(0, 1 - elapsed / 10);
  const color = elapsed >= 5 ? '#FF3B30' : '#3182F6';

  return (
    <div style={{ width: '100%', height: '4px', backgroundColor: '#333' }}>
      <div style={{
        height: '100%',
        width: `${progress * 100}%`,
        backgroundColor: color,
        transition: 'background-color 0.3s',
        transformOrigin: 'left',
      }} />
    </div>
  );
}
```

### 2-3. GameScreen.tsx 수정 (타이머 통합)

```typescript
// - inputValue 상태를 GameScreen으로 lift-up (controlled input)
// - const handleExpire = useCallback(() => onTimeout(inputValue), [inputValue, onTimeout])
// - const { elapsed } = useTimer(phase === 'playing', handleExpire)
// - <TimerBar elapsed={elapsed} /> 를 화면 최상단에 배치

interface GameScreenProps {
  currentChallengeArray: string[];
  stage: number;
  score: number;
  phase: 'playing' | 'checking';       // ← phase 전달 추가
  onSubmit: (input: string) => Promise<void>;
  onTimeout: (input: string) => void;  // ← 추가
}
```

### 2-4. App.tsx 수정

```typescript
// timeout phase → AdGate (wrong과 동일하게 처리)
if (phase === 'wrong' || phase === 'timeout' || phase === 'ad-watching') {
  return (
    <AdGate
      isWatching={phase === 'ad-watching'}
      failReason={state.failReason}  // ← 추가
      ...
    />
  );
}

// GameScreen에 phase + onTimeout 전달
<GameScreen
  phase={phase as 'playing' | 'checking'}
  onTimeout={handleTimeout}
  ...
/>
```

### 2-5. AdGate.tsx 수정

```typescript
// failReason prop 추가
interface AdGateProps {
  failReason: FailReason;  // ← 추가
  ...
}
// 틀렸을 때 메시지:
// failReason === 'timeout' → "시간 초과!" 
// failReason === 'wrong-answer' → "틀렸습니다!"
```

### 검증
- playing 상태에서 10초 경과 → wrong phase (failReason: 'timeout')
- playing 상태에서 입력값 있는 채로 10초 경과 → 정답이면 correct, 오답이면 wrong (failReason: 'timeout')
- correct/wrong 상태에서 타이머 멈춤 확인
- 프로그레스바 0~5초 파랑, 5~10초 빨강

---

## Phase 3: 입력 UX 개편 (GameInput 신규)

**목표:** ChoseongDisplay + AnswerInput → GameInput 하나로 통합. 초성 subtitle 전환 애니메이션.

### 3-1. src/components/GameInput.tsx (신규)

```
[입력 없을 때]
┌─────────────────────────────┐
│                             │
│    ㄱ    ㅇ    ㅈ           │  ← 큰 타이틀 (fontSize: 72px)
│                             │
│    숨겨진 input (autoFocus) │
└─────────────────────────────┘

[입력 중일 때]
┌─────────────────────────────┐
│  ㄱ ㅇ ㅈ                  │  ← 작은 subtitle (fontSize: 18px, 위로 이동)
│                             │
│       강 아 지              │  ← 큰 타이틀 (fontSize: 72px)
│                             │
│    숨겨진 input             │
└─────────────────────────────┘
```

```typescript
interface GameInputProps {
  choseong: string[];       // ['ㄱ','ㅇ','ㅈ']
  value: string;            // 부모(GameScreen)에서 controlled
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

// 구현 포인트:
// 1. maxLength=3, type="text"
// 2. autoFocus 속성
// 3. input은 position: absolute; opacity: 0 (투명) 으로 숨기되 포커스 유지
//    → 화면에 표시되는 글자는 value를 커스텀 렌더링
// 4. 초성 표시: value.length === 0 → 큰 타이틀, value.length > 0 → 작은 subtitle
// 5. 입력값 표시: value를 [...value]로 쪼개서 각 글자를 박스나 큰 텍스트로 렌더
// 6. Enter 키 → onSubmit

// 전체 영역 클릭 시 input에 포커스
// ref로 input 접근 후 .focus() 호출
```

### 3-2. GameScreen.tsx 수정

```typescript
// inputValue 상태 lift-up
const [inputValue, setInputValue] = useState('');

// 제출 시 inputValue 초기화
const handleSubmit = async () => {
  if (!inputValue.trim()) return;
  await onSubmit(inputValue);
  setInputValue('');
};

// 기존 ChoseongDisplay + AnswerInput 제거, GameInput으로 교체
<GameInput
  choseong={currentChallengeArray}
  value={inputValue}
  onChange={setInputValue}
  onSubmit={handleSubmit}
  disabled={loading}
/>
```

### 3-3. ChoseongDisplay.tsx, AnswerInput.tsx 삭제

→ GameInput.tsx가 두 컴포넌트의 역할을 모두 담당

### 검증
- 모바일 시뮬레이터에서 입력창 자동 포커스 확인
- 3글자 초과 입력 불가 확인
- 입력 시 초성 subtitle로 올라가는 전환 확인
- Enter 입력 → 제출 동작 확인

---

## Phase 4: 블랙 & 화이트 디자인

**목표:** 모든 컴포넌트를 검정 배경, 흰 텍스트, 회색 버튼으로 통일

### 디자인 토큰
```
배경:        #000000
텍스트:      #FFFFFF
서브텍스트:  #888888
버튼(기본):  #222222 (테두리 없음)
버튼(텍스트): #FFFFFF
강조(파랑):  #3182F6
강조(빨강):  #FF3B30
구분선:      #1A1A1A
```

### 수정 파일별 변경사항

**StageHeader.tsx**
- backgroundColor: #000 → borderBottom: '1px solid #1a1a1a'
- 단계 텍스트: #fff (파랑 제거)
- 점수 텍스트: #888

**GameInput.tsx** (신규이므로 처음부터 다크)
- 초성 큰 타이틀: 흰색, 테두리 없음
- 초성 subtitle: #888
- 입력 중인 글자: 흰색 큰 텍스트

**TimerBar.tsx** (신규이므로 처음부터 다크)
- 배경 트랙: #1a1a1a
- 진행 바: 파랑 → 빨강

**ResultFeedback.tsx**
- bg: #000, 텍스트: #fff
- "정답!" → 흰색 큰 텍스트

**AdGate.tsx**
- bg: #000
- 버튼: #222 (회색)
- "광고 보고 계속하기": 흰색 텍스트, #222 bg
- "처음부터 시작하기": #888 텍스트, #111 bg

**GameComplete.tsx**
- bg: #000
- 점수: 흰색
- 버튼: #222

### 검증
- 흰색 배경, 파란색 요소 없는지 전수 확인
- `grep -r 'backgroundColor.*#fff' src/` → 0건

---

## 구현 순서 요약 (Claude에게 전달)

```
1단계: Phase 1
   → src/data/challenges.ts 교체 (Challenge 인터페이스)
   → src/types/game.ts 수정 (timeout phase, failReason)
   → src/hooks/useGameState.ts 수정 (USE_OFFLINE_MODE, handleTimeout)

2단계: Phase 2
   → src/hooks/useTimer.ts 신규
   → src/components/TimerBar.tsx 신규
   → src/components/AdGate.tsx 수정 (failReason prop)
   → src/App.tsx 수정 (timeout 라우팅, handleTimeout 전달)
   → src/components/GameScreen.tsx 수정 (phase/onTimeout prop, useTimer 통합)

3단계: Phase 3
   → src/components/GameInput.tsx 신규 (ChoseongDisplay + AnswerInput 대체)
   → src/components/GameScreen.tsx 수정 (inputValue lift-up, GameInput 사용)
   → ChoseongDisplay.tsx, AnswerInput.tsx 삭제

4단계: Phase 4
   → StageHeader, ResultFeedback, AdGate, GameComplete, GameScreen 다크 테마 적용
```

---

## Anti-patterns

- `USE_OFFLINE_MODE` 플래그 삭제 금지 — 추후 Supabase 복구 시 `false`로만 변경
- `timeout` phase를 `wrong`과 별도로 유지 — failReason으로 UI 분기
- `useTimer`의 `onExpire` 콜백은 ref로 감싸서 stale closure 방지
- input을 `display: none`으로 숨기면 포커스 불가 → `opacity: 0; position: absolute` 사용
- 3글자 제한: `maxLength` 속성으로 처리, JS 로직으로 slice 중복 처리 금지
- 다크 테마: `#fff` 배경 모두 제거, `#EBF3FF` 등 라이트 컬러 제거
