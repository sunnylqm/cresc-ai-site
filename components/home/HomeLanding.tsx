import React, { useState } from 'react';
import { Link } from '@rspress/core/runtime';
import { ThinkingPerson, ThoughtBubble, Signpost, questionIcons } from './illustrations';

interface Question {
  icon: keyof typeof questionIcons;
  title: string;
  lines: string[];
  link: string;
}

/**
 * 「大家都在问」的题库。每次展示 6 条，「换一批」在题库里向后滚动，
 * 所以新增问题只要往这里加，不用改组件。
 */
const QUESTIONS: Question[] = [
  {
    icon: 'coins',
    title: '大模型是怎么计费的？',
    lines: ['按 Token 计费，输入和输出分别算。不同模型价格', '差异很大，选对模型能省 50% 以上成本。'],
    link: '/docs/token/1-intro',
  },
  {
    icon: 'bolt',
    title: '什么是缓存率？能省多少钱？',
    lines: ['如果你重复问相似的问题，平台会自动缓存，', '命中后费用更低，通常可节省 30%–90%。'],
    link: '/docs/token/2-group',
  },
  {
    icon: 'media',
    title: '什么是多模态？',
    lines: ['不仅能处理文字，还能理解图片、音频、视频。', '比如：读图写报告、看视频做总结、识别发票等。'],
    link: '/docs/token/1-intro',
  },
  {
    icon: 'scale',
    title: '哪个模型最好？哪个性价比高？',
    lines: ['没有"最好"的模型，只有"最合适"的模型。', '我们帮你按场景、效果和成本，快速找到合适的选择。'],
    link: '/docs/token/1-intro',
  },
  {
    icon: 'briefcase',
    title: '我能用它做什么？',
    lines: ['写文案、做翻译、读财报、做数据分析、生成图片视频…', 'AI 已经能帮你完成很多实际工作，而且越来越便宜。'],
    link: '/docs/ccswitch/1-common',
  },
  {
    icon: 'person',
    title: '我需要学编程吗？会不会很难？',
    lines: ['不需要。我们提供简单易用的界面和技术支持，', '零基础也能快速上手。'],
    link: '/docs/ccswitch/1-common',
  },
  {
    icon: 'chat',
    title: '换模型要重写代码吗？',
    lines: ['不用。我们兼容 OpenAI 接口协议，', '改一个模型名就能切换，密钥和地址都不动。'],
    link: '/docs/ccswitch/2-claude',
  },
  {
    icon: 'shield',
    title: '我的数据安全吗？',
    lines: ['调用走加密通道，密钥可随时吊销、按分组限权，', '用量与费用全程可查。'],
    link: '/docs/token/2-group',
  },
  {
    icon: 'gauge',
    title: '会不会经常不可用？',
    lines: ['多渠道自动容灾，单家供应商抖动时自动切换，', '不用你手动改配置。'],
    link: '/docs/token/2-group',
  },
];

const PAGE_SIZE = 6;

function QuestionCard({ index, question }: { index: number; question: Question }) {
  const Icon = questionIcons[question.icon];
  return (
    <Link className="home-q" href={question.link}>
      <span className="home-q__no">{String(index + 1).padStart(2, '0')}</span>
      <span className="home-q__icon">
        <Icon />
      </span>
      <span className="home-q__body">
        <span className="home-q__title">{question.title}</span>
        {question.lines.map((line) => (
          <span className="home-q__line" key={line}>
            {line}
          </span>
        ))}
      </span>
      <span className="home-q__go" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

export default function HomeLanding() {
  const [offset, setOffset] = useState(0);

  const visible = Array.from(
    { length: PAGE_SIZE },
    (_, i) => QUESTIONS[(offset + i) % QUESTIONS.length],
  );

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">AI 很强大，但没那么复杂。</p>
          <h1 className="home-hero__title">
            看得懂，
            <br />
            用得上，省得多。
          </h1>
          <p className="home-hero__sub">
            用更低的成本，
            <br />
            让每个普通人和中小企业用上全球顶尖的 AI 模型。
          </p>
          <div className="home-hero__actions">
            <a className="home-btn" href="#faq">
              从一个问题开始
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
            <span className="home-hero__or">或</span>
            <a className="home-link" href="https://www.cresc.dev" target="_blank" rel="noreferrer">
              了解我们
            </a>
          </div>
        </div>

        <div className="home-hero__art">
          <ThoughtBubble>
            我也可以
            <br />
            用好 AI 吗？
          </ThoughtBubble>
          <p className="home-hero__note">
            当然，
            <br />
            从一个问题
            <br />
            开始
            <svg className="home-hero__note-line" viewBox="0 0 90 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 9C22 3 58 2 86 6" />
              <path d="M76 2l10 4-9 5" />
            </svg>
          </p>
          <ThinkingPerson className="home-hero__person" />
        </div>
      </section>

      <section className="home-faq" id="faq">
        <div className="home-faq__head">
          <div>
            <h2 className="home-h2">大家都在问</h2>
            <p className="home-faq__sub">用大白话，讲清楚 AI 里那些容易让人困惑的问题。</p>
          </div>
          <button
            className="home-shuffle"
            type="button"
            onClick={() => setOffset((v) => (v + PAGE_SIZE) % QUESTIONS.length)}
          >
            换一批
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 11a8 8 0 0 0-13.7-5.7L3 8.5M4 13a8 8 0 0 0 13.7 5.7L21 15.5" />
              <path d="M3 4v4.5h4.5M21 20v-4.5h-4.5" />
            </svg>
          </button>
        </div>

        <div className="home-faq__list">
          {visible.map((q, i) => (
            <QuestionCard key={q.title} index={i} question={q} />
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta__copy">
          <h2 className="home-h2">
            让好用的 AI
            <br />
            成为更多人的日常工具。
          </h2>
          <p className="home-cta__sub">更低的价格 · 专业的技术支持 · 真实可用的解决方案</p>
          <a className="home-btn" href="https://www.cresc.dev" target="_blank" rel="noreferrer">
            立即体验
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
        <div className="home-cta__art">
          <Signpost labels={['更高的效率', '更低的成本', '更多的可能']} />
          <p className="home-cta__note">
            AI 不是少数人的
            <br />
            特权，而是每个人
            <br />
            都可以用的工具。
          </p>
        </div>
      </section>

      <footer className="home-foot">
        <span className="home-foot__logo">Cresc AI</span>
        <span className="home-foot__divider" />
        <span className="home-foot__slogan">让每个人都能用上好用又实惠的 AI</span>
        <nav className="home-foot__nav">
          <a href="https://www.cresc.dev" target="_blank" rel="noreferrer">
            关于我们
          </a>
          <Link href="/docs/ccswitch/1-common">联系我们</Link>
        </nav>
      </footer>
    </div>
  );
}
