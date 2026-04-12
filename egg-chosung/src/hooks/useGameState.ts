import { useCallback, useState } from 'react';
import type { Challenge } from '../data/challenges';
import { getShuffledChallenges } from '../data/challenges';
import { supabase } from '../lib/supabase';
import type { GameState } from '../types/game';
import { extractChoseong, normalizeAnswer } from './useChoseong';
import {
  clearProgress,
  loadProgress,
  saveProgress,
} from './useGamePersistence';

// ============================================================
// 오프라인 모드 플래그
// Supabase 복구 시 false 로 변경하면 API 검증 모드로 전환됨
// ============================================================
const USE_OFFLINE_MODE = true;

function buildInitialState(): GameState {
  const saved = loadProgress();
  if (saved) {
    return {
      currentStage: saved.currentStage,
      currentChallengeIndex: saved.currentChallengeIndex,
      phase: 'playing',
      score: saved.score,
      failReason: null,
    };
  }
  return {
    currentStage: 1,
    currentChallengeIndex: 0,
    phase: 'playing',
    score: 0,
    failReason: null,
  };
}

function judgeAnswer(input: string, challenge: Challenge): boolean {
  const normalized = normalizeAnswer(input);
  const inputPattern = extractChoseong(normalized);
  if (inputPattern !== challenge.pattern) return false;

  if (USE_OFFLINE_MODE) {
    // 오프라인: pattern 일치 + answer 정확 일치
    return normalized === challenge.answer;
  }
  // 온라인 모드에서는 이 함수를 사용하지 않음 (Supabase 비동기 처리)
  return false;
}

export function useGameState() {
  const [challenges] = useState(() => getShuffledChallenges());
  const [state, setState] = useState<GameState>(buildInitialState);

  const currentChallenge =
    challenges[state.currentChallengeIndex % challenges.length];
  const currentChallengeArray = [...currentChallenge.pattern];

  const submitAnswer = useCallback(
    async (input: string) => {
      if (state.phase !== 'playing') return;

      const normalized = normalizeAnswer(input);
      if (!normalized) return;

      // 1단계: 초성 일치 체크 (오프라인/온라인 공통)
      const inputPattern = extractChoseong(normalized);
      if (inputPattern !== currentChallenge.pattern) {
        setState((prev) => ({
          ...prev,
          phase: 'wrong',
          failReason: 'wrong-answer',
        }));
        return;
      }

      if (USE_OFFLINE_MODE) {
        // 오프라인: answer 정확 일치 체크
        const isCorrect = normalized === currentChallenge.answer;
        setState((prev) => ({
          ...prev,
          phase: isCorrect ? 'correct' : 'wrong',
          score: isCorrect ? prev.score + 10 : prev.score,
          failReason: isCorrect ? null : 'wrong-answer',
        }));
      } else {
        // ── 온라인 모드 (Supabase) ──────────────────────────────
        setState((prev) => ({ ...prev, phase: 'checking', failReason: null }));
        try {
          const { data, error } = await supabase
            .from('initial_game_word')
            .select()
            .eq('content', normalized);

          if (error) throw error;

          if (data && data.length > 0) {
            setState((prev) => ({
              ...prev,
              phase: 'correct',
              score: prev.score + 10,
              failReason: null,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              phase: 'wrong',
              failReason: 'wrong-answer',
            }));
          }
        } catch {
          setState((prev) => ({
            ...prev,
            phase: 'wrong',
            failReason: 'wrong-answer',
          }));
        }
        // ────────────────────────────────────────────────────────
      }
    },
    [state.phase, currentChallenge],
  );

  // 타이머 종료 시 호출 — 현재 입력값을 받아 정답 여부 판정
  const handleTimeout = useCallback(
    (currentInput: string) => {
      if (state.phase !== 'playing') return;

      const normalized = normalizeAnswer(currentInput);

      if (normalized) {
        const isCorrect = judgeAnswer(normalized, currentChallenge);
        setState((prev) => ({
          ...prev,
          phase: isCorrect ? 'correct' : 'wrong',
          score: isCorrect ? prev.score + 10 : prev.score,
          failReason: isCorrect ? null : 'timeout',
        }));
      } else {
        // 입력값 없으면 즉시 timeout-wrong
        setState((prev) => ({
          ...prev,
          phase: 'wrong',
          failReason: 'timeout',
        }));
      }
    },
    [state.phase, currentChallenge],
  );

  const nextStage = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentChallengeIndex + 1;

      if (nextIndex >= challenges.length) {
        clearProgress();
        return { ...prev, phase: 'completed', failReason: null };
      }

      const next: GameState = {
        ...prev,
        currentStage: prev.currentStage + 1,
        currentChallengeIndex: nextIndex,
        phase: 'playing',
        failReason: null,
      };

      saveProgress({
        currentStage: next.currentStage,
        currentChallengeIndex: next.currentChallengeIndex,
        score: next.score,
        savedAt: Date.now(),
      });

      return next;
    });
  }, [challenges.length]);

  const startWatchingAd = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'ad-watching' }));
  }, []);

  const watchAd = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'playing', failReason: null }));
  }, []);

  const exitWithoutAd = useCallback(() => {
    clearProgress();
    setState({
      currentStage: 1,
      currentChallengeIndex: 0,
      phase: 'playing',
      score: 0,
      failReason: null,
    });
  }, []);

  const restartGame = useCallback(() => {
    clearProgress();
    setState({
      currentStage: 1,
      currentChallengeIndex: 0,
      phase: 'playing',
      score: 0,
      failReason: null,
    });
  }, []);

  return {
    state,
    currentChallenge,
    currentChallengeArray,
    submitAnswer,
    handleTimeout,
    nextStage,
    startWatchingAd,
    watchAd,
    exitWithoutAd,
    restartGame,
  };
}
