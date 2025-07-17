import { NextResponse } from 'next/server';

interface PoolHealth {
  pool: string;
  status: 'healthy' | 'unhealthy';
  hostname?: string;
  time?: string;
  latency: number;
  error?: string;
}

interface GlobalHealthResponse {
  status: 'healthy' | 'unhealthy';
  hostname: string;
  time: string;
  selectedPool?: string;
  pools: PoolHealth[];
  overallLatency: number;
}

export async function GET() {
  const startTime = Date.now();
  const pools = [
    { name: 'pool1', url: 'https://pool1.digitalregion.jp/health' },
    { name: 'pool2', url: 'https://pool2.digitalregion.jp/health' },
    { name: 'pool3', url: 'https://pool3.digitalregion.jp/health' },
    { name: 'pool4', url: 'https://pool4.digitalregion.jp/health' },
    { name: 'pool5', url: 'https://pool5.digitalregion.jp/health' },
  ];

  try {
    const poolHealthPromises = pools.map(async (pool) => {
      const poolStartTime = Date.now();
      
      try {
        const response = await fetch(pool.url, {
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
            pool: pool.name,
            status: 'unhealthy' as const,
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
        const poolEndTime = Date.now();
        const latency = poolEndTime - poolStartTime;
        
        return {
          pool: pool.name,
          status: 'unhealthy' as const,
          latency,
          error: error instanceof Error ? error.message : 'Connection failed'
        };
      }
    });

    const poolResults = await Promise.all(poolHealthPromises);
    const endTime = Date.now();
    const overallLatency = endTime - startTime;

    // 最速のhealthyプールを選択
    const healthyPools = poolResults.filter(pool => pool.status === 'healthy');
    const fastestPool = healthyPools.length > 0 
      ? healthyPools.reduce((fastest, current) => 
          current.latency < fastest.latency ? current : fastest
        )
      : null;

    // 全体のステータスを決定（1つでもhealthyならhealthy）
    const overallStatus = healthyPools.length > 0 ? 'healthy' : 'unhealthy';

    const response: GlobalHealthResponse = {
      status: overallStatus,
      hostname: fastestPool?.hostname || 'unknown',
      time: fastestPool?.time || new Date().toISOString(),
      selectedPool: fastestPool?.pool,
      pools: poolResults,
      overallLatency
    };

    // CORSヘッダーを設定
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    return NextResponse.json(response, { headers });

  } catch {
    const endTime = Date.now();
    const overallLatency = endTime - startTime;

    const errorResponse: GlobalHealthResponse = {
      status: 'unhealthy',
      hostname: 'unknown',
      time: new Date().toISOString(),
      pools: [],
      overallLatency
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 