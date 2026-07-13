# Grok Build配置

Grok Build 是 xAI 推出的终端编码助手。按照官方文档，它的主要配置文件是 `~/.grok/config.toml`，我们可以把模型请求接入 Cresc AI 的 OpenAI 兼容端点。

::: warning 不要把真实 Key 发给别人
下面示例里的 `xxx` 只是占位符。请用你在 Cresc AI 控制台创建的令牌替换它，不要在截图、聊天记录、公开仓库或工单里展示真实 API Key。
:::

## 安装 Grok Build


**Windows**

1. 打开 PowerShell，执行官方安装命令：
```powershell
irm https://x.ai/cli/install.ps1 | iex
```
2. 安装完成后，重新打开终端，执行以下命令确认可用：
```bash
grok --version
```


**MacOS / Linux / WSL**

1. 打开终端，执行官方安装命令：
```bash
curl -fsSL https://x.ai/cli/install.sh | bash
```
2. 安装完成后，重新打开终端，执行以下命令确认可用：
```bash
grok --version
```


## 配置 Cresc AI 网关


**Windows**

1. 键盘按下“Win+R”，输入以下路径后回车，打开 Grok Build 配置目录：
```bash
%userprofile%\.grok
```
2. 如果目录中没有 `config.toml`，请手动创建一个同名文件。

3. 将以下内容写入 `config.toml`：
```toml
[models]
default = "grok-4.5"
web_search = "grok-4.5"

[endpoints]
models_base_url = "https://www.cresc.dev/v1"

[model."grok-4.5"]
model = "grok-4.5"
name = "Grok 4.5"
description = "Grok 4.5 via Cresc AI"
api_key = "xxx"
api_backend = "responses"
context_window = 1000000
```
4. 回顾 [创建 API 令牌](/docs/register/4-token.md)，在 Cresc AI 中创建可用于 Grok / OpenAI 兼容接口的令牌，并将上方 `xxx` 替换为你的令牌。


**MacOS / Linux / WSL**

1. 在终端执行以下命令，创建 Grok Build 配置目录：
```bash
mkdir -p ~/.grok
```
2. 打开或创建配置文件：
```bash
nano ~/.grok/config.toml
```
3. 将以下内容写入 `config.toml`：
```toml
[models]
default = "grok-4.5"
web_search = "grok-4.5"

[endpoints]
models_base_url = "https://www.cresc.dev/v1"

[model."grok-4.5"]
model = "grok-4.5"
name = "Grok 4.5"
description = "Grok 4.5 via Cresc AI"
api_key = "xxx"
api_backend = "responses"
context_window = 1000000
```
4. 回顾 [创建 API 令牌](/docs/register/4-token.md)，在 Cresc AI 中创建可用于 Grok / OpenAI 兼容接口的令牌，并将上方 `xxx` 替换为你的令牌。


## 配置项说明

- `[models] default`：新会话默认使用的模型。
- `[models] web_search`：Grok Build 内置 web\_search 工具使用的模型。
- `[endpoints] models_base_url`：统一模型网关入口。这里填写 Cresc AI 的 OpenAI 兼容端点 `https://www.cresc.dev/v1`。
- `[model."grok-4.5"] api_key`：当前模型使用的 Cresc AI 令牌。直接写在配置文件时使用 `api_key`。
- `api_backend = "responses"`：Grok 4.5 按 xAI 示例使用 Responses API。

::: tip 也可以使用环境变量保存 Key
如果你不想把令牌直接写进 `config.toml`，可以把 `api_key = "xxx"` 改成：

```toml
env_key = "PACKY_API_KEY"
```

然后在系统环境变量中配置 `PACKY_API_KEY`。注意：`env_key` 填的是环境变量名，不是 API Key 本身。
:::

## 测试配置

1. 检查 Grok Build 是否读取到了配置文件：

```bash
grok inspect
```

2. 发送一次最小测试请求：

```bash
grok -p "只回复 ok" -m grok-4.5
```

如果输出类似下面内容，说明配置已经生效：

```text
ok
```

## 常见问题

### 把 Key 写到 `env_key` 后无法使用

`env_key` 只能填写环境变量名，例如 `PACKY_API_KEY`，不能填写真实 API Key。

如果你想直接把令牌写在配置文件里，请使用：

```toml
api_key = "xxx"
```

### 提示模型不存在或无权限

请检查以下几项：

1. Cresc AI 令牌分组是否支持你填写的模型。
2. `models_base_url` 是否填写为 `https://www.cresc.dev/v1`。
3. `model = "grok-4.5"` 是否和 Cresc AI 控制台模型名称一致。
4. API Key 是否复制完整，前后不要带多余空格。

### 想使用优化线路

如果你在控制台看到优化线路 Endpoint，也可以把网关地址改成：

```toml
[endpoints]
models_base_url = "https://api-slb.cresc.dev/v1"
```

配置方式和主站 Endpoint 完全一致。
