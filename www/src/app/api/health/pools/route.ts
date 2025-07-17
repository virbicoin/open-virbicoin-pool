import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 環境変数からプール設定を動的に取得
    const getPoolConfig = () => {
      const pools = [];
      
      // 環境変数からプール設定を読み込み
      for (let i = 1; i <= 10; i++) { // 最大10プールまで対応
        const poolUrl = process.env[`NEXT_PUBLIC_POOL${i}_URL`];
        if (poolUrl) {
          pools.push({
            name: `pool${i}`,
            url: poolUrl
          });
        }
      }
      
      // 環境変数が設定されていない場合はデフォルト設定を使用
      if (pools.length === 0) {
        return [
          { name: 'pool1', url: 'https://pool1.digitalregion.jp' },
          { name: 'pool2', url: 'https://pool2.digitalregion.jp' },
          { name: 'pool3', url: 'https://pool3.digitalregion.jp' },
          { name: 'pool4', url: 'https://pool4.digitalregion.jp' },
          { name: 'pool5', url: 'https://pool5.digitalregion.jp' },
        ];
      }
      
      return pools;
    };

    const pools = getPoolConfig();

    // 全プールのヘルスチェックを並行実行
    const poolHealthPromises = pools.map(async (pool) => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${pool.url}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Virbicoin-Pool-GlobalHealth/1.0'
          },
          signal: AbortSignal.timeout(5000)
        });

        const endTime = Date.now();
        const latency = endTime - startTime;

        if (!response.ok) {
          return {
            pool: pool.name,
            status: 'unhealthy',
            latency,
            error: `HTTP ${response.status}`
          };
        }

        const data = await response.json();
        
        return {
          pool: pool.name,
          status: data.status || 'healthy',
          hostname: data.hostname,
          time: data.time,
          latency
        };

      } catch (error) {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        return {
          pool: pool.name,
          status: 'unhealthy',
          latency,
          error: error instanceof Error ? error.message : 'Connection failed'
        };
      }
    });

    const results = await Promise.all(poolHealthPromises);
    
    return NextResponse.json({
      pools: results,
      timestamp: new Date().toISOString(),
      totalPools: pools.length
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Global health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 