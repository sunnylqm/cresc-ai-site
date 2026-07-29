import React, { useState, useEffect, useMemo } from 'react';
import { VENDOR_ICONS } from './vendorIcons';

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
  list_price: Price | null;
  actual_price_cny: Price | null;
  rate_multiplier: number;
  meta?: {
    max_input_tokens?: number;
    provider?: string;
  };
}

interface ApiGroup {
  id: number;
  name: string;
  rate_multiplier: number;
  models: ApiModel[] | null;
}

interface ApiResponse {
  generated_at: string;
  exchange?: { cny_per_usd: number };
  groups: ApiGroup[];
}

/**
 * 厂商识别规则，按顺序匹配模型名（小写）。
 * 国产模型不再笼统归为「国产」，各家单列，图标取自 vendorIcons。
 */
const VENDORS: { id: string; label: string; match: (name: string) => boolean }[] = [
  { id: 'Anthropic', label: 'Anthropic', match: (n) => n.includes('claude') },
  {
    id: 'OpenAI',
    label: 'OpenAI',
    match: (n) => n.startsWith('gpt') || n.includes('codex') || n.includes('sora') || n.includes('dall') || /^o\d/.test(n),
  },
  { id: 'Google', label: 'Google', match: (n) => n.includes('gemini') || n.includes('imagen') },
  { id: 'Zhipu', label: '智谱 GLM', match: (n) => n.startsWith('glm') || n.includes('zhipu') || n.includes('cogview') },
  { id: 'DeepSeek', label: 'DeepSeek', match: (n) => n.includes('deepseek') },
  { id: 'Qwen', label: '阿里通义', match: (n) => n.includes('qwen') || n.includes('qwq') || n.includes('wanx') },
  { id: 'Doubao', label: '字节豆包', match: (n) => n.includes('doubao') || n.includes('seedream') || n.includes('seedance') },
  { id: 'Moonshot', label: '月之暗面', match: (n) => n.includes('kimi') || n.includes('moonshot') },
  { id: 'MiniMax', label: 'MiniMax', match: (n) => n.includes('minimax') || n.includes('abab') },
  { id: 'xAI', label: 'xAI Grok', match: (n) => n.includes('grok') },
];

const VENDOR_LABELS: Record<string, string> = Object.fromEntries(
  VENDORS.map((v) => [v.id, v.label]).concat([['Other', '其他']]),
);

function detectVendor(name: string): string {
  const lower = name.toLowerCase();
  return VENDORS.find((v) => v.match(lower))?.id ?? 'Other';
}

/**
 * 把带日期版本的模型名归一到不带日期的版本：
 *   claude-opus-4-5-20251101 -> claude-opus-4-5
 *   gpt-5.4-2026-03-05       -> gpt-5.4
 */
function stripDateSuffix(name: string): string {
  return name.replace(/-\d{4}-\d{2}-\d{2}$/, '').replace(/-\d{8}$/, '');
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

const formatUSD = (v?: number | null) => (v === null || v === undefined ? '-' : `$${formatAmount(v)}`);
const formatCNY = (v?: number | null) => (v === null || v === undefined ? '-' : `¥${formatAmount(v)}`);

/** 单元格：原价用美元划线，实付价用人民币强调。 */
function PriceCell({ list, actual, rate }: { list?: number | null; actual?: number | null; rate: number }) {
  if (actual == null && list == null) return <span className="p-price-na">-</span>;
  const tone = rate < 1 ? ' p-price-actual--down' : rate > 1 ? ' p-price-actual--up' : '';
  return (
    <span className="p-price-cell">
      {list != null && <span className="p-price-list">{formatUSD(list)}</span>}
      <span className={`p-price-actual${tone}`}>{formatCNY(actual)}</span>
    </span>
  );
}

function VendorLogo({ vendor }: { vendor: string }) {
  const Icon = VENDOR_ICONS[vendor];
  if (!Icon) {
    return <span className="p-vendor-logo p-vendor-logo--fallback">{VENDOR_LABELS[vendor]?.[0] ?? '?'}</span>;
  }
  return (
    <span className="p-vendor-logo">
      <Icon />
    </span>
  );
}

interface Row {
  /** 归一化后的展示名（不带日期） */
  name: string;
  vendor: string;
  context: string;
  rate: number;
  list: Price | null;
  actual: Price | null;
  groupId: number;
  /** 排序用：实付价，取输入价，缺失时退回输出价 */
  sortPrice: number;
}

/** 只要输入或输出有价就算有价；两者都没有的模型不展示。 */
function hasPrice(m: ApiModel): boolean {
  const p = m.actual_price_cny;
  return !!p && (p.input != null || p.output != null);
}

export default function ModelSquare() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

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

  // 被 iframe 引用（或显式带 ?embed=1）时，隐藏站点导航、侧边栏与页脚，只留模型列表。
  useEffect(() => {
    const embedded =
      window.self !== window.top || new URLSearchParams(window.location.search).get('embed') === '1';
    if (!embedded) return;
    document.documentElement.classList.add('p-embed');
    return () => document.documentElement.classList.remove('p-embed');
  }, []);

  const groups = data?.groups || [];

  /**
   * 归一化 -> 去重 -> 过滤无价 -> 按价格从高到低排序。
   *
   * 选中分组时只看该分组；「全部分组」时同名模型只保留最便宜的那条。
   * 带日期的版本会先归一到不带日期的名字再参与去重，避免同一个模型出现多行。
   */
  const rows = useMemo<Row[]>(() => {
    const source = selectedGroup === 'all' ? groups : groups.filter((g) => g.id === selectedGroup);
    const byName = new Map<string, Row>();

    for (const g of source) {
      for (const m of g.models || []) {
        if (!hasPrice(m)) continue;
        const name = stripDateSuffix(m.name);
        const key = name.toLowerCase();
        const actual = m.actual_price_cny;
        const sortPrice = actual?.input ?? actual?.output ?? 0;
        const row: Row = {
          name,
          vendor: detectVendor(name),
          context: formatContext(m.meta?.max_input_tokens),
          rate: m.rate_multiplier,
          list: m.list_price,
          actual,
          groupId: g.id,
          sortPrice,
        };
        const prev = byName.get(key);
        // 同名保留更便宜的一条；价格相同则保留上下文信息更全的那条
        if (!prev || sortPrice < prev.sortPrice || (sortPrice === prev.sortPrice && prev.context === '-')) {
          byName.set(key, row);
        }
      }
    }

    return [...byName.values()].sort(
      (a, b) =>
        b.sortPrice - a.sortPrice ||
        (b.actual?.output ?? 0) - (a.actual?.output ?? 0) ||
        a.name.localeCompare(b.name),
    );
  }, [groups, selectedGroup]);

  /** 厂商筛选项按数据里实际出现的厂商生成，避免出现空标签。 */
  const vendorTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) counts.set(r.vendor, (counts.get(r.vendor) ?? 0) + 1);
    const order = [...VENDORS.map((v) => v.id), 'Other'];
    return order.filter((id) => counts.has(id)).map((id) => ({ id, label: VENDOR_LABELS[id] }));
  }, [rows]);

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((r) => {
      if (selectedVendor !== 'all' && r.vendor !== selectedVendor) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || (VENDOR_LABELS[r.vendor] ?? '').toLowerCase().includes(q);
    });
  }, [rows, selectedVendor, searchQuery]);

  const updatedAt = data?.generated_at
    ? new Date(data.generated_at).toLocaleString('zh-CN', { hour12: false })
    : '';

  return (
    <div className="p-pricing-container">
      <div className="p-pricing-intro">
        划线的 <strong>$</strong> 为模型原价，其后 <strong>¥</strong> 为本站实付价，均按每百万 token 计。
        {updatedAt && <span className="p-pricing-intro__time">更新于 {updatedAt}</span>}
      </div>

      <div className="p-filter-card">
        <div className="p-filter-top">
          <div className="p-search-wrapper">
            <span className="p-search-icon">🔍</span>
            <input
              type="text"
              className="p-search-input"
              placeholder="搜索模型 ID 或厂商，例如 claude-opus、gpt-5、GLM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="p-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="p-group-select-wrapper">
            <span className="p-select-label">分组：</span>
            <select
              className="p-group-select"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value="all">全部分组</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-provider-tabs">
          <button
            className={`p-tab-btn ${selectedVendor === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedVendor('all')}
          >
            全部厂商
          </button>
          {vendorTabs.map((tab) => (
            <button
              key={tab.id}
              className={`p-tab-btn ${selectedVendor === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedVendor(tab.id)}
            >
              <VendorLogo vendor={tab.id} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-view-header">
          <div className="p-results-count">
            共 <strong>{filteredModels.length}</strong> 个模型
          </div>
          <div className="p-view-toggle">
            <button
              className={`p-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              卡片
            </button>
            <button
              className={`p-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              表格
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
          <button
            className="p-reset-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedGroup('all');
              setSelectedVendor('all');
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
                <th>输入 / 1M</th>
                <th>输出 / 1M</th>
                <th>缓存读 / 1M</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((m) => (
                <tr key={`${m.groupId}-${m.name}`}>
                  <td className="p-name-cell"><code className="p-model-id">{m.name}</code></td>
                  <td>
                    <span className="p-vendor-cell">
                      <VendorLogo vendor={m.vendor} />
                      {VENDOR_LABELS[m.vendor]}
                    </span>
                  </td>
                  <td><span className="p-ctx-badge">{m.context}</span></td>
                  <td><PriceCell list={m.list?.input} actual={m.actual?.input} rate={m.rate} /></td>
                  <td><PriceCell list={m.list?.output} actual={m.actual?.output} rate={m.rate} /></td>
                  <td><PriceCell list={m.list?.cache_read} actual={m.actual?.cache_read} rate={m.rate} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-grid">
          {filteredModels.map((m) => (
            <div key={`${m.groupId}-${m.name}`} className={`p-card ${m.rate < 1 ? 'p-card--discount' : ''}`}>
              <div className="p-card-header">
                <span className="p-vendor-cell">
                  <VendorLogo vendor={m.vendor} />
                  {VENDOR_LABELS[m.vendor]}
                </span>
                <span className="p-ctx-badge">{m.context}</span>
              </div>

              <h3 className="p-card-title">{m.name}</h3>

              <div className="p-price-rows">
                <div className="p-price-row">
                  <span className="p-price-label">输入 / 1M</span>
                  <PriceCell list={m.list?.input} actual={m.actual?.input} rate={m.rate} />
                </div>
                <div className="p-price-row">
                  <span className="p-price-label">输出 / 1M</span>
                  <PriceCell list={m.list?.output} actual={m.actual?.output} rate={m.rate} />
                </div>
                <div className="p-price-row">
                  <span className="p-price-label">缓存读 / 1M</span>
                  <PriceCell list={m.list?.cache_read} actual={m.actual?.cache_read} rate={m.rate} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
