import * as path from 'path';
import { defineConfig } from '@rspress/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import rspressPluginMermaid from 'rspress-plugin-mermaid';

export default defineConfig({
  llms: true,
  outDir: 'out',
  root: path.join(__dirname, 'pages'),
  title: 'Cresc AI 使用文档',
  description: 'Cresc AI 官方文档，提供最稳定、最便捷的 AI 模型中转服务。',
  icon: '/logo.webp',
  logo: {
    light: '/logo.webp',
    dark: '/logo.webp',
  },
  logoText: 'Cresc AI',
  themeConfig: {
    darkMode: true,
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/cresc-ai-site/cresc-ai-site' },
    ],
    nav: [
      { text: '首页', link: '/' },
      { text: '模型广场', link: '/docs/token/1-intro' },
      { text: 'CC-Switch使用', link: '/docs/ccswitch/1-common' },
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

