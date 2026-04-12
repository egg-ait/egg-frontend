interface StageHeaderProps {
  stage: number;
  score: number;
}

export default function StageHeader({ stage, score }: StageHeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #1a1a1a',
        backgroundColor: '#000',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
        {stage}단계
      </span>
      <span style={{ fontSize: '14px', fontWeight: 500, color: '#888' }}>
        {score}점
      </span>
    </header>
  );
}
