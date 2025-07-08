import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();

  try {
    // 環境変数からベースURLを取得
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pool.digitalregion.jp';
    const proxyUrl = `${baseUrl}/api/stats`;

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

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream server error: ${response.status}` },
        { status: response.status }
      );
    }

    const originalData = await response.json();

    // nodesから最大のdifficultyとheightを取得
    let maxDifficulty = 0;
    let maxHeight = 0;
    
    if (originalData.nodes && Array.isArray(originalData.nodes)) {
      originalData.nodes.forEach((node: { difficulty: string | number; height: string | number }) => {
        const difficulty = typeof node.difficulty === 'string' ? parseFloat(node.difficulty) : node.difficulty;
        const height = typeof node.height === 'string' ? parseInt(node.height) : node.height;
        
        if (!isNaN(difficulty) && difficulty > maxDifficulty) {
          maxDifficulty = difficulty;
        }
        if (!isNaN(height) && height > maxHeight) {
          maxHeight = height;
        }
      });
    }

    // ネットワークハッシュレートを計算（difficulty / block time）
    const blockTime = 10; // Virbicoinのブロック時間（秒）
    const networkHashrate = maxDifficulty / blockTime;

    // roundVarianceを計算
    let roundVariance = 0;
    if (originalData.stats?.roundShares && maxDifficulty > 0) {
      roundVariance = (originalData.stats.roundShares / maxDifficulty) * 100;
    }

    // DashboardStatsが期待するデータ構造に変換
    const transformedData = {
      ...originalData,
      stats: {
        ...originalData.stats,
        networkHashrate: networkHashrate,
        networkDifficulty: maxDifficulty,
        height: maxHeight,
        roundVariance: roundVariance
      }
    };

    // CORSヘッダーを設定
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Proxy-Duration': duration.toString()
    });

    return NextResponse.json(transformedData, { headers });

  } catch (error) {
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
