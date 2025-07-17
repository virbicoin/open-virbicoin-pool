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
        
        // Local health check (latency measurement)
        const localStartTime = Date.now();
        const localRes = await fetch('/health');
        const localEndTime = Date.now();
        const localLatency = localEndTime - localStartTime;
        
        const localData = await localRes.json();
        console.log('[Health Check] Local Health:', localData.status);
        console.log('[Health Check] Local Hostname:', localData.hostname);
        console.log('[Health Check] Local Latency:', `${localLatency}ms`);
        
        // 日時をブラウザロケール・タイムゾーンで表示
        const healthTime = new Date(localData.time);
        const formattedHealthTime = new Intl.DateTimeFormat(locale, {
          dateStyle: 'short',
          timeStyle: 'long',
          timeZone,
        }).format(healthTime);
        console.log('[Health Check] Local Time:', formattedHealthTime);

        // API health check (api.digitalregion.jp)
        try {
          const apiStartTime = Date.now();
          const apiRes = await fetch('https://api.digitalregion.jp/health');
          const apiEndTime = Date.now();
          const apiLatency = apiEndTime - apiStartTime;
          
          const apiData = await apiRes.json();
          console.log('[Health Check] API Health:', apiData.status);
          console.log('[Health Check] API Hostname:', apiData.hostname);
          console.log('[Health Check] API Latency:', `${apiLatency}ms`);
          
          const apiHealthTime = new Date(apiData.time);
          const formattedApiHealthTime = new Intl.DateTimeFormat(locale, {
            dateStyle: 'short',
            timeStyle: 'long',
            timeZone,
          }).format(apiHealthTime);
          console.log('[Health Check] API Time:', formattedApiHealthTime);
        } catch (apiError) {
          console.error('[Health Check] API health check failed:', apiError);
        }

      } catch (error) {
        console.error('[Health Check] Local health check failed:', error);
      }
    };
    
    fetchHealth();
  }, []);

  return null; // このコンポーネントは何もレンダリングしない
};

export default GlobalHealthChecker;
