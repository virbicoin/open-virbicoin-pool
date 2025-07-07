import { NextResponse } from 'next/server';

// フロントエンドの稼働確認用ヘルスチェックエンドポイント
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    time: new Date().toISOString(),
  });
}
