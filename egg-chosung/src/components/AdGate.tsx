import { useEffect, useState } from 'react';
import type { FailReason } from '../types/game';

interface AdGateProps {
  isWatching: boolean;
  failReason: FailReason;
  onStartWatching: () => void;
  onAdComplete: () => void;
  onExit: () => void;
}

export default function AdGate({
  isWatching,
  failReason,
  onStartWatching,
  onAdComplete,
  onExit,
}: AdGateProps) {
  const [countdown, setCountdown] = useState(3);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isWatching) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onAdComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isWatching, onAdComplete]);

  const isTimeout = failReason === 'timeout';

  if (showConfirm) {
    return (
      <div style={fullScreen}>
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0, textAlign: 'center' }}>
          정말 처음부터 시작할까요?
        </p>
        <p style={{ fontSize: '14px', color: '#888', margin: 0, textAlign: 'center' }}>
          지금까지의 점수와 단계가 초기화됩니다.
        </p>
        <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
          <button
            onClick={() => setShowConfirm(false)}
            style={{ ...btn, flex: 1, backgroundColor: '#222', color: '#fff' }}
          >
            취소
          </button>
          <button
            onClick={onExit}
            style={{ ...btn, flex: 1, backgroundColor: '#FF3B30', color: '#fff' }}
          >
            처음부터
          </button>
        </div>
      </div>
    );
  }

  if (isWatching) {
    return (
      <div style={fullScreen}>
        <p style={{ fontSize: '13px', color: '#555', margin: 0, letterSpacing: '2px' }}>
          AD
        </p>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '3px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 800,
            color: '#fff',
          }}
        >
          {countdown}
        </div>
        <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>잠시 후 게임으로 돌아갑니다</p>
      </div>
    );
  }

  return (
    <div style={fullScreen}>
      <p
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#888',
          margin: 0,
          letterSpacing: '2px',
        }}
      >
        {isTimeout ? 'TIME OUT' : 'WRONG'}
      </p>
      <p
        style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#fff',
          margin: 0,
          lineHeight: 1,
        }}
      >
        {isTimeout ? '시간 초과' : '틀렸어요'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '320px', marginTop: '16px' }}>
        <button onClick={onStartWatching} style={{ ...btn, backgroundColor: '#222', color: '#fff' }}>
          광고 보고 계속하기
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          style={{ ...btn, backgroundColor: 'transparent', color: '#555', border: '1px solid #222' }}
        >
          처음부터 시작하기
        </button>
      </div>
    </div>
  );
}

const fullScreen: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100dvh',
  backgroundColor: '#000',
  padding: '32px 24px',
  gap: '20px',
};

const btn: React.CSSProperties = {
  width: '100%',
  height: '54px',
  fontSize: '16px',
  fontWeight: 600,
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
};
