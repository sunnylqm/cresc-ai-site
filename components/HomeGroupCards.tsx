import React, { useState } from 'react';

export default function HomeGroupCards() {
  const [activeCard, setActiveCard] = useState('');
  const [noticeText, setNoticeText] = useState('');

  const copyQQ = async (num: string, cardKey: string) => {
    const text = String(num);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('clipboard unsupported');
      }
    } catch (error) {
      if (typeof document !== 'undefined') {
        const input = document.createElement('textarea');
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
    } finally {
      setNoticeText('已复制群号');
      setActiveCard(cardKey);
      setTimeout(() => {
        setActiveCard('');
        setNoticeText('');
      }, 2400);
    }
  };

  return (
    <div>
      <div className="qq-groups">
        <div
          className="qq-card blue-card"
          role="button"
          tabIndex={0}
          aria-label="复制售后QQ群六"
          onClick={() => copyQQ('187976588', 'qq6')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              copyQQ('187976588', 'qq6');
            }
          }}
        >
          <div className="card-bg"></div>
          <div className="card-content">
            <div className="logo-wrapper">
              <img
                className="qq-logo"
                src="/assets/image/logo/qq.webp"
                alt="售后QQ群六"
              />
              <div className="logo-glow"></div>
            </div>
            <div className="qq-meta">
              <p className="qq-label">售后QQ群六</p>
              <p className="qq-number">187976588</p>
            </div>
            <div className="card-shine"></div>
          </div>
          {activeCard === 'qq6' && (
            <div className="inline-notice">
              <span className="notice-pill">{noticeText}</span>
            </div>
          )}
        </div>
      </div>

      <div className="notice-card">
        <div className="notice-icon-wrapper">
          <svg className="notice-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="notice-content">
          <p className="notice-text">仔细看教程，一步步按照教程的指导走，配置跟使用基本不会出现问题。</p>
          <p className="notice-text">如果你跟着文档步骤出现问题，请你截图你目前在文档中所到的步骤跟报错信息到QQ群，客服看见就会解答。</p>
        </div>
      </div>
    </div>
  );
}
