import React, { useState, useEffect, useMemo } from 'react';

/**
 * 数据来自 sub2api-pricing-api（只读导出 sub2api 的模型定价与分组配置）：
 * https://github.com/sunnylqm/sub2api-pricing-api
 */
const PRICING_API = 'https://ai.cresc.dev/pricing-api/api/v1/pricing';

interface Price {
  input: number | null;
  output: number | null;
  cache_write: number | null;
  cache_write_1h?: number | null;
  cache_read: number | null;
}

interface ApiModel {
  name: string;
  platform: string;
  source: string;
  pricing_key?: string;
  list_price: Price | null;
  base_price: Price | null;
  actual_price: Price | null;
  actual_price_cny: Price | null;
  peak_price?: Price | null;
  rate_multiplier: number;
  discount_vs_list: number | null;
  channel_override: boolean;
  meta?: {
    max_input_tokens?: number;
    max_output_tokens?: number;
    mode?: string;
    provider?: string;
    supports_vision?: boolean;
    supports_reasoning?: boolean;
    supports_function_calling?: boolean;
    supports_prompt_caching?: boolean;
    deprecation_date?: string;
  };
}

interface ApiGroup {
  id: number;
  name: string;
  description: string;
  platform: string;
  subscription_type: string;
  rate_multiplier: number;
  discount_percent: number | null;
  is_exclusive: boolean;
  peak: { enabled: boolean; start: string; end: string; rate_multiplier: number };
  model_count: number;
  models: ApiModel[] | null;
}

interface ApiResponse {
  generated_at: string;
  currency: string;
  price_unit: string;
  /** 1 美元额度需要多少人民币，由接口按站点充值配置给出。 */
  exchange?: {
    cny_per_usd: number;
    balance_recharge_multiplier: number;
    recharge_fee_rate_percent: number;
    source: string;
  };
  groups: ApiGroup[];
}

type ProviderId = 'Anthropic' | 'OpenAI' | 'Google' | 'Domestic' | 'Multimodal' | 'Other';

const PROVIDER_TABS: { id: ProviderId | 'all'; name: string }[] = [
  { id: 'all', name: '全部厂商' },
  { id: 'Anthropic', name: 'Anthropic (Claude)' },
  { id: 'OpenAI', name: 'OpenAI (GPT/Codex)' },
  { id: 'Google', name: 'Google (Gemini)' },
  { id: 'Domestic', name: '国产大模型' },
  { id: 'Multimodal', name: '绘图 & 多模态' },
];

function detectProvider(name: string, metaProvider?: string): ProviderId {
  const lower = name.toLowerCase();
  if (lower.includes('image') || lower.includes('dall') || lower.includes('sora') || lower.includes('flux')) {
    return 'Multimodal';
  }
  if (lower.includes('claude')) return 'Anthropic';
  if (lower.includes('gpt') || lower.includes('codex') || /^o\d/.test(lower)) return 'OpenAI';
  if (lower.includes('gemini')) return 'Google';
  if (lower.includes('glm') || lower.includes('qwen') || lower.includes('deepseek') ||
      lower.includes('doubao') || lower.includes('kimi') || lower.includes('minimax')) {
    return 'Domestic';
  }
  switch ((metaProvider || '').toLowerCase()) {
    case 'anthropic': return 'Anthropic';
    case 'openai': case 'azure': return 'OpenAI';
    case 'gemini': case 'vertex_ai': return 'Google';
    default: return 'Other';
  }
}

/** 场景提示按模型名前缀猜，拿不准就不显示，避免写死过时信息。 */
function scenarioOf(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('image')) return '🎨 图像生成';
  if (lower.includes('opus')) return '🧠 最强推理 / 复杂工程';
  if (lower.includes('fable')) return '✍️ 长文写作与创意';
  if (lower.includes('sonnet')) return '💻 日常编程主力';
  if (lower.includes('haiku') || lower.includes('mini') || lower.includes('flash')) return '⚡ 轻量高速任务';
  if (lower.includes('codex')) return '💻 编程特化';
  if (lower.includes('realtime') || lower.includes('audio')) return '🎧 实时语音 / 音频';
  if (lower.startsWith('gpt')) return '🌐 通用旗舰模型';
  return '🤖 通用对话';
}

function formatContext(tokens?: number): string {
  if (!tokens) return '-';
  if (tokens >= 1_000_000) return `${Math.round(tokens / 100_000) / 10}M`;
  if (tokens >= 1000) return `${Math.round(tokens / 1000)}K`;
  return String(tokens);
}

/** 价格保留到有意义的位数：5、0.375、0.0625。 */
function formatAmount(v: number): string {
  const digits = v >= 1 ? 2 : v >= 0.01 ? 3 : 5;
  return String(Number(v.toFixed(digits)));
}

function formatUSD(v: number | null | undefined): string {
  if (v === null || v === undefined) return '-';
  return `$${formatAmount(v)}`;
}

function formatCNY(v: number | null | undefined): string {
  if (v === null || v === undefined) return '-';
  return `¥${formatAmount(v)}`;
}

function formatRate(rate: number): string {
  return `${Number(rate.toFixed(4))}x`;
}

/** 单元格：原价用美元划线，实际结算价用人民币强调。 */
function PriceCell({ list, actual, rate }: { list: number | null; actual: number | null; rate: number }) {
  if (actual === null && list === null) return <span className="p-price-na">-</span>;
  const actualClass =
    rate < 1 ? 'p-price-actual p-price-actual--down'
    : rate > 1 ? 'p-price-actual p-price-actual--up'
    : 'p-price-actual';
  return (
    <span className="p-price-cell">
      {list !== null && <span className="p-price-list">{formatUSD(list)}</span>}
      <span className={actualClass}>{formatCNY(actual)}</span>
    </span>
  );
}

interface Row extends ApiModel {
  groupId: number;
  groupName: string;
  provider: ProviderId;
  context: string;
  scenario: string;
  /** 「全部分组」视图下，该模型在所有分组里出现过的分组名。 */
  allGroups: { id: number; name: string; rate: number }[];
}

export default function ModelSquare() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<ProviderId | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(PRICING_API)
      .then((res) => {
        if (!res.ok) throw new Error(`请求定价接口失败 HTTP ${res.status}`);
        return res.json();
      })
      .then((json: ApiResponse) => {
        if (!alive) return;
        setData(json);
        setLoading(false);
      })
      .catch((err: any) => {
        if (!alive) return;
        setError(err?.message || '无法获取实时模型价格数据');
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  const groups = data?.groups || [];

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  /** 模型名 -> 出现过它的所有分组（用于「全部分组」视图的分组标签）。 */
  const groupsByModel = useMemo(() => {
    const map = new Map<string, { id: number; name: string; rate: number }[]>();
    for (const g of groups) {
      for (const m of g.models || []) {
        const key = m.name.toLowerCase();
        const list = map.get(key) || [];
        list.push({ id: g.id, name: g.name, rate: m.rate_multiplier });
        map.set(key, list);
      }
    }
    return map;
  }, [groups]);

  /**
   * 选中某个分组时按该分组展开；「全部分组」时同名模型只保留倍率最低（最便宜）的那条，
   * 避免同一个模型在列表里重复出现。
   */
  const rows = useMemo<Row[]>(() => {
    const source = selectedGroup === 'all' ? groups : groups.filter((g) => g.id === selectedGroup);
    const out: Row[] = [];
    const bestByName = new Map<string, number>();

    for (const g of source) {
      for (const m of g.models || []) {
        const key = m.name.toLowerCase();
        if (selectedGroup === 'all') {
          const existing = bestByName.get(key);
          if (existing !== undefined && out[existing].rate_multiplier <= m.rate_multiplier) continue;
          if (existing !== undefined) {
            out[existing] = buildRow(m, g, groupsByModel);
            continue;
          }
          bestByName.set(key, out.length);
        }
        out.push(buildRow(m, g, groupsByModel));
      }
    }
    return out;
  }, [groups, selectedGroup, groupsByModel]);

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((m) => {
      if (selectedProvider !== 'all' && m.provider !== selectedProvider) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.allGroups.some((g) => g.name.toLowerCase().includes(q))
      );
    });
  }, [rows, selectedProvider, searchQuery]);

  const exchange = data?.exchange;
  const totalModels = groupsByModel.size;
  const bestRate = groups.length ? Math.min(...groups.map((g) => g.rate_multiplier)) : null;
  const activeGroup = selectedGroup === 'all' ? null : groups.find((g) => g.id === selectedGroup) || null;
  const updatedAt = data?.generated_at
    ? new Date(data.generated_at).toLocaleString('zh-CN', { hour12: false })
    : '-';

  return (
    <div className="p-pricing-container">
      <div className="p-pricing-hero">
        <div className="p-pricing-hero__badge">API Model Directory & Pricing</div>
        <h1 className="p-pricing-hero__title">模型广场与实时费率</h1>
        <p className="p-pricing-hero__subtitle">
          价格直接来自本站计费配置，实时同步。划线的 <strong>$</strong> 价是模型<strong>原价</strong>（官方参考价），
          下方 <strong>¥</strong> 价是按分组倍率折算后<strong>实际扣费的人民币金额</strong>，均为每百万 token。
          {exchange && exchange.cny_per_usd !== 1 && ` 当前汇率：1 美元额度 = ¥${formatAmount(exchange.cny_per_usd)}。`}
        </p>

        <div className="p-pricing-stats">
          <div className="p-stat-box">
            <span className="p-stat-val">{totalModels || '-'}</span>
            <span className="p-stat-lbl">可用模型总数</span>
          </div>
          <div className="p-stat-box">
            <span className="p-stat-val">{groups.length || '-'}</span>
            <span className="p-stat-lbl">令牌分组</span>
          </div>
          <div className="p-stat-box">
            <span className="p-stat-val">{bestRate !== null ? formatRate(bestRate) : '-'}</span>
            <span className="p-stat-lbl">最低计费倍率</span>
          </div>
          <div className="p-stat-box">
            <span className="p-stat-val" style={{ fontSize: 15, lineHeight: 1.5 }}>{updatedAt}</span>
            <span className="p-stat-lbl">数据更新时间</span>
          </div>
        </div>
      </div>

      {/* 分组总览：直接展示分组配置与折扣 */}
      {groups.length > 0 && (
        <div className="p-group-overview">
          <div
            className={`p-group-card ${selectedGroup === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedGroup('all')}
          >
            <div className="p-group-card__name">🌐 全部分组</div>
            <div className="p-group-card__rate">{totalModels} 个模型</div>
            <div className="p-group-card__desc">同名模型按最低倍率展示</div>
          </div>
          {groups.map((g) => (
            <div
              key={g.id}
              className={`p-group-card ${selectedGroup === g.id ? 'active' : ''} ${g.rate_multiplier < 1 ? 'discount' : ''}`}
              onClick={() => setSelectedGroup(g.id)}
            >
              <div className="p-group-card__name">{g.name}</div>
              <div className="p-group-card__rate">
                <strong>{formatRate(g.rate_multiplier)}</strong>
                {g.discount_percent !== null && (
                  <span className="p-group-card__off">省 {Math.round(g.discount_percent)}%</span>
                )}
                {g.rate_multiplier > 1 && <span className="p-group-card__up">加价</span>}
              </div>
              <div className="p-group-card__desc">
                {g.description ? g.description.split('\n')[0] : `${g.platform} · ${g.model_count} 个模型`}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-filter-card">
        <div className="p-filter-top">
          <div className="p-search-wrapper">
            <span className="p-search-icon">🔍</span>
            <input
              type="text"
              className="p-search-input"
              placeholder="输入模型 ID 或关键词 (例如: claude-opus, gpt-5, image)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="p-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="p-group-select-wrapper">
            <span className="p-select-label">选择分组：</span>
            <select
              className="p-group-select"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value="all">🌐 全部分组 (All Groups)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}（倍率 {formatRate(g.rate_multiplier)}）
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeGroup && (
          <div className="p-active-group-banner">
            <div className="p-active-group-info">
              <span className="p-group-badge">{activeGroup.name}</span>
              <span className="p-group-tag">{activeGroup.platform}</span>
              <span className="p-group-ratio-highlight">
                当前分组计费倍率：<strong>{formatRate(activeGroup.rate_multiplier)}</strong>
                {activeGroup.discount_percent !== null && `（相当于 ${Math.round(activeGroup.discount_percent)}% 折扣）`}
              </span>
            </div>
            {activeGroup.description && <p className="p-group-desc">{activeGroup.description}</p>}
            {activeGroup.peak.enabled && (
              <p className="p-group-desc">
                ⏰ 高峰时段 {activeGroup.peak.start}–{activeGroup.peak.end} 按 {formatRate(activeGroup.peak.rate_multiplier)} 计费。
              </p>
            )}
          </div>
        )}

        <div className="p-provider-tabs">
          {PROVIDER_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`p-tab-btn ${selectedProvider === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedProvider(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-view-header">
          <div className="p-results-count">
            找到 <strong>{filteredModels.length}</strong> 个匹配的模型
          </div>
          <div className="p-view-toggle">
            <button
              className={`p-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 表格视图
            </button>
            <button
              className={`p-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              🎴 卡片视图
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-loading-box">
          <div className="p-spinner"></div>
          <p>正在获取实时模型费率中...</p>
        </div>
      ) : error ? (
        <div className="p-error-box">
          <p>⚠️ {error}</p>
          <button className="p-retry-btn" onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="p-empty-box">
          <div className="p-empty-icon">📂</div>
          <h3>未查找到匹配的模型</h3>
          <p>请尝试清理筛选条件或重新搜索。</p>
          <button
            className="p-reset-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedGroup('all');
              setSelectedProvider('all');
            }}
          >
            重置筛选条件
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="p-table-card">
          <table className="p-table">
            <thead>
              <tr>
                <th>模型 ID</th>
                <th>厂商</th>
                <th>上下文</th>
                <th>分组</th>
                <th>倍率</th>
                <th>输入 / 1M<span className="p-th-unit">原价 $ ／ 实付 ¥</span></th>
                <th>输出 / 1M<span className="p-th-unit">原价 $ ／ 实付 ¥</span></th>
                <th>缓存读 / 1M<span className="p-th-unit">原价 $ ／ 实付 ¥</span></th>
                <th style={{ textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((m) => {
                const isCopied = copiedId === m.name;
                return (
                  <tr key={`${m.groupId}-${m.name}`}>
                    <td className="p-name-cell">
                      <code className="p-model-id">{m.name}</code>
                      <div className="p-scenario-cell">{m.scenario}</div>
                    </td>
                    <td>
                      <span className={`p-provider-tag p-provider-${m.provider.toLowerCase()}`}>{m.provider}</span>
                    </td>
                    <td><span className="p-ctx-badge">{m.context}</span></td>
                    <td>
                      <div className="p-group-chips">
                        {m.allGroups.map((g) => (
                          <span
                            key={g.id}
                            className={`p-chip ${selectedGroup === g.id ? 'active' : ''}`}
                            onClick={() => setSelectedGroup(g.id)}
                            title={`点击筛选 ${g.name} 分组（倍率 ${formatRate(g.rate)}）`}
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`p-ratio-badge ${m.rate_multiplier < 1 ? 'discount' : ''}`}>
                        {formatRate(m.rate_multiplier)}
                      </span>
                    </td>
                    <td><PriceCell list={m.list_price?.input ?? null} actual={m.actual_price_cny?.input ?? null} rate={m.rate_multiplier} /></td>
                    <td><PriceCell list={m.list_price?.output ?? null} actual={m.actual_price_cny?.output ?? null} rate={m.rate_multiplier} /></td>
                    <td><PriceCell list={m.list_price?.cache_read ?? null} actual={m.actual_price_cny?.cache_read ?? null} rate={m.rate_multiplier} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className={`p-copy-btn ${isCopied ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(m.name)}
                      >
                        {isCopied ? '✓ 已复制' : '复制模型ID'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-grid">
          {filteredModels.map((m) => {
            const isCopied = copiedId === m.name;
            const isDiscount = m.rate_multiplier < 1;
            return (
              <div key={`${m.groupId}-${m.name}`} className={`p-card ${isDiscount ? 'p-card--discount' : ''}`}>
                <div className="p-card-header">
                  <span className={`p-provider-tag p-provider-${m.provider.toLowerCase()}`}>{m.provider}</span>
                  <button
                    className={`p-copy-btn ${isCopied ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(m.name)}
                  >
                    {isCopied ? '✓ 已复制' : '复制 ID'}
                  </button>
                </div>

                <h3 className="p-card-title">{m.name}</h3>
                <p className="p-card-desc">{m.scenario}</p>

                <div className="p-price-rows">
                  <div className="p-price-row">
                    <span className="p-price-label">输入 / 1M（$ → ¥）</span>
                    <PriceCell list={m.list_price?.input ?? null} actual={m.actual_price_cny?.input ?? null} rate={m.rate_multiplier} />
                  </div>
                  <div className="p-price-row">
                    <span className="p-price-label">输出 / 1M（$ → ¥）</span>
                    <PriceCell list={m.list_price?.output ?? null} actual={m.actual_price_cny?.output ?? null} rate={m.rate_multiplier} />
                  </div>
                  <div className="p-price-row">
                    <span className="p-price-label">缓存读 / 1M（$ → ¥）</span>
                    <PriceCell list={m.list_price?.cache_read ?? null} actual={m.actual_price_cny?.cache_read ?? null} rate={m.rate_multiplier} />
                  </div>
                </div>

                <div className="p-card-meta">
                  <div className="p-meta-box">
                    <span className="p-meta-title">上下文</span>
                    <span className="p-meta-val">{m.context}</span>
                  </div>
                  <div className="p-meta-box">
                    <span className="p-meta-title">计费倍率</span>
                    <span className={`p-meta-val ${isDiscount ? 'discount-text' : ''}`}>
                      {formatRate(m.rate_multiplier)}
                    </span>
                  </div>
                </div>

                <div className="p-card-groups">
                  <span className="p-groups-title">可用分组：</span>
                  <div className="p-group-chips">
                    {m.allGroups.map((g) => (
                      <span
                        key={g.id}
                        className={`p-chip ${selectedGroup === g.id ? 'active' : ''}`}
                        onClick={() => setSelectedGroup(g.id)}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && (
        <p className="p-pricing-footnote">
          价格均为每百万 token：<code>$</code> 为模型原价（官方参考价），<code>¥</code> 为本站实际扣费金额
          {exchange && `（按 1 美元额度 = ¥${formatAmount(exchange.cny_per_usd)} 折算，充值 1 元到账 ${formatAmount(exchange.balance_recharge_multiplier)} 美元额度）`}。
          缓存写入价与图片、视频等固定计费项请以控制台账单为准。
          数据由 <a href={PRICING_API} target="_blank" rel="noreferrer">公开定价接口</a> 提供，每 5 分钟同步一次。
          官方参考价缺失的模型（多为已下线的旧版本）原价显示为 “-”。
        </p>
      )}
    </div>
  );
}

function buildRow(
  m: ApiModel,
  g: ApiGroup,
  groupsByModel: Map<string, { id: number; name: string; rate: number }[]>,
): Row {
  return {
    ...m,
    groupId: g.id,
    groupName: g.name,
    provider: detectProvider(m.name, m.meta?.provider),
    context: formatContext(m.meta?.max_input_tokens),
    scenario: scenarioOf(m.name),
    allGroups: groupsByModel.get(m.name.toLowerCase()) || [{ id: g.id, name: g.name, rate: m.rate_multiplier }],
  };
}
