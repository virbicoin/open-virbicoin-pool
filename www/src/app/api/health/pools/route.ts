import { NextResponse } from 'next/server';

// Use Node.js runtime so that AbortSignal.timeout is available and we can parallel fetch
export const runtime = 'nodejs';

// Mapping of pool IDs to their base URLs – keep in sync with [...slug]/route.ts
const POOL_ENDPOINTS: Record<string, string> = {
  pool1: 'https://pool1.digitalregion.jp',
  pool2: 'https://pool2.digitalregion.jp',
  pool3: 'https://pool3.digitalregion.jp',
  pool4: 'https://pool4.digitalregion.jp',
  pool5: 'https://pool5.digitalregion.jp',
};

interface PoolResult {
  pool: string;
  status: 'healthy' | 'unhealthy';
  latency: number;
  hostname?: string;
  time?: string;
  error?: string;
}

export async function GET() {
  const checks = Object.entries(POOL_ENDPOINTS).map(async ([poolId, baseUrl]) => {
    const url = `${baseUrl}/health`;
    const start = Date.now();
    let latency = 0;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Virbicoin-Pool-Frontend/1.0',
        },
        // 5 秒でタイムアウト
        signal: AbortSignal.timeout(5000),
      });
      latency = Date.now() - start;
      if (!res.ok) {
        return { pool: poolId, status: 'unhealthy', latency, error: `HTTP ${res.status}` } as PoolResult;
      }
      let json: unknown = null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try {
          json = await res.json();
        } catch {
          // ignore parse errors
        }
      }

      // Safe extraction of known properties
      let hostname: string | undefined = undefined;
      let time: string | undefined = undefined;
      if (json && typeof json === 'object') {
        const obj = json as Record<string, unknown>;
        if (typeof obj['hostname'] === 'string') hostname = obj['hostname'] as string;
        if (typeof obj['time'] === 'string') time = obj['time'] as string;
      }

      const result: PoolResult = {
        pool: poolId,
        status: 'healthy',
        latency,
        ...(hostname ? { hostname } : {}),
        ...(time ? { time } : {}),
      };

      return result;
    } catch (err) {
      latency = Date.now() - start;
      const msg = err instanceof Error ? err.message : 'unknown error';
      return { pool: poolId, status: 'unhealthy', latency, error: msg } as PoolResult;
    }
  });

  const pools: PoolResult[] = await Promise.all(checks);

  // Determine overall HTTP status: if at least one healthy, 200 else 503
  const healthyExists = pools.some((p) => p.status === 'healthy');
  const statusCode = healthyExists ? 200 : 503;

  return NextResponse.json(
    { pools, generatedAt: new Date().toISOString() },
    {
      status: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  );
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 