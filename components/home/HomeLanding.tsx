import React, { useEffect, useRef, useState } from 'react';
import { withBase } from '@rspress/core/runtime';

const PRICING_URL = 'https://ai.reactnative.cn/model-plaza';

/**
 * 首页背景的「问题墙」：取自名片背面，字号/字重/深浅拉开层次，
 * 分三行做反向滚动。纯装饰，aria-hidden，鼠标悬停暂停。
 */
const QUESTION_ROWS: { text: string; size: 'lg' | 'md' | 'sm' }[][] = [
  [
    { text: '什么是大模型？', size: 'lg' },
    { text: 'AI 会替代我的工作吗？', size: 'md' },
    { text: '从哪里开始？', size: 'sm' },
    { text: '我能拿它做什么？', size: 'lg' },
    { text: '数据会泄露吗？', size: 'sm' },
    { text: '我需要学编程吗？', size: 'md' },
  ],
  [
    { text: '哪个模型最好？', size: 'lg' },
    { text: '值不值得付费？', size: 'sm' },
    { text: '我适合用 GPT 还是 Claude？', size: 'md' },
    { text: '哪个模型性价比高？', size: 'lg' },
    { text: '公司怎么落地 AI？', size: 'md' },
    { text: 'DeepSeek 和 Kimi 怎么选？', size: 'sm' },
  ],
  [
    { text: '小公司也用得起吗？', size: 'sm' },
    { text: 'AI 能帮我赚钱或省钱吗？', size: 'md' },
    { text: '学什么才能不失业？', size: 'lg' },
    { text: '我该先学提示词还是工作流？', size: 'sm' },
    { text: '普通人现在上车还来得及吗？', size: 'md' },
  ],
];

function QuestionWall() {
  return (
    <div className="wall" aria-hidden="true">
      {QUESTION_ROWS.map((row, i) => (
        <div className={`wall__row wall__row--${i % 2 === 0 ? 'ltr' : 'rtl'}`} key={i}>
          {/* 复制一份才能首尾相接地无缝循环 */}
          {[0, 1].map((copy) => (
            <div className="wall__track" key={copy}>
              {row.map((q) => (
                <span className={`wall__q wall__q--${q.size}`} key={q.text}>
                  {q.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function WechatChoice() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      className={`choice choice--ask${open ? ' is-open' : ''}`}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="choice__hit"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="choice__label">我有挺多不明白的，想从头问个明白</span>
        <span className="choice__hint">扫码加微信 · 随时聊，随便问</span>
      </button>

      <div className="qr" role="dialog" aria-label="微信二维码">
        <img className="qr__img" src={withBase('/assets/image/wechat-qr.png')} alt="微信二维码" />
        <p className="qr__title">随时聊，随便问。</p>
        <p className="qr__sub">智能时代的困惑，不必独自想明白。</p>
      </div>
    </div>
  );
}

export default function HomeLanding() {
  return (
    <div className="home">
      <QuestionWall />

      <main className="home__inner">
        <h1 className="mark">36k.ai</h1>
        <p className="tagline">
          提供 GPT、Claude、Kimi、DeepSeek、GLM 等模型的
          <br />
          Token 大幅折扣与技术支持服务
        </p>

        <div className="choices">
          <a className="choice choice--price" href={PRICING_URL} target="_blank" rel="noreferrer">
            <span className="choice__hit">
              <span className="choice__label">直接看模型报价</span>
              <span className="choice__hint">已经知道要什么 · 打开模型广场</span>
            </span>
            <span className="choice__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>

          <WechatChoice />
        </div>
      </main>

      <footer className="home__foot">
        <span>36k.ai</span>
        <span className="home__foot-sep" />
        <span>让每个人都能用上好用又实惠的 AI</span>
      </footer>
    </div>
  );
}
