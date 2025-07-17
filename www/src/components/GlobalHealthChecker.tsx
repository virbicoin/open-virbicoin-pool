"use client";

import { useEffect } from 'react';

// グローバル変数でヘルスチェック実行状態を管理
let hasPerformedGlobalHealthCheck = false;

interface PoolHealthData {
  pool: string;
  status: string;
  latency: number;
  error?: string;
}

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

        // Global health check - サーバーサイドでヘルスチェックを実行
        try {
          const globalStartTime = Date.now();
          const globalRes = await fetch('https://api.digitalregion.jp/api/global-health-check');
          const globalEndTime = Date.now();
          const globalLatency = globalEndTime - globalStartTime;
          
          if (globalRes.ok) {
            const globalData = await globalRes.json();
            console.log('[Health Check] Global Health (Fastest):', globalData.status);
            console.log('[Health Check] Global Hostname:', globalData.hostname);
            console.log('[Health Check] Global Latency:', `${globalLatency}ms`);
            console.log('[Health Check] Selected Pool:', globalData.selectedPool);
            
            const globalHealthTime = new Date(globalData.time);
            const formattedGlobalHealthTime = new Intl.DateTimeFormat(locale, {
              dateStyle: 'short',
              timeStyle: 'long',
              timeZone,
            }).format(globalHealthTime);
            console.log('[Health Check] Global Time:', formattedGlobalHealthTime);

            // 全プールの結果をログ出力
            if (globalData.pools) {
              globalData.pools.forEach((pool: PoolHealthData) => {
                console.log(`[Health Check] ${pool.pool}: ${pool.status} (${pool.latency}ms)${pool.error ? ` - ${pool.error}` : ''}`);
              });
            }
          } else {
            console.error('[Health Check] Global health check failed:', globalRes.status);
          }

        } catch (globalError) {
          console.error('[Health Check] Global health check failed:', globalError);
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
