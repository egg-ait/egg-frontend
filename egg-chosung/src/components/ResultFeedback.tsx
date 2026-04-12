import { useEffect } from 'react';

interface ResultFeedbackProps {
  type: 'correct';
  word: string;
  onComplete: () => void;
}

export default function ResultFeedback({ word, onComplete }: ResultFeedbackProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        backgroundColor: '#000',
        gap: '16px',
        padding: '20px',
      }}
    >
      <p
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#888',
          margin: 0,
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        CORRECT
      </p>
      <p
        style={{
          fontSize: '64px',
          fontWeight: 800,
          color: '#fff',
          margin: 0,
          letterSpacing: '-2px',
          lineHeight: 1,
        }}
      >
        {word}
      </p>
      <p
        style={{
          fontSize: '18px',
          color: '#3182F6',
          margin: 0,
          fontWeight: 600,
        }}
      >
        +10
      </p>
    </div>
  );
}
