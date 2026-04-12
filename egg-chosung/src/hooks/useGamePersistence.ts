import type { SavedProgress } from '../types/game';

const STORAGE_KEY = 'egg-chosung-progress';

export function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
}

export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage 쓰기 실패 시 무시
  }
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
