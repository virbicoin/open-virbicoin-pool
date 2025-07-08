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
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const startTime = Date.now();

  try {
    const params = await context.params;
    const { slug } = params;

    console.log(`[Proxy] Request: ${slug?.join('/')}`);

    if (!slug || slug.length < 2) {
      console.error(`[Proxy] Invalid path: ${slug?.join('/') || 'undefined'}`);
      return NextResponse.json({ error: 'Invalid proxy path' }, { status: 400 });
    }

    const poolId = slug[0]; // pool1, pool2, pool3, etc.
    const apiPath = slug.slice(1).join('/'); // stats, blocks, etc.

    const baseUrl = POOL_ENDPOINTS[poolId as keyof typeof POOL_ENDPOINTS];

    if (!baseUrl) {
      console.error(`[Proxy] Unknown pool: ${poolId}`);
      return NextResponse.json({ error: 'Unknown pool endpoint' }, { status: 404 });
    }

    // プロキシリクエストを送信
    const proxyUrl = `${baseUrl}/api/${apiPath}`;
    console.log(`[Proxy] Fetching: ${proxyUrl}`);

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Virbicoin-Pool-Frontend/1.0'
      },
      // タイムアウトを設定
      signal: AbortSignal.timeout(15000) // 15秒に延長
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`[Proxy] Response: ${response.status} in ${duration}ms for ${proxyUrl}`);

    if (!response.ok) {
      console.error(`[Proxy] Upstream error: ${proxyUrl} - ${response.status} ${response.statusText}`);

      // 特定のエラーに対してフォールバック
      if (response.status === 502 || response.status === 503 || response.status === 504) {
        // インフラエラーの場合、pool1にフォールバック（pool2, pool3のみ）
        if (poolId === 'pool2' || poolId === 'pool3') {
          console.log(`[Proxy] Fallback to pool1 for ${poolId}`);
          const fallbackUrl = `${POOL_ENDPOINTS.pool1}/api/${apiPath}`;

          try {
            const fallbackResponse = await fetch(fallbackUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Virbicoin-Pool-Frontend/1.0'
              },
              signal: AbortSignal.timeout(10000)
            });

            if (fallbackResponse.ok) {
              const data = await fallbackResponse.json();
              console.log(`[Proxy] Fallback success for ${poolId}`);

              return NextResponse.json(data, {
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'X-Proxy-Fallback': 'pool1'
                }
              });
            }
          } catch (fallbackError) {
            console.error(`[Proxy] Fallback failed for ${poolId}:`, fallbackError);
          }
        }
      }

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
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Proxy-Duration': duration.toString()
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