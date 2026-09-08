import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withBase } from '@rspress/core/runtime';
import LottieBackground from './LottieBackground';
const CAPABILITIES = [
  {
    id: 'code',
    name: '代码编程',
    desc: '智能开发助手',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'reasoning',
    name: '深度推理',
    desc: '复杂逻辑分析',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
        <line x1="9" y1="21" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    id: 'chat',
    name: '智能对话',
    desc: '多场景全能交互',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'fast',
    name: '极速稳定',
    desc: '高并发低延迟',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

export default function RoadshowPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'poster'>('interactive');
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const resetControlsTimer = () => {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', resetControlsTimer);
    window.addEventListener('touchstart', resetControlsTimer);

    resetControlsTimer();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', resetControlsTimer);
      window.removeEventListener('touchstart', resetControlsTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [toggleFullscreen]);

  return (
    <div
      className={`roadshow-container ${isFullscreen ? 'is-fullscreen' : ''} view-${viewMode}`}
      onDoubleClick={toggleFullscreen}
      title="双击或按 F 键切换全屏"
    >
      {/* 顶部悬浮控制栏（展示时不干扰，自动微淡化） */}
      <nav
        className={`roadshow-controls ${controlsVisible ? 'is-active' : 'is-dimmed'}`}
        aria-label="路演控制栏"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="roadshow-btn"
          onClick={() => setViewMode((m) => (m === 'interactive' ? 'poster' : 'interactive'))}
          title="切换互动大屏 / 原版海报视图 (快捷键 P)"
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
          title="全屏显示 (快捷键 F / 双击屏幕)"
        >
          <span className="btn-icon">{isFullscreen ? '🗗' : '⛶'}</span>
          <span className="btn-text">{isFullscreen ? '退出全屏' : '全屏展示 (F)'}</span>
        </button>

        <a
          href={withBase('/')}
          className="roadshow-btn roadshow-btn--home"
          title="返回主页"
        >
          <span>首页</span>
        </a>
      </nav>

      {/* 模式一：原图海报全屏展示（高清原样呈现，适合立牌竖屏或严格海报展示） */}
      {viewMode === 'poster' ? (
        <div className="poster-stage">
          <div className="poster-ambient-glow" aria-hidden="true" />
          <div className="poster-wrapper">
            <img
              src={withBase('/assets/image/36kai.png')}
              alt="加好友，送 $36 Token - 36k.ai 路演海报"
              className="poster-img"
            />
          </div>
          <div className="poster-tip">双击屏幕全屏 · 按 P 切换为大屏互动排版</div>
        </div>
      ) : (
        /* 模式二：展会大屏互动自适应版（横屏笔记本/平板完美填充，超高对比度，微动态吸睛） */
        <main className="roadshow-stage">
          {/* 背景：抽象 Lottie 循环动画与深色网格 */}
          <div className="cyber-ambient" aria-hidden="true">
            <LottieBackground />
            <div className="cyber-grid" />
          </div>

          <div className="roadshow-content">
            {/* 左侧区域：大标题促销信息、核心能力 */}
            <section className="roadshow-left">
              {/* 现场专属特惠指示胶囊 */}
              <div className="live-perk-badge">
                <span className="perk-dot" />
                <span className="perk-label">现场路演专属福利 · 扫码立即开通</span>
              </div>

              {/* 核心吸睛标语：加好友，送 $36 Token */}
              <div className="title-banner-group">
                <div className="brush-tag brush-tag--green">
                  <span className="brush-text">加好友，</span>
                </div>
                <div className="brush-tag brush-tag--pink">
                  <span className="brush-text">送 $36 Token</span>
                  <div className="shimmer-sweep" aria-hidden="true" />
                </div>
              </div>

              {/* 适用能力说明（不出现具体模型名字） */}
              <div className="model-subline">
                <span className="subline-dash" />
                <span className="subline-text">全网主流前沿大模型 · 自由调用 · 任意使用</span>
                <span className="subline-dash" />
              </div>

              {/* 4 大核心能力胶囊 */}
              <div className="models-strip">
                {CAPABILITIES.map((cap) => (
                  <div key={cap.id} className="model-pill">
                    <span className="model-icon">
                      {cap.icon}
                    </span>
                    <span className="model-name">{cap.name}</span>
                    <span className="model-desc">{cap.desc}</span>
                  </div>
                ))}
              </div>

              {/* 标语重点展示区（无机器人，大字号高对比度） */}
              <div className="callout-card">
                <div className="callout-spark" aria-hidden="true">⚡</div>
                <div className="callout-content">
                  <div className="callout-title">
                    <span className="callout-chalk">更强大的 AI，</span>
                    <span className="callout-chalk-sub">从这里开始！</span>
                  </div>
                  <p className="callout-desc">全网主流大模型一站式调用 · 快速直连 · 超高性价比</p>
                </div>
              </div>

              {/* 品牌与网址 */}
              <div className="brand-strip">
                <div className="brand-domain">
                  <span className="globe-icon">🌐</span>
                  <span className="domain-text">36k.ai</span>
                </div>
                <span className="brand-sep">/</span>
                <span className="brand-slogan">让 AI 更近一步</span>
              </div>
            </section>

            {/* 右侧区域：核心二维码展台（超高对比度，取景框微动，极易在远处被手机识别） */}
            <section className="roadshow-right">
              <div className="qr-hero-card">
                {/* 四角高科技对焦框 */}
                <div className="qr-corner qr-corner--tl" />
                <div className="qr-corner qr-corner--tr" />
                <div className="qr-corner qr-corner--bl" />
                <div className="qr-corner qr-corner--br" />

                {/* 二维码主体（纯净静态，无动画，超高对比度方便手机秒扫） */}
                <div className="qr-viewport">
                  <img
                    src={withBase('/assets/image/qr-36k.png')}
                    alt="微信扫码添加好友，领取 $36 Token"
                    className="qr-code-image"
                  />
                </div>

                {/* 扫码引导提示 */}
                <div className="qr-caption">
                  <div className="qr-caption-main">
                    <span className="qr-wechat-tag">微信扫码</span>
                    <span className="qr-action-text">直接领取 $36 体验金</span>
                  </div>
                  <div className="qr-caption-sub">
                    <span>随时聊 · 随便问 · 协助快速配置</span>
                  </div>
                </div>

                {/* 快捷特点标签 */}
                <div className="qr-footer-badges">
                  <span className="pill-check">✓ 即扫即送</span>
                  <span className="pill-check">✓ 全网通用</span>
                  <span className="pill-check">✓ 极速响应</span>
                </div>
              </div>
            </section>
          </div>

          {/* 屏幕底部微提示 */}
          <footer className="roadshow-bottom-tip">
            <span>双击或按 F 键全屏全景展示 · 适合展会/交流会现场投放</span>
          </footer>
        </main>
      )}
    </div>
  );
}
