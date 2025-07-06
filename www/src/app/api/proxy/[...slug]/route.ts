import { NextRequest, NextResponse } from 'next/server';

// プールエンドポイントのマッピング
const POOL_ENDPOINTS = {
  'pool1': 'http://pool1.digitalregion.jp',
  'pool2': 'http://pool2.digitalregion.jp', 
  'pool3': 'http://pool3.digitalregion.jp',
  'pool': 'https://pool.digitalregion.jp' // メインプールはHTTPS
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const params = await context.params;
    const { slug } = params;
    
    if (!slug || slug.length < 2) {
      return NextResponse.json({ error: 'Invalid proxy path' }, { status: 400 });
    }

    const poolId = slug[0]; // pool1, pool2, pool3, etc.
    const apiPath = slug.slice(1).join('/'); // stats, blocks, etc.
    
    const baseUrl = POOL_ENDPOINTS[poolId as keyof typeof POOL_ENDPOINTS];
    
    if (!baseUrl) {
      return NextResponse.json({ error: 'Unknown pool endpoint' }, { status: 404 });
    }

    // プロキシリクエストを送信
    const proxyUrl = `${baseUrl}/api/${apiPath}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Virbicoin-Pool-Frontend/1.0'
      },
      // タイムアウトを設定
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error(`Proxy request failed: ${proxyUrl} - ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Upstream server error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // CORSヘッダーを設定
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    return NextResponse.json(data, { headers });

  } catch (error) {
    console.error('Proxy request error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }
    
    return NextResponse.json(
      { error: 'Internal proxy error' },
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
