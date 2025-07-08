import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();

  try {
    // 環境変数からベースURLを取得
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pool.digitalregion.jp';
    const proxyUrl = `${baseUrl}/api/stats`;
    
    console.log(`[Stats API] Fetching: ${proxyUrl}`);

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Virbicoin-Pool-Frontend/1.0'
      },
      // タイムアウトを設定
      signal: AbortSignal.timeout(15000)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`[Stats API] Response: ${response.status} in ${duration}ms`);

    if (!response.ok) {
      console.error(`[Stats API] Upstream error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Upstream server error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // データ構造をログ出力（デバッグ用）
    console.log(`[Stats API] Data structure:`, {
      hashrate: data?.hashrate,
      minersTotal: data?.minersTotal,
      statsKeys: data?.stats ? Object.keys(data.stats) : 'no stats',
      nodesLength: data?.nodes?.length || 0
    });

    // CORSヘッダーを設定
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Proxy-Duration': duration.toString()
    });

    return NextResponse.json(data, { headers });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Stats API] Error after ${duration}ms:`, error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }

    return NextResponse.json(
      { error: 'Internal stats API error', details: error instanceof Error ? error.message : 'Unknown error' },
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
