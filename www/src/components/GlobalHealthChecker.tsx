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

        // Global health check - 5つのプールの中で最速のものを選択
        try {
          const pools = [
            'https://pool1.digitalregion.jp/health',
            'https://pool2.digitalregion.jp/health',
            'https://pool3.digitalregion.jp/health',
            'https://pool4.digitalregion.jp/health',
            'https://pool5.digitalregion.jp/health'
          ];

          const poolHealthPromises = pools.map(async (poolUrl, index) => {
            const poolStartTime = Date.now();
            try {
              const response = await fetch(poolUrl, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'Virbicoin-Pool-GlobalHealth/1.0'
                },
                signal: AbortSignal.timeout(5000) // 5秒タイムアウト
              });
              
              const poolEndTime = Date.now();
              const latency = poolEndTime - poolStartTime;
              
              if (!response.ok) {
                return {
                  pool: `pool${index + 1}`,
                  status: 'unhealthy',
                  latency,
                  error: `HTTP ${response.status}`
                };
              }
              
              const data = await response.json();
              return {
                pool: `pool${index + 1}`,
                status: data.status || 'healthy',
                hostname: data.hostname,
                time: data.time,
                latency
              };
            } catch (error) {
              const poolEndTime = Date.now();
              const latency = poolEndTime - poolStartTime;
              return {
                pool: `pool${index + 1}`,
                status: 'unhealthy',
                latency,
                error: error instanceof Error ? error.message : 'Connection failed'
              };
            }
          });

          const poolResults = await Promise.all(poolHealthPromises);
          
          // 最速のhealthyプールを選択
          const healthyPools = poolResults.filter(pool => pool.status === 'healthy');
          const fastestPool = healthyPools.length > 0 
            ? healthyPools.reduce((fastest, current) => 
                current.latency < fastest.latency ? current : fastest
              )
            : null;

          if (fastestPool) {
            console.log('[Health Check] Global Health (Fastest):', fastestPool.status);
            console.log('[Health Check] Global Hostname:', fastestPool.hostname);
            console.log('[Health Check] Global Latency:', `${fastestPool.latency}ms`);
            console.log('[Health Check] Selected Pool:', fastestPool.pool);
            
            const globalHealthTime = new Date(fastestPool.time);
            const formattedGlobalHealthTime = new Intl.DateTimeFormat(locale, {
              dateStyle: 'short',
              timeStyle: 'long',
              timeZone,
            }).format(globalHealthTime);
            console.log('[Health Check] Global Time:', formattedGlobalHealthTime);
          } else {
            console.error('[Health Check] No healthy pools found');
          }

          // 全プールの結果をログ出力
          poolResults.forEach(pool => {
            console.log(`[Health Check] ${pool.pool}: ${pool.status} (${pool.latency}ms)${pool.error ? ` - ${pool.error}` : ''}`);
          });

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
