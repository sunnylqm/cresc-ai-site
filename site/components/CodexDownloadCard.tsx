import React, { useState, useEffect } from 'react';

export default function CodexDownloadCard() {
  const VERSION_URL = 'https://cdn.xf233.io/project/Packy-docs/FAQ/Codex/version.txt';
  const BASE_URL = 'https://cdn.xf233.io/project/Packy-docs/FAQ/Codex/';

  const [version, setVersion] = useState('');
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parseVersionText = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    return {
      version: lines[0]?.trim() || '',
      fileName: lines[1]?.trim() || '',
      description: lines[2]?.trim() || '',
    };
  };

  const loadVersion = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(VERSION_URL, {
        cache: 'no-store',
        mode: 'cors',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error(`网络异常（${res.status}）`);
      const text = await res.text();
      const parsed = parseVersionText(text);
      if (!parsed.version || !parsed.fileName) {
        throw new Error('版本文件格式不正确');
      }
      setVersion(parsed.version);
      setFileName(parsed.fileName);
      setDescription(parsed.description);
    } catch (err: any) {
      setError(err?.message || '获取版本信息失败');
      setVersion('');
      setFileName('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVersion();
  }, []);

  const downloadUrl = fileName ? `${BASE_URL}${fileName}` : '';

  const handleDownload = () => {
    if (!downloadUrl) return;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="codex-download-card">
      <div className="codex-download-card__header">
        <div>
          <div className="codex-download-card__title">替换脚本下载</div>
          <p className="codex-download-card__desc">自动读取最新版本号与文件名，直接点击即可下载</p>
        </div>
        <span className={`codex-download-card__badge ${loading ? 'is-loading' : ''}`}>
          {loading ? '读取中…' : (version ? '支持的Codex插件版本 v' + version : '待获取')}
        </span>
      </div>

      {description && (
        <div className="codex-download-card__notice">
          {description}
        </div>
      )}

      <div className="codex-download-card__info">
        <div className="codex-download-card__row">
          <span className="codex-download-card__mono">
            {loading ? '文件名' : (fileName || '文件名')}
          </span>
          <button
            className="codex-download-card__btn"
            disabled={!downloadUrl || loading}
            onClick={handleDownload}
          >
            立即下载
          </button>
        </div>
      </div>

      {error && <p className="codex-download-card__error">获取失败：{error}</p>}
    </div>
  );
}
