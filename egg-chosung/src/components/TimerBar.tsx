interface TimerBarProps {
  elapsed: number; // 0 ~ 10
}

export default function TimerBar({ elapsed }: TimerBarProps) {
  const progress = Math.max(0, 1 - elapsed / 10); // 1 → 0
  const isRed = elapsed >= 5;

  return (
    <div
      style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#1a1a1a',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          backgroundColor: isRed ? '#FF3B30' : '#3182F6',
          transition: 'background-color 0.3s',
        }}
      />
    </div>
  );
}
