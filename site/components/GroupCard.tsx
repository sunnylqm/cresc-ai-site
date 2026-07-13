import React, { useState, useEffect } from 'react';

// Shared state for pricing data to avoid duplicate requests
interface PricingItem {
  model_name: string;
  enable_groups: string[];
  supported_endpoint_types: string[];
  model_price?: number;
}

interface PricingData {
  data: PricingItem[];
  group_ratio?: Record<string, number>;
  usable_group?: Record<string, string>;
}

let cachedData: PricingData | null = null;
let cachedError: string = '';
let isFetching = false;
const listeners = new Set<() => void>();

const fetchPricing = async () => {
  if (cachedData || cachedError) return;
  if (isFetching) return;

  isFetching = true;
  const endpoint = 'https://www.cresc.dev/api/pricing';

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `请求失败：${res.status}`);
    }
    cachedData = await res.json();
  } catch (err: any) {
    cachedError = err?.message || '请求失败，请稍后重试';
  } finally {
    isFetching = false;
    listeners.forEach((l) => l());
  }
};

export function ModelList({ group }: { group: string }) {
  const [data, setData] = useState<PricingData | null>(cachedData);
  const [error, setError] = useState<string>(cachedError);
  const [loading, setLoading] = useState<boolean>(!cachedData && isFetching);

  useEffect(() => {
    const handleChange = () => {
      setData(cachedData);
      setError(cachedError);
      setLoading(false);
    };

    listeners.add(handleChange);

    if (!cachedData && !cachedError && !isFetching) {
      setLoading(true);
      fetchPricing();
    }

    return () => {
      listeners.delete(handleChange);
    };
  }, [group]);

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  if (loading || !data) {
    return <div className="spinner" aria-hidden="true"></div>;
  }

  const models = (data.data || []).filter((item) => (item.enable_groups || []).includes(group));
  const groupRatio = data.group_ratio?.[group];
  const groupDesc = data.usable_group?.[group] || '';

  if (!models.length) {
    return <div className="empty">暂无模型数据</div>;
  }

  return (
    <div className="model-grid">
      {models.map((item) => (
        <div className="model-item" key={item.model_name}>
          <div className="model-item__header">
            <div className="model-id">{item.model_name}</div>
            <div className="endpoint-count">{(item.supported_endpoint_types || []).length} endpoints</div>
          </div>
          <div className="endpoint-tags">
            {(item.supported_endpoint_types || []).map((ep) => (
              <span className="endpoint-tag" key={`${item.model_name}-${ep}`}>{ep}</span>
            ))}
          </div>
          <div className="meta">
            <span className="meta-chip">分组倍率：{groupRatio ?? '—'}</span>
            {item.model_price != null && (
              <span className="meta-chip">模型单价：{item.model_price}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GroupCard({
  group,
  description = '',
  cli = [],
  thirdParty = false,
  warning = ''
}: {
  group: string;
  description?: string;
  cli?: string[];
  thirdParty?: boolean;
  warning?: string;
}) {
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [data, setData] = useState<PricingData | null>(cachedData);

  useEffect(() => {
    const handleChange = () => {
      setData(cachedData);
    };
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  useEffect(() => {
    if (data) {
      const models = (data.data || []).filter((item) => (item.enable_groups || []).includes(group));
      setIsUnavailable(models.length === 0);
    }
  }, [data, group]);

  const groupDesc = data?.usable_group?.[group] || '';

  return (
    <div className={`group-card ${isUnavailable ? 'unavailable' : ''}`}>
      {isUnavailable && <div className="unavailable-ribbon">渠道已下架</div>}
      
      {/* 分组介绍 */}
      <div className="group-card__desc">
        <div className="group-card__desc-bar"></div>
        <div className="group-card__desc-body">
          <div className="group-card__desc-label">分组介绍</div>
          <div className="group-card__desc-text">{description}</div>
        </div>
      </div>

      {/* 警告 */}
      {warning && (
        <div className="group-card__warning">
          <span className="group-card__warning-icon">⚠️</span>
          <span>{warning}</span>
        </div>
      )}

      {/* 摘要栏：CLI + 第三方 */}
      <div className="group-card__summary">
        <div className="group-card__summary-item">
          <span className="group-card__summary-label">CLI</span>
          {cli.length ? (
            <div className="group-card__tag-chips">
              {cli.map((c) => <span className="group-card__cli-chip" key={c}>{c}</span>)}
            </div>
          ) : (
            <span className="group-card__summary-value group-card__summary-value--muted">不支持</span>
          )}
        </div>
        <div className="group-card__summary-divider"></div>
        <div className="group-card__summary-item">
          <span className="group-card__summary-label">第三方接入</span>
          <span className={`group-card__summary-badge ${thirdParty ? 'group-card__summary-badge--yes' : 'group-card__summary-badge--no'}`}>
            {thirdParty ? '✓ 支持' : '✗ 不支持'}
          </span>
        </div>
      </div>

      {/* 模型列表 */}
      <div className="group-card__models">
        <div className="model-card">
          <div className="model-card__header">
            <div className="model-card__title-row">
              <div className="model-card__title">模型列表 · {group}</div>
              <div className="model-card__subtitle">{groupDesc || '实时查询展示该分组可用模型'}</div>
            </div>
          </div>
          <ModelList group={group} />
        </div>
      </div>
    </div>
  );
}
