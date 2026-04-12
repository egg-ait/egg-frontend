import { useRef } from 'react';

interface GameInputProps {
  choseong: string[];
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function GameInput({
  choseong,
  value,
  onChange,
  onSubmit,
  disabled,
}: GameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInput = value.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        cursor: 'text',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        padding: '0 24px 40px',
      }}
    >
      {/* 숨겨진 실제 input — fontSize 16px로 iOS 확대 방지 */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 3))}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoFocus
        maxLength={3}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          fontSize: '16px',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: 'transparent',
          caretColor: 'transparent',
        }}
      />

      {/* 초성 — 입력 없으면 큰 타이틀, 입력 중이면 작은 subtitle */}
      <div
        style={{
          display: 'flex',
          gap: hasInput ? '8px' : '20px',
          transition: 'gap 0.2s ease',
          alignItems: 'center',
        }}
      >
        {choseong.map((letter, i) => (
          <span
            key={i}
            style={{
              fontSize: hasInput ? '22px' : '80px',
              fontWeight: 800,
              color: hasInput ? '#555' : '#fff',
              lineHeight: 1,
              transition: 'font-size 0.2s ease, color 0.2s ease',
              letterSpacing: hasInput ? '0' : '-2px',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* 사용자 입력 글자 */}
      {hasInput && (
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '28px',
            alignItems: 'flex-end',
          }}
        >
          {[...value].map((char, i) => (
            <span
              key={i}
              style={{
                fontSize: '80px',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1,
                letterSpacing: '-2px',
              }}
            >
              {char}
            </span>
          ))}
          {/* 빈 자리: 다음 입력 위치 밑줄 */}
          {Array.from({ length: 3 - value.length }).map((_, i) => (
            <span
              key={`empty-${i}`}
              style={{
                display: 'inline-block',
                width: '52px',
                height: '80px',
                borderBottom: i === 0 ? '3px solid #fff' : '3px solid #333',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
