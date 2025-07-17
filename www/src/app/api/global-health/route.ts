import { NextResponse } from 'next/server';

interface GlobalHealthResponse {
  status: 'healthy' | 'unhealthy';
  hostname: string;
  time: string;
  latency: number;
}

export async function GET() {
  const startTime = Date.now();

  try {
    // api.digitalregion.jpは本来のマイニングプールのstatsを返す
    const response = await fetch('https://pool.digitalregion.jp/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Virbicoin-Pool-GlobalHealth/1.0'
      },
      signal: AbortSignal.timeout(10000) // 10秒タイムアウト
    });

    const endTime = Date.now();
    const latency = endTime - startTime;

    if (!response.ok) {
      return NextResponse.json({
        status: 'unhealthy',
        hostname: 'api.digitalregion.jp',
        time: new Date().toISOString(),
        latency,
        error: `HTTP ${response.status}`
      }, { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const data = await response.json();

    const responseData: GlobalHealthResponse = {
      status: data.status || 'healthy',
      hostname: 'api.digitalregion.jp',
      time: data.time || new Date().toISOString(),
      latency
    };

    // CORSヘッダーを設定
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    return NextResponse.json(responseData, { headers });

  } catch {
    const endTime = Date.now();
    const latency = endTime - startTime;

    const errorResponse: GlobalHealthResponse = {
      status: 'unhealthy',
      hostname: 'api.digitalregion.jp',
      time: new Date().toISOString(),
      latency
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