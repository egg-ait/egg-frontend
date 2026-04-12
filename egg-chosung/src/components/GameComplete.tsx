interface GameCompleteProps {
  score: number;
  onRestart: () => void;
}

export default function GameComplete({ score, onRestart }: GameCompleteProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        backgroundColor: '#000',
        gap: '20px',
        padding: '32px 24px',
      }}
    >
      <p style={{ fontSize: '13px', color: '#888', margin: 0, letterSpacing: '2px' }}>
        COMPLETE
      </p>
      <p style={{ fontSize: '52px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>
        클리어!
      </p>

      <div
        style={{
          marginTop: '8px',
          padding: '24px 48px',
          border: '1px solid #222',
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#555', letterSpacing: '1px' }}>
          SCORE
        </p>
        <p style={{ margin: 0, fontSize: '48px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
          {score}
        </p>
      </div>

      <button
        onClick={onRestart}
        style={{
          marginTop: '8px',
          width: '100%',
          maxWidth: '320px',
          height: '54px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#fff',
          backgroundColor: '#222',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        다시 시작하기
      </button>
    </div>
  );
}
