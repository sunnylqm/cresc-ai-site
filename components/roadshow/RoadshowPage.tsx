import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withBase } from '@rspress/core/runtime';

const MODELS = ['GPT', 'Claude', 'DeepSeek', 'GLM', 'Kimi'];

// 额度条上的豆子数量。豆子是一颗颗画出来的而不是重复背景，
// 单程 24 口正好跨过 24 个豆位（首尾各一颗，故 25 颗），
// 这样「走一步」和「嚼一口」是同一个节拍（见 roadshow.scss）。
const QUOTA_BEANS = 25;

// 额度条的时间线，必须和 roadshow.scss 里的 --chomp / --lap 保持一致
const CHOMP_MS = 260;
const LAP_MS = CHOMP_MS * 52;

// 街机原版的四只鬼
const GHOSTS = ['blinky', 'pinky', 'inky', 'clyde'] as const;
const FRUITS = ['cherry', 'strawberry', 'orange'] as const;

type Companion =
  | { id: number; kind: 'ghost'; variant: string; rtl: boolean }
  | { id: number; kind: 'fruit'; variant: string; at: number }
  | null;

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

/** 每次掉头后随机抽一个同伴：鬼在身后追、水果摆在路中间等着被吃，也可能什么都不来。 */
function rollCompanion(id: number, rtl: boolean): Companion {
  const r = Math.random();
  if (r < 0.4) return { id, kind: 'ghost', variant: pick(GHOSTS), rtl };
  if (r < 0.72) return { id, kind: 'fruit', variant: pick(FRUITS), at: 7 + Math.floor(Math.random() * 11) };
  return null;
}

export default function RoadshowPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'poster'>('interactive');
  const [isHovered, setIsHovered] = useState(false);
  const [companion, setCompanion] = useState<Companion>(null);
  const pacRef = useRef<HTMLSpanElement>(null);

  // 全屏切换逻辑
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  }, []);

  // 监听全屏状态变化和快捷键
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'p' || e.key === 'P') {
        setViewMode((prev) => (prev === 'interactive' ? 'poster' : 'interactive'));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullscreen]);

  /*
   * 额度条的同伴：每走完一趟掉头时换一个。
   *
   * 时机是从吃豆人那条 CSS 动画的 currentTime 里读出来的，而不是自己起一个
   * setInterval —— 后者跟 CSS 的时间线各走各的，几分钟就会漂开，鬼会在半路
   * 凭空出现。读 currentTime 则永远咬着动画的相位。
   */
  useEffect(() => {
    if (viewMode !== 'interactive') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let leg = -1;
    let seq = 0;
    const timer = window.setInterval(() => {
      const anim = pacRef.current?.getAnimations?.()[0];
      const now = typeof anim?.currentTime === 'number' ? anim.currentTime : null;
      if (now === null) return;
      // 一圈两趟：前半圈往右，后半圈往左
      const next = ((now % LAP_MS) + LAP_MS) % LAP_MS < LAP_MS / 2 ? 0 : 1;
      if (next === leg) return;
      leg = next;
      setCompanion(rollCompanion((seq += 1), leg === 1));
    }, 120);

    return () => window.clearInterval(timer);
  }, [viewMode]);

  // 触屏激活后，若无进一步操作在 3.5 秒后自动隐退
  useEffect(() => {
    if (!isHovered) return;
    const timer = setTimeout(() => {
      setIsHovered(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isHovered]);

  return (
    <div
      className={`roadshow-container ${isFullscreen ? 'is-fullscreen' : ''} view-${viewMode}`}
      onDoubleClick={toggleFullscreen}
    >
      {/* 左上角品牌标识：字标里的点会时不时轻轻跳一下 */}
      <a href={withBase('/')} className="roadshow-brand" aria-label="36k.ai 首页">
        <img src={withBase('/36k.svg')} alt="" className="roadshow-brand__mark" />
        <span className="roadshow-brand__name" aria-hidden="true">
          36k<span className="roadshow-brand__dot">.</span>ai
        </span>
      </a>

      {/* 顶部控制栏（平时完全隐藏，只有 hover 到右上角区域时才显现） */}
      <nav
        className={`roadshow-controls ${isHovered ? 'is-hovered' : ''}`}
        aria-label="路演控制栏"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered((prev) => !prev)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="roadshow-btn"
          onClick={() => setViewMode((m) => (m === 'interactive' ? 'poster' : 'interactive'))}
        >
          {viewMode === 'interactive' ? '原版海报 (P)' : '大屏互动版 (P)'}
        </button>

        <button type="button" className="roadshow-btn" onClick={toggleFullscreen}>
          {isFullscreen ? '退出全屏 (F)' : '全屏展示 (F)'}
        </button>

        <a href={withBase('/')} className="roadshow-btn">
          首页
        </a>
      </nav>

      {/* 模式一：原图海报全屏展示 */}
      {viewMode === 'poster' ? (
        <div className="poster-stage">
          <img
            src={withBase('/assets/image/36kai.png')}
            alt="加好友送 $36 Token"
            className="poster-img"
          />
        </div>
      ) : (
        /* 模式二：展会大屏版（纯净聚焦：三段式主张 + 二维码） */
        <main className="roadshow-stage">
          <div className="roadshow-content">
            {/* 核心文案区：三段式主张 */}
            <section className="rs-hero">
              <h1 className="rs-hero__title">
                <span className="rs-hero__line">微信加好友</span>
                <span className="rs-hero__line">
                  直接送{' '}
                  <span className="rs-hero__nowrap">
                    <mark className="rs-hero__amount">$36</mark> Token
                  </span>
                </span>
                <span className="rs-hero__line">手把手教你用 AI</span>
              </h1>

              <p className="rs-hero__models">
                {MODELS.map((name, i) => (
                  <React.Fragment key={name}>
                    {i > 0 && <span className="rs-hero__models-sep" aria-hidden="true" />}
                    <span className="rs-hero__model">{name}</span>
                  </React.Fragment>
                ))}
                <span className="rs-hero__models-tail">等模型任意使用</span>
              </p>

              {/* 额度条：吃豆人把豆子吃光，到头掉个方向、重新摆满，再吃回来 */}
              <div className="rs-quota">
                <div className="rs-quota__track" aria-hidden="true">
                  <span className="rs-quota__beans">
                    {Array.from({ length: QUOTA_BEANS }, (_, i) => (
                      <i key={i} className="rs-quota__bean" />
                    ))}
                    {/* 水果放在豆子这一层里，于是同一个 clip 会把它一起吃掉 */}
                    {companion?.kind === 'fruit' && (
                      <i
                        key={companion.id}
                        className={`rs-quota__fruit rs-quota__fruit--${companion.variant}`}
                        style={{ '--at': companion.at } as React.CSSProperties}
                      />
                    )}
                  </span>

                  {companion?.kind === 'ghost' && (
                    <span
                      key={companion.id}
                      className={`rs-quota__ghost rs-quota__ghost--${companion.variant} ${
                        companion.rtl ? 'is-rtl' : ''
                      }`}
                    >
                      <i className="rs-quota__ghost-skirt" />
                      <i className="rs-quota__eye rs-quota__eye--l" />
                      <i className="rs-quota__eye rs-quota__eye--r" />
                    </span>
                  )}

                  <span className="rs-quota__pac" ref={pacRef}>
                    <span className="rs-quota__jaw rs-quota__jaw--top" />
                    <span className="rs-quota__jaw rs-quota__jaw--bottom" />
                  </span>
                </div>
                <p className="rs-quota__note">
                  <strong>$36 额度</strong>敞开了吃 · 吃完再说
                </p>
              </div>
            </section>

            {/* 二维码展示区：纯白底、静态、超高对比度 */}
            <section className="rs-qr">
              <div className="rs-qr__frame">
                <img
                  src={withBase('/assets/image/wechat-qr.png')}
                  alt="微信二维码：加好友送 $36 Token"
                  className="rs-qr__img"
                />
              </div>
              <p className="rs-qr__title">随时聊，随便问。</p>
              <p className="rs-qr__sub">智能时代的困惑，不必独自想明白。</p>
            </section>
          </div>

          {/* 底部宣传语 */}
          <footer className="roadshow-footer">
            <span className="roadshow-footer__brand">36k.ai</span>
            <span className="roadshow-footer__sep" aria-hidden="true" />
            <span className="roadshow-footer__slogan">
              全网主流前沿大模型 · 让每个人都能用上好用又实惠的 AI
            </span>
          </footer>
        </main>
      )}
    </div>
  );
}
