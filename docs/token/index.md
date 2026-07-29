# 模型广场

API Model Directory & Pricing

# 模型广场与实时费率

价格直接来自本站计费配置，实时同步。划线的 **$** 价是模型**原价**（官方参考价）， 下方 **¥** 价是按分组倍率折算后**实际扣费的人民币金额**，均为每百万 token。

-可用模型总数

-令牌分组

-最低计费倍率

-数据更新时间

🔍

选择分组：🌐 全部分组 (All Groups)

全部厂商Anthropic (Claude)OpenAI (GPT/Codex)Google (Gemini)国产大模型绘图 & 多模态

找到 **0** 个匹配的模型

📋 表格视图🎴 卡片视图

正在获取实时模型费率中...


## 令牌分组详细介绍

### ::ri:ai-generate-3d-fill:: Default分组

::: info 详情卡片

- **分组介绍：**
  - 一个默认的分组，没有对模型进行特定区分，一些测试模型，或无需分类的模型，以及其他一些乱七八糟的模型放在这个分组中，一般用不上，了解即可

> \[!important]
> **你要用CC或者Codex或者Gemini cli的话，这个分组与你无关，生成令牌的时候不要选这个分组！！！**

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - ×不支持

- **模型列表（实时查询）：**

  <ModelList group="default" />

:::

### ::skill-icons:aws-light:: ::material-icon-theme:claude:: Aws分组

::: info 详情卡片

- **分组介绍：**
  - 亚马逊AWS平台逆向的claude模型，相比AWS官渠，稍微便宜一些，但是稳定性稍微低一些。可用于Claude Code以及其他第三方平台

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="aws" />

:::

### ::skill-icons:aws-light:: ::material-icon-theme:claude:: Aws-officially分组

::: info 详情卡片

- **分组介绍：**
  - 从亚马逊AWS平台购买的正规Claude API。此模型与Claude官方模型分开部署，价格贵但稳定，适合兜底使用，仅了解即可

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="aws-officially" />

:::

### ::skill-icons:aws-light:: ::material-icon-theme:claude:: Aws-Q分组

::: info 详情卡片

- **分组介绍：**
  - 逆向Kiro的AWSQ的Claude模型，转换为API使用形式。此模型渠道特殊，使用了一系列手法，价格极其低廉。此分组模型相较于Claude官方的模型，上下文为200K，可进行思考，适合拿来日常使用，或做任务规划，翻译等。

> \[!important]
> **注意，此分组在ClaudeCode使用的时候容易出现422错误等问题，稳定性不如cc和Aws分组**

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="aws-q" />

:::

### ::devicon:azure:: ::hugeicons:chat-gpt:: Azure-officially分组

::: info 详情卡片

- **分组介绍：**
  - Azure官方渠道，提供GPT相关模型，可以使用在OpenCode等第三方工具中，也可以拿来聊天

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="azure-officially" />

:::

### ::simple-icons:alibabacloud:: Bailian分组

::: info 详情卡片

- **分组介绍：**
  - 阿里百炼官方版本渠道，此分组模型使用会按阶梯计价

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="bailian" />

:::

### ::material-icon-theme:claude:: CC分组

::: info 详情卡片

- **分组介绍：**
  - 使用Claude Code需要选择此分组！主要分组之一，专门用于Claude Code使用，不能接入任何第三方，如果触发Cresc AI的环境审查，会封停你的Cresc AI账号，并进入退款流程。这样做是因为有些人向Claude询问一些NSFW问题，会触发道德审查，导致账号被封且无法退款，为了号池稳定，请勿接入任何第三方

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - ×不支持

- **模型列表（实时查询）：**

  <ModelList group="cc" />

:::

### ::material-icon-theme:claude:: CC-azu-sale分组

::: info 详情卡片

- **分组介绍：**
  - 可用于第三方、Claude Code 的宝贝物品

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="cc-azu-sale" />

:::

### ::material-icon-theme:claude:: CC-expensive分组

::: info 详情卡片

- **分组介绍：**
  - 昂贵的 Claude Code 分组，可用于第三方

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="cc-expensive" />

:::

### ::material-icon-theme:claude:: CC-sale分组

::: info 详情卡片

- **分组介绍：**
  - 便宜的Claude Code分组，提供较为廉价的Claude模型，跟官渠效果差不多，可以接入OpenClaw等第三方使用（养龙虾）

> \[!important]
> **此分组缓存可能会有异常**

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="cc-sale" />

:::

### ::material-icon-theme:claude:: claude-officially分组

::: info 详情卡片

- **分组介绍：**
  - Claude 官方key渠道，价格基本对标官方价，适合应急使用

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="claude-officially" />

:::

### ::material-icon-theme:claude:: claude-sale分组

::: info 详情卡片

- **分组介绍：**
  - 逆向出来的Claude模型，贵一些，类似官渠，适合应急时候使用，仅支持Claude Code使用，不支持接入第三方

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - ×不支持

- **模型列表（实时查询）：**

  <ModelList group="claude-sale" />

:::

### ::hugeicons:chat-gpt:: Codex分组

::: info 详情卡片

- **分组介绍：**
  - 使用Codex需要选择此分组！主要分组之一，专门用于Codex使用，可以接入第三方使用。尽量还是在Codex中使用，因为这个分组的模型都是对编程特化的，用在其他方面可能效果并不理想

- **支持的CLI：**
  - Codex

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="codex" />

:::

### ::hugeicons:chat-gpt:: Codex-sale分组

::: info 详情卡片

- **分组介绍：**
  - Codex分组的优惠版本，价格更加廉价

- **支持的CLI：**
  - Codex

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="codex-sale" />

:::

### ::hugeicons:chat-gpt:: Cxtocc分组

::: info 详情卡片

- **分组介绍：**
  - 早期为将 codex 分组模型接入 Claude Code 做过兼容适配的分组。由于该方案稳定性和缓存表现不再符合推荐使用标准，仅保留给已有配置用户参考。

> \[!important]
> **此分组已不再建议使用。新用户请优先按照对应工具选择推荐分组：GPT 模型建议在 Codex 中使用，Claude 模型建议在 Claude Code 中使用。**

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - ×不支持

- **模型列表（实时查询）：**

  <ModelList group="cxtocc" />

:::

### ::simple-icons:deepseek:: DeepSeek-officially分组

::: info 详情卡片

- **分组介绍：**
  - DeepSeek官方渠道，提供DeepSeek相关模型

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="deepseek-officially" />

:::

### ::simple-icons:bytedance:: Doubao分组

::: info 详情卡片

- **分组介绍：**
  - 火山方舟官方渠道，比官方稍微廉价一些，提供豆包相关模型

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="doubao" />

:::

### ::vscode-icons:file-type-gemini:: Gemini分组

::: info 详情卡片

- **分组介绍：**
  - Gemini普通号池，适合一般场景使用，稳定性略差，较为经济的选择

- **支持的CLI：**
  - Gemini

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="gemini" />

:::

### ::vscode-icons:file-type-gemini:: Gemini-officially分组

::: info 详情卡片

- **分组介绍：**
  - 完全接的官方渠道的Gemini API，价格对标官方，适合企业用户

- **支持的CLI：**
  - Gemini Cli

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="gemini-officially" />

:::

### ::vscode-icons:file-type-gemini:: Gemini-slb分组

::: info 详情卡片

- **分组介绍：**
  - Gemini企业号池，更加稳定一些，不过价格稍贵，使用Gemini-3 一般接入这个分组的号池，体验很不错

- **支持的CLI：**
  - Gemini

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="gemini-slb" />

:::

### ::hugeicons:chat-gpt:: GPT-officially分组

::: info 详情卡片

- **分组介绍：**
  - 谨慎选择此分组！GPT官方ApiKey分发模型，适合特殊需要人群使用，普通用户不要选择这个分组，会快速扣额度

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="gpt-officially" />

:::

### ::material-symbols:image-outline:: Image分组

::: info 详情卡片

- **分组介绍：**
  - 官方稳定的Image绘图模型聚合分组，具体使用方法可参考「绘图模型教程」章节

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="image" />

:::

### ::simple-icons:xiaomi:: Mimo-officially分组

::: info 详情卡片

- **分组介绍：**
  - 小米MiMo官方版本渠道

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="mimo-officially" />

:::

### ::material-symbols:token:: Minimax-officially分组

::: info 详情卡片

- **分组介绍：**
  - minimax官方渠道，提供较为廉价的minimax模型

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="minimax-officially" />

:::

### ::simple-icons:perplexity:: Pplx分组

::: info 详情卡片

- **分组介绍：**
  - perplexity相关模型逆向，不做深入解释，了解即可

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="pplx" />

:::

### ::material-symbols:movie-outline:: Sora分组

::: info 详情卡片

- **分组介绍：**
  - Sora视频生成模型专用分组

- **支持的CLI：**
  - 无

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="sora" />

:::

### ::simple-icons:openaigym:: zai-officially分组

::: info 详情卡片

- **分组介绍：**
  - 智谱清言GLM官方渠道，适合接入Claude Code使用，或作为日常对话使用

- **支持的CLI：**
  - Claude Code

- **是否支持接入第三方：**
  - √支持

- **模型列表（实时查询）：**

  <ModelList group="zai-officially" />

:::
