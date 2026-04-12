import { useEffect, useRef, useState } from 'react';

const DURATION = 10; // 초

export function useTimer(active: boolean, onExpire: () => void) {
  const [elapsed, setElapsed] = useState(0);
  const onExpireRef = useRef(onExpire);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // onExpire가 리렌더링마다 바뀌어도 stale closure 방지
  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
      return;
    }

    setElapsed(0);
    const start = Date.now();

    intervalRef.current = setInterval(() => {
      const next = Math.min((Date.now() - start) / 1000, DURATION);
      setElapsed(next);

      if (next >= DURATION) {
        clearInterval(intervalRef.current!);
        onExpireRef.current();
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  return {
    elapsed,                        // 0 ~ 10
    remaining: DURATION - elapsed,  // 10 ~ 0
  };
}
