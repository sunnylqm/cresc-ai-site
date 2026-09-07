import React from 'react';

/**
 * 首页手绘风插画与线性图标。
 * 统一约定：viewBox 内部只用 currentColor 描边，尺寸交给外层 CSS 控制，
 * 这样浅色/深色模式下不用再准备两套资源。
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function ThinkingPerson({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 230" role="img" aria-label="一个正在思考的人">
      <g {...stroke} strokeWidth={2.2}>
        {/* 身体（毛衣）与撑在桌上的手臂，实心黑块 */}
        <path d="M104 192c0-30 14-46 32-52h30c20 6 34 22 34 52z" fill="currentColor" stroke="none" />
        <path d="M100 192l6-40c2-13 20-16 25-4l4 44z" fill="currentColor" stroke="none" />
        {/* 脸 */}
        <path d="M114 72h72c3 30-1 54-13 66-12 11-34 11-46 0-12-12-16-36-13-66z" fill="var(--home-paper)" />
        {/* 头发 */}
        <path
          d="M110 80c-10-36 12-62 40-62s50 26 40 62c-3-14-11-23-22-26-12 7-32 8-46 1-6 5-10 13-12 25z"
          fill="currentColor"
          stroke="none"
        />
        <circle cx="115" cy="42" r="12" fill="currentColor" stroke="none" />
        <circle cx="140" cy="26" r="14" fill="currentColor" stroke="none" />
        <circle cx="168" cy="28" r="13" fill="currentColor" stroke="none" />
        <circle cx="186" cy="48" r="11" fill="currentColor" stroke="none" />
        {/* 五官：望向上方的眼神 */}
        <path d="M129 86c4-4 10-4 14 0M158 86c4-4 10-4 14 0" />
        <circle cx="136" cy="96" r="2.6" fill="currentColor" stroke="none" />
        <circle cx="165" cy="96" r="2.6" fill="currentColor" stroke="none" />
        <path d="M150 100c2 6 1 9-2 10 2 2 4 2 6 1" />
        <path d="M142 120c6 5 14 5 20-1" />
        {/* 托腮的手 */}
        <path d="M110 132c-4-12 4-21 14-19 8 2 13 9 12 17-1 9-8 14-16 13-5-1-9-5-10-11z" fill="var(--home-paper)" />
        <path d="M116 122c4-2 9-2 13 1M115 130c4-2 9-2 13 1" strokeWidth={1.4} />
        {/* 桌面与马克杯 */}
        <path d="M28 192h242" strokeWidth={2.6} />
        <path d="M222 158h36v20a14 14 0 0 1-14 14h-8a14 14 0 0 1-14-14z" fill="var(--home-paper)" />
        <path d="M258 164h5a9 9 0 0 1 0 18h-5" />
      </g>
    </svg>
  );
}

export function ThoughtBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="home-bubble">
      <div className="home-bubble__body">{children}</div>
      <span className="home-bubble__dot home-bubble__dot--lg" />
      <span className="home-bubble__dot home-bubble__dot--md" />
      <span className="home-bubble__dot home-bubble__dot--sm" />
    </div>
  );
}

export function Signpost({ labels }: { labels: string[] }) {
  return (
    <div className="home-signpost" aria-hidden="true">
      <div className="home-signpost__post" />
      {labels.map((label, i) => (
        <div
          key={label}
          className={`home-signpost__arm home-signpost__arm--${i % 2 === 0 ? 'right' : 'left'}`}
          style={{ top: 18 + i * 74 }}
        >
          <span>{label}</span>
        </div>
      ))}
      <div className="home-signpost__grass">
        <svg viewBox="0 0 160 30" {...stroke}>
          <path d="M8 28c4-10 8-14 12-18M26 28c2-8 6-12 10-15M52 28c-3-9-7-13-11-16M120 28c3-10 7-14 11-18M140 28c2-8 5-12 9-14M100 28c-3-9-6-13-10-15" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- 问题卡片图标 ---------- */

export const questionIcons: Record<string, (props: { className?: string }) => React.JSX.Element> = {
  coins: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <ellipse cx="26" cy="20" rx="17" ry="7" />
      <path d="M9 20v8c0 3.9 7.6 7 17 7s17-3.1 17-7v-8" />
      <path d="M9 28v8c0 3.9 7.6 7 17 7s17-3.1 17-7" />
      <ellipse cx="38" cy="44" rx="17" ry="7" />
      <path d="M21 44v6c0 3.9 7.6 7 17 7s17-3.1 17-7v-6" />
    </svg>
  ),
  bolt: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <rect x="10" y="8" width="44" height="48" rx="8" />
      <path d="M35 18 24 36h9l-4 12 15-19h-9z" />
    </svg>
  ),
  media: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <rect x="6" y="12" width="34" height="28" rx="5" />
      <circle cx="17" cy="22" r="3.2" />
      <path d="M8 34l9-8 11 10" />
      <rect x="28" y="30" width="30" height="24" rx="6" />
      <path d="M39 38l9 4-9 4z" />
    </svg>
  ),
  scale: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <path d="M32 12v38M20 52h24M14 22h36M32 12a3 3 0 1 0 0-.1" />
      <path d="M14 22 6 40h16zM50 22l-8 18h16z" />
      <path d="M6 40a8 8 0 0 0 16 0M42 40a8 8 0 0 0 16 0" />
    </svg>
  ),
  briefcase: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <rect x="7" y="20" width="50" height="34" rx="6" />
      <path d="M24 20v-5a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v5" />
      <path d="M7 33h50M29 33v6h6v-6" />
    </svg>
  ),
  person: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <path d="M20 26c0-9 5-15 12-15s12 6 12 15c0 10-5 17-12 17s-12-7-12-17z" />
      <path d="M20 24c-3-12 4-19 12-19s15 6 13 19" fill="currentColor" stroke="none" />
      <path d="M27 28h.02M37 28h.02" strokeWidth={3} />
      <path d="M29 35c2 1.6 4 1.6 6 0" />
      <path d="M12 58c2-10 9-15 20-15s18 5 20 15" />
    </svg>
  ),
  chat: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <path d="M8 18a8 8 0 0 1 8-8h24a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H24l-10 8v-8h-6z" />
      <path d="M20 20h16M20 28h10" />
      <path d="M50 26h6a8 8 0 0 1 8 8v22" transform="translate(-6 6)" />
    </svg>
  ),
  shield: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <path d="M32 6 10 15v18c0 13 9 21 22 25 13-4 22-12 22-25V15z" />
      <path d="m22 31 7 8 14-15" />
    </svg>
  ),
  gauge: ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" {...stroke}>
      <path d="M8 44a24 24 0 1 1 48 0" />
      <path d="M8 44h10M46 44h10M32 20v-6M16 27l-4-4M48 27l4-4" />
      <path d="m32 44 12-12" strokeWidth={2.4} />
      <circle cx="32" cy="44" r="3.5" />
    </svg>
  ),
};
