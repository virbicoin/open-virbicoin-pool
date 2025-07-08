"use client";

import { useEffect } from 'react';

// グローバル変数でヘルスチェック実行状態を管理
let hasPerformedGlobalHealthCheck = false;

const GlobalHealthChecker: React.FC = () => {
  useEffect(() => {
    // グローバル変数で重複実行を防ぐ
    if (hasPerformedGlobalHealthCheck) {
      return; // ログも出力しない（完全にサイレント）
    }
    
    hasPerformedGlobalHealthCheck = true;

    const fetchHealth = async () => {
      try {
        // ブラウザのロケールとタイムゾーンを取得
        const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
        const timeZone = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
        
        const res = await fetch('/health');
        const data = await res.json();
        console.log('[Helth Check] Health:', data.status);
        console.log('[Helth Check] Hostname:', data.hostname);
        // 日時をブラウザロケール・タイムゾーンで表示
        const healthTime = new Date(data.time);
        const formattedHealthTime = new Intl.DateTimeFormat(locale, {
          dateStyle: 'short',
          timeStyle: 'long',
          timeZone,
        }).format(healthTime);
        console.log('[Helth Check] Time:', formattedHealthTime);
      } catch (error) {
        console.error('[Helth Check] failed:', error);
      }
    };
    
    fetchHealth();
  }, []);

  return null; // このコンポーネントは何もレンダリングしない
};

export default GlobalHealthChecker;
