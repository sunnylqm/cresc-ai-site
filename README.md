# Cresc AI Documentation Site

Cresc AI 官方文档站，基于 [Rspress](https://rspress.dev/) 构建。

## 目录结构

- `pages/`：MDX 格式的文档页面，`pages/public/` 下的文件会原样拷进产物根目录
- `components/`：动态页面用的 React 组件
- `styles/`：样式表
- `rspress.config.ts`：站点配置

## 本地开发

```bash
bun install
bun run dev      # 开发服务器
bun run build    # 构建到 out/
bun run preview  # 预览构建产物
```

## 部署到子路径

产物里的 JS/CSS 引用和路由链接**在构建时就写死了**，所以站点部署在子路径下（例如
GitHub Pages 的 `https://<user>.github.io/<repo>/`）时，必须在构建前告诉它前缀，
否则所有资源都会 404、页面一片空白：

```bash
DOC_BASE=/cresc-ai-site/ bun run build
```

部署在域名根目录时不用设，默认就是 `/`。

`DOC_BASE` 前后的斜杠会自动补全，`repo`、`/repo`、`/repo/` 都能识别。

> 不能用 rsbuild 的 `output.assetPrefix: 'auto'` 来免配置：SSG 阶段要在 Node 里执行
> 打包产物，Rspack 的自动 publicPath 在非浏览器环境会直接报
> `Automatic publicPath is not supported in this browser` 导致构建失败。

### GitHub Actions 自动推导

`.github/workflows/gh-pages.yml` 的 `Resolve base path` 步骤会自己算出前缀，按以下优先级：

1. 仓库变量 `DOC_BASE`（Settings → Secrets and variables → Actions → Variables）——手动覆盖用
2. 存在 `pages/public/CNAME`（绑了自定义域名）→ `/`
3. 仓库名是 `<owner>.github.io`（用户/组织站点）→ `/`
4. 其余情况（项目站点）→ `/<repo>/`

所以把这个仓库 fork 或改名，或者换成自定义域名，都不需要再动配置。

### 其他平台

Cloudflare Pages、Vercel、Netlify 等在项目的构建环境变量里加 `DOC_BASE` 即可；
自建 nginx 反代到子路径同理，构建命令写成 `DOC_BASE=/your-path/ bun run build`。

### 组件里引用静态资源

Markdown 里的图片和内部链接（`![](/assets/...)`、`[](/docs/...)`）由 Rspress 自动加前缀，
不用管。但**手写在 React 组件里的绝对路径不会**，需要自己包一层：

```tsx
import { withBase } from '@rspress/core/runtime';

<img src={withBase('/assets/image/logo/qq.webp')} />
```
