import { NextRequest, NextResponse } from 'next/server';

// プールエンドポイントのマッピング
const POOL_ENDPOINTS = {
  'pool1': 'https://pool1.digitalregion.jp',
  'pool2': 'https://pool2.digitalregion.jp',
  'pool3': 'https://pool3.digitalregion.jp',
  'pool4': 'https://pool4.digitalregion.jp',
  'pool5': 'https://pool5.digitalregion.jp',
  'pool': 'https://pool.digitalregion.jp'
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const startTime = Date.now();
  let poolId = '';
  let apiPath = '';

  try {
    const params = await context.params;
    const { slug } = params;

    console.log(`[Proxy] Request: ${slug?.join('/')}`);

    if (!slug || slug.length === 0) {
      console.error(`[Proxy] Invalid path: ${slug?.join('/') || 'undefined'}`);
      return NextResponse.json({ error: 'Invalid proxy path' }, { status: 400 });
    }

    // Handle /api/health root -> global pool
    if (slug[0] === 'health') {
      poolId = 'pool';
      apiPath = 'health';
    } else {
      poolId = slug[0];
      apiPath = slug.slice(1).join('/');
      if (!apiPath) {
        console.error(`[Proxy] Invalid proxy path: missing sub-path`);
        return NextResponse.json({ error: 'Invalid proxy path' }, { status: 400 });
      }
    }

    const baseUrl = POOL_ENDPOINTS[poolId as keyof typeof POOL_ENDPOINTS];

    if (!baseUrl) {
      console.error(`[Proxy] Unknown pool: ${poolId}`);
      return NextResponse.json({ error: 'Unknown pool endpoint' }, { status: 404 });
    }

    const isHealthCheck = apiPath === 'health';
    // プロキシリクエストを送信
    const proxyUrl: string = isHealthCheck
      ? `${baseUrl}/health`
      : `${baseUrl}/api/${apiPath}`;
    console.log(`[Proxy] Fetching: ${proxyUrl}`);

    const response = await fetch(proxyUrl, {
      // Always use GET for health so that upstream servers that don't
      // implement HEAD still respond with 200.
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Virbicoin-Pool-Frontend/1.0'
      },
      // Route53 latency based routing ensures nearest server; 10s timeout
      signal: AbortSignal.timeout(10000)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`[Proxy] Response: ${response.status} in ${duration}ms for ${proxyUrl}`);

    if (!response.ok) {
      console.error(`[Proxy] Upstream error: ${proxyUrl} - ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Upstream server error: ${response.status}` },
        { status: response.status }
      );
    }

    // Try to parse JSON if possible, otherwise return text
    let data: unknown;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    } else if (contentType.startsWith('text/')) {
      data = await response.text();
    } else {
      // For health endpoints that may not return a body, return a default object
      data = { status: 'ok' };
    }

    // CORS headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      // Duration header for optional debugging
      'X-Proxy-Duration': duration.toString(),
      'X-Proxy-Latency': duration.toString()
    });

    console.log(`[Proxy] Success: ${proxyUrl} in ${duration}ms`);
    return NextResponse.json(data, { headers });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Proxy] Error after ${duration}ms:`, error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }

    return NextResponse.json(
      { error: 'Internal proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
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