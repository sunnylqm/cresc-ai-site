import * as path from 'path';
import { defineConfig } from '@rspress/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import rspressPluginMermaid from 'rspress-plugin-mermaid';

/**
 * 站点部署到的路径前缀。产物里的 JS/CSS 引用与路由链接都会带上它，
 * 所以部署到子路径（如 GitHub Pages 的 https://user.github.io/repo/）时必须设置，
 * 否则所有资源都会 404。
 *
 * 部署在域名根目录时留空即可；子路径部署时构建前设 DOC_BASE=/repo/。
 * CI 里由 .github/workflows/deploy.yml 自动推导，见该文件的 "Resolve base path" 步骤。
 *
 * 注意：不能用 rsbuild 的 output.assetPrefix: 'auto' 代替 —— SSG 阶段要在 Node 里执行
 * bundle，Rspack 的自动 publicPath 在非浏览器环境下会直接构建失败。
 */
const BASE = normalizeBase(process.env.DOC_BASE);

function normalizeBase(raw?: string): string {
  const value = (raw || '').trim();
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

export default defineConfig({
  base: BASE,
  llms: true,
  outDir: 'out',
  root: path.join(__dirname, 'pages'),
  title: '36k.ai',
  description: '提供 GPT、Claude、Kimi、DeepSeek、GLM 等模型的 Token 大幅折扣与技术支持服务。',
  icon: '/36k.svg',
  logoText: '36k.ai',
  themeConfig: {
    darkMode: true,
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/cresc-ai-site/cresc-ai-site' },
    ],
    nav: [
      { text: '首页', link: '/' },
      { text: '模型广场', link: '/docs/token/1-intro' },
      { text: 'CC-Switch使用', link: '/docs/ccswitch/1-common' },
      { text: '模型报价', link: 'https://ai.reactnative.cn/model-plaza' },
      { text: 'Cresc AI 官网', link: 'https://www.cresc.dev' }
    ],
    sidebar: {
      '/docs/': [
        {
          text: '模型分组介绍',
          collapsible: false,
          items: [
            { text: '模型广场', link: '/docs/token/1-intro' },
            { text: '令牌分组介绍', link: '/docs/token/2-group' },
          ],
        },
        {
          text: 'CC-Switch使用',
          collapsible: false,
          items: [
            { text: '通用步骤', link: '/docs/ccswitch/1-common' },
            { text: 'Claude Code配置', link: '/docs/ccswitch/2-claude' },
            { text: 'Codex配置', link: '/docs/ccswitch/3-codex' },
            { text: 'Gemini配置', link: '/docs/ccswitch/4-gemini' },
            { text: 'CC-Switch-CLI 使用', link: '/docs/ccswitch/5-ccs_cli' },
          ],
        },
      ],
    },
  },
  markdown: {
    link: {
      checkDeadLinks: false,
    },
    image: {
      checkDeadImages: false,
    },
  },
  builderConfig: {
    plugins: [pluginSass()],
  },
  plugins: [rspressPluginMermaid()],
});

