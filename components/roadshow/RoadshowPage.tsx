import React, { useCallback, useEffect, useState } from 'react';
import { withBase } from '@rspress/core/runtime';
import LottieBackground from './LottieBackground';
import CuteMascot from './CuteMascot';

export default function RoadshowPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'poster'>('interactive');
  const [isHovered, setIsHovered] = useState(false);

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
          <span className="btn-icon">🔄</span>
          <span className="btn-text">
            {viewMode === 'interactive' ? '查看原版海报' : '切换大屏互动版'}
          </span>
        </button>

        <button
          type="button"
          className="roadshow-btn roadshow-btn--primary"
          onClick={toggleFullscreen}
        >
          <span className="btn-icon">{isFullscreen ? '🗗' : '⛶'}</span>
          <span className="btn-text">{isFullscreen ? '退出全屏' : '全屏展示 (F)'}</span>
        </button>

        <a
          href={withBase('/')}
          className="roadshow-btn roadshow-btn--home"
        >
          <span>首页</span>
        </a>
      </nav>

      {/* 模式一：原图海报全屏展示 */}
      {viewMode === 'poster' ? (
        <div className="poster-stage">
          <div className="poster-ambient-glow" aria-hidden="true" />
          <div className="poster-wrapper">
            <img
              src={withBase('/assets/image/36kai.png')}
              alt="加好友送$36 token"
              className="poster-img"
            />
          </div>
        </div>
      ) : (
        /* 模式二：展会大屏版（纯净聚焦：加好友送$36 token + 小字标注 + 二维码） */
        <main className="roadshow-stage">
          {/* 背景：抽象 Lottie 循环动画与深色网格 */}
          <div className="cyber-ambient" aria-hidden="true">
            <LottieBackground />
            <div className="cyber-grid" />
          </div>

          <div className="roadshow-content">
            {/* 核心文案区：巨幅视觉冲击标语与小字标注（不提具体模型名字） */}
            <section className="roadshow-left">
              <div className="hero-typography">
                <h1 className="hero-title-group">
                  <span className="hero-word hero-word--action">微信加好友</span>
                  <span className="hero-word hero-word--reward">
                    不废话直接送 <span className="gold-accent">$36</span> Token
                  </span>
                </h1>

                <div className="hero-note-pill">
                  <span className="pill-dot" aria-hidden="true" />
                  <span className="pill-text">手把手教你用起来</span>
                </div>
              </div>
            </section>

            {/* 二维码展示区：附带可爱跳动吉祥物与高对比度易扫二维码 */}
            <section className="roadshow-right">
              <div className="qr-card-container">
                {/* 页面可爱吉祥物跳动动画 */}
                <CuteMascot className="qr-mascot" />

                <div className="qr-hero-card">
                  {/* 四角高科技对焦框 */}
                  <div className="qr-corner qr-corner--tl" />
                  <div className="qr-corner qr-corner--tr" />
                  <div className="qr-corner qr-corner--bl" />
                  <div className="qr-corner qr-corner--br" />

                  {/* 二维码主体（纯净静态，无变形，超高对比度，秒扫） */}
                  <div className="qr-viewport">
                    <img
                      src={withBase('/assets/image/qr-36k.png')}
                      alt="加微信好友送$36 token"
                      className="qr-code-image"
                    />
                  </div>

                  <div className="qr-caption">
                    <span className="qr-caption-icon">📱</span>
                    <span className="qr-caption-text">微信扫一扫 · 立即添加好友</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
