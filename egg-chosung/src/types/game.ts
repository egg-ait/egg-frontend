export type GamePhase =
  | 'playing'      // 문제 풀이 중
  | 'checking'     // Supabase API 응답 대기 중 (온라인 모드)
  | 'correct'      // 정답
  | 'wrong'        // 오답 → 광고 요구
  | 'timeout'      // 타이머 종료 → 광고 요구
  | 'ad-watching'  // 광고 시청 중
  | 'completed';   // 모든 단계 클리어

export type FailReason = 'wrong-answer' | 'timeout' | null;

export interface GameState {
  currentStage: number;
  currentChallengeIndex: number;
  phase: GamePhase;
  score: number;
  failReason: FailReason;
}

export interface SavedProgress {
  currentStage: number;
  currentChallengeIndex: number;
  score: number;
  savedAt: number;
}
