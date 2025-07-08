import { NextResponse } from 'next/server';
import { hostname } from 'os';

export async function GET() {
    try {
        // サーバーのヘルス情報を返す
        const healthData = {
            status: 'OK',
            hostname: hostname(),
            time: new Date().toISOString(),
            timestamp: Date.now()
        };

        return NextResponse.json(healthData, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            { 
                status: 'ERROR', 
                error: 'Health check failed',
                time: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
