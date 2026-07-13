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
      { text: '使用指南', link: '/docs/register/' },
      { text: 'Cresc AI 官网', link: 'https://www.cresc.dev' },
      { text: 'Cresc AI服务监控', link: 'https://check.linux.do/group/Cresc' }
    ],
    sidebar: {
      '/docs/': [
        {
          text: '快速开始',
          collapsible: false,
          items: [
            { text: '（1）注册账号', link: '/docs/register/1-register' },
            { text: '（2）登录账号', link: '/docs/register/2-login' },
            { text: '（3）购买额度', link: '/docs/register/3-quota' },
            { text: '（4）创建 API 令牌', link: '/docs/register/4-token' },
            { text: '（5）环境检查', link: '/docs/register/5-env' },
            { text: '（6）配置 CLI 工具', link: '/docs/register/6-cli' },
          ],
        },
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
        {
          text: 'CLI配置教程',
          collapsible: false,
          items: [
            { text: '环境检查（通用步骤）', link: '/docs/cli/1-env' },
            { text: 'Claude Code配置', link: '/docs/cli/2-claude' },
            { text: 'Codex配置', link: '/docs/cli/3-codex' },
            { text: 'Gemini配置', link: '/docs/cli/4-gemini' },
            { text: 'Grok Build配置', link: '/docs/cli/6-grok-build' },
          ],
        },
        {
          text: '额外配置',
          collapsible: false,
          items: [
            { text: 'CC缓存优化代理', link: '/docs/cli/5-cache-fix' },
          ],
        },
        {
          text: '绘图模型教程',
          collapsible: false,
          items: [
            { text: 'Banana2 Pro', link: '/docs/paint/Banana' },
            { text: 'GPT-Image-2', link: '/docs/paint/GPTImage' },
          ],
        },
        {
          text: '第三方接入',
          collapsible: false,
          items: [
            { text: 'Claude Desktop', link: '/docs/advanced/ClaudeDesktop' },
            { text: 'AionUi', link: '/docs/advanced/AionUI' },
            { text: 'OpenCode', link: '/docs/advanced/OpenCode' },
            { text: 'OpenClaw', link: '/docs/advanced/OpenClaw' },
            { text: 'Hermes', link: '/docs/advanced/Hermes' },
            { text: 'DS接入CC', link: '/docs/advanced/DeepSeekClaudeCode' },
            { text: 'GPT接入CC', link: '/docs/advanced/ChatGPTClaudeCode' },
          ],
        },
        {
          text: '常见问题',
          collapsible: false,
          items: [
            { text: 'Claude Code', link: '/docs/faq/CC' },
            { text: 'Codex', link: '/docs/faq/Codex' },
            { text: 'Gemini', link: '/docs/faq/Gemini' },
          ],
        },
        {
          text: '条款与政策',
          collapsible: false,
          items: [
            { text: '使用政策（AUP）', link: '/docs/tos/aup' },
            { text: '服务条款', link: '/docs/tos/TOS' },
            { text: '服务特定条款', link: '/docs/tos/service-specific-terms' },
            { text: '支持的国家和地区', link: '/docs/tos/use' },
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

