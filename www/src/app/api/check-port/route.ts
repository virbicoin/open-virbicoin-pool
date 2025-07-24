import { NextRequest, NextResponse } from 'next/server';
import net from 'net';

// Force this route to run in the Node.js runtime (required for net.Socket)
export const runtime = 'nodejs';

// TCP health check endpoint.
// Example usage: /api/check-port?host=stratum1.digitalregion.jp&port=8002
// Returns JSON: { healthy: boolean }
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('host');
  const portParam = searchParams.get('port');

  if (!host || !portParam) {
    return NextResponse.json({ error: 'Missing host or port query parameter' }, { status: 400 });
  }

  const port = parseInt(portParam, 10);
  if (Number.isNaN(port) || port <= 0 || port >= 65536) {
    return NextResponse.json({ error: 'Invalid port number' }, { status: 400 });
  }

  // Attempt to establish a TCP connection with a 3-second timeout and measure RTT.
  const timeoutMs = 3000;

  return new Promise<NextResponse>((resolve) => {
    const t0 = Date.now();
    const socket = new net.Socket();
    let resolved = false;

    const finish = (healthy: boolean) => {
      if (resolved) return;
      resolved = true;
      const latency = Date.now() - t0;
      socket.destroy();
      resolve(
        NextResponse.json(
          { healthy, latency },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          },
        ),
      );
    };

    socket.setTimeout(timeoutMs);

    socket
      .connect(port, host, () => finish(true))
      .on('error', () => finish(false))
      .on('timeout', () => finish(false));
  });
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