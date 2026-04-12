import { useCallback, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import GameInput from './GameInput';
import StageHeader from './StageHeader';
import TimerBar from './TimerBar';

interface GameScreenProps {
  currentChallengeArray: string[];
  stage: number;
  score: number;
  phase: 'playing' | 'checking';
  onSubmit: (input: string) => Promise<void>;
  onTimeout: (currentInput: string) => void;
}

export default function GameScreen({
  currentChallengeArray,
  stage,
  score,
  phase,
  onSubmit,
  onTimeout,
}: GameScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const loading = phase === 'checking';

  const handleExpire = useCallback(() => {
    onTimeout(inputValue);
  }, [onTimeout, inputValue]);

  const { elapsed } = useTimer(phase === 'playing', handleExpire);

  const handleSubmit = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || loading) return;
    await onSubmit(trimmed);
    setInputValue('');
  }, [inputValue, loading, onSubmit]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        backgroundColor: '#000',
      }}
    >
      <TimerBar elapsed={elapsed} />
      <StageHeader stage={stage} score={score} />

      <GameInput
        choseong={currentChallengeArray}
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        disabled={loading}
      />
    </div>
  );
}
