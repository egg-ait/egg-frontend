import AdGate from './components/AdGate';
import GameComplete from './components/GameComplete';
import GameScreen from './components/GameScreen';
import ResultFeedback from './components/ResultFeedback';
import { useGameState } from './hooks/useGameState';

export default function App() {
  const {
    state,
    currentChallengeArray,
    submitAnswer,
    handleTimeout,
    nextStage,
    startWatchingAd,
    watchAd,
    exitWithoutAd,
    restartGame,
  } = useGameState();

  const { phase, currentStage, score, failReason } = state;

  if (phase === 'completed') {
    return <GameComplete score={score} onRestart={restartGame} />;
  }

  if (phase === 'correct') {
    return (
      <ResultFeedback
        type="correct"
        word={currentChallengeArray.join('')}
        onComplete={nextStage}
      />
    );
  }

  if (phase === 'wrong' || phase === 'timeout' || phase === 'ad-watching') {
    return (
      <AdGate
        isWatching={phase === 'ad-watching'}
        failReason={failReason}
        onStartWatching={startWatchingAd}
        onAdComplete={watchAd}
        onExit={exitWithoutAd}
      />
    );
  }

  // 'playing' | 'checking'
  return (
    <GameScreen
      currentChallengeArray={currentChallengeArray}
      stage={currentStage}
      score={score}
      phase={phase as 'playing' | 'checking'}
      onSubmit={submitAnswer}
      onTimeout={handleTimeout}
    />
  );
}
