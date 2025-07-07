"use client";

import useSWR from "swr";
import { ServerIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface PoolNode {
    url: string;
    location: string;
    flag: string;
    country: string;
    stratumPort: number;
    region: string;
}

interface PoolHealthData {
    isHealthy: boolean;
    latency?: number;
    lastChecked?: number;
}

interface PoolHealthStatusProps {
    className?: string;
}

// 国旗表示コンポーネント
function FlagIcon({ country }: { country: string }) {
    if (country === 'GLOBAL') {
        return (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 border-blue-400/30 border-2">
                <GlobeAltIcon className="w-8 h-8 text-blue-400" />
            </div>
        );
    }

    // CDN国旗画像のみ表示
    const iso = country.toLowerCase();
    return (
        <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
                src={`https://flagcdn.com/w80/${iso}.png`}
                alt={country}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

const POOL_NODES: PoolNode[] = [
    {
        url: "stratum.digitalregion.jp",
        location: "Global",
        flag: "🌍",
        country: "GLOBAL",
        stratumPort: 8002,
        region: "Global"
    },
    {
        url: "stratum1.digitalregion.jp",
        location: "Western India",
        flag: "🇮🇳",
        country: "IN",
        stratumPort: 8002,
        region: "South Asia"
    },
    {
        url: "stratum2.digitalregion.jp",
        location: "Central Japan",
        flag: "🇯🇵",
        country: "JP",
        stratumPort: 8002,
        region: "North East Asia"
    },
    {
        url: "stratum3.digitalregion.jp",
        location: "Eastern USA",
        flag: "🇺🇸",
        country: "US",
        stratumPort: 8002,
        region: "North America"
    },
    {
        url: "stratum4.digitalregion.jp",
        location: "Central Sweden",
        flag: "🇸🇪",
        country: "SE",
        stratumPort: 8002,
        region: "North Europe"
    },
    {
        url: "stratum5.digitalregion.jp",
        location: "Western USA",
        flag: "🇺🇸",
        country: "US",
        stratumPort: 8002,
        region: "North America"
    }
];

// プールのヘルス状態をチェックする関数
async function checkPoolHealth(url: string): Promise<PoolHealthData> {
    const startTime = Date.now();

    // 開発環境での模擬データ
    if ((process.env.NODE_ENV as string) === 'development') {
        // プールごとに異なる確率でオンライン状態をシミュレート
        const healthProbability = {
            'stratum.digitalregion.jp': 0.90,  // Global - 90%の確率でオンライン
            'stratum1.digitalregion.jp': 0.90, // India - 90%の確率でオンライン
            'stratum2.digitalregion.jp': 0.90, // Japan - 90%の確率でオンライン
            'stratum3.digitalregion.jp': 0.90, // East USA - 90%の確率でオンライン
            'stratum4.digitalregion.jp': 0.00, // Sweden - まだ稼働していないため0%
            'stratum5.digitalregion.jp': 0.00  // Western USA - まだ稼働していないため0%
        };

        const latencyBase = {
            'stratum.digitalregion.jp': 50,   // Global - 基本50ms
            'stratum1.digitalregion.jp': 180, // West India - 基本180ms
            'stratum2.digitalregion.jp': 20,  // Central Japan - 基本20ms
            'stratum3.digitalregion.jp': 150, // East USA - 基本150ms
            'stratum4.digitalregion.jp': 120, // Sweden - 基本120ms
            'stratum5.digitalregion.jp': 130  // Western USA - 基本130ms
        };

        const probability = healthProbability[url as keyof typeof healthProbability] || 0.95;
        const baseLatency = latencyBase[url as keyof typeof latencyBase] || 100;

        // stratum4.digitalregion.jpとstratum5.digitalregion.jpはまだ稼働していないため、特別処理
        if (url === 'stratum4.digitalregion.jp' || url === 'stratum5.digitalregion.jp') {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
            return {
                isHealthy: false,
                latency: undefined,
                lastChecked: Date.now()
            };
        }

        // より安定したヘルス状態判定のため、時間ベースでステータスを決定
        const now = Date.now();
        const hourly = Math.floor(now / (1000 * 60 * 60)); // 1時間ごとに変わる値
        const timeBasedSeed = url.charCodeAt(0) + hourly; // URLと時間を組み合わせたシード値

        // 実際のネットワーク遅延をシミュレート
        const simulatedDelay = baseLatency + Math.random() * 50;
        await new Promise(resolve => setTimeout(resolve, simulatedDelay));

        // 時間ベースの安定した判定（1時間ごとにのみ状態が変わる可能性）
        const stableRandom = (timeBasedSeed % 100) / 100;
        const isHealthy = stableRandom < probability;
        const endTime = Date.now();

        return {
            isHealthy,
            latency: isHealthy ? endTime - startTime : undefined,
            lastChecked: Date.now()
        };
    }

    // リクエストパスの決定: 開発環境は Next.js API ルート、本番環境は Nginx プロキシパス
    let fetchPath: string | undefined;
    if ((process.env.NODE_ENV as string) !== 'production') {
        // 開発モードでは Next.js API プロキシを利用
        fetchPath = `/api/proxy/${url}/api/stats`;
    } else {
        const proxyPathMapping: Record<string, string> = {
            'stratum.digitalregion.jp': '/api/stats',
            'stratum1.digitalregion.jp': '/api/pool1/stats',
            'stratum2.digitalregion.jp': '/api/pool2/stats',
            'stratum3.digitalregion.jp': '/api/pool3/stats'
        };
        fetchPath = proxyPathMapping[url];
    }
    if (!fetchPath) {
        return { isHealthy: false, lastChecked: Date.now() };
    }

    try {
        // 決定したパスへリクエスト
        const response = await fetch(fetchPath, {
            method: 'GET',
            signal: AbortSignal.timeout(15000), // 15秒タイムアウト
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        const endTime = Date.now();
        // ブラウザ〜プロキシ間のラウンドトリップを計測
        const latency = endTime - startTime;

        console.log(`[Health] ${url} (${fetchPath}): ${response.status} in ${latency}ms`);

        if (response.ok) {
            const data = await response.json();
            // データが有効かチェック
            if (data && typeof data === 'object' && !data.error) {
                return {
                    isHealthy: true,
                    latency,
                    lastChecked: Date.now()
                };
            } else {
                console.warn(`[Health] Invalid data for ${url}:`, data);
                return {
                    isHealthy: false,
                    lastChecked: Date.now()
                };
            }
        }
        
        // レスポンスエラーの場合
        console.warn(`[Health] HTTP error for ${url} (${fetchPath}): ${response.status}`);
        return {
            isHealthy: false,
            lastChecked: Date.now()
        };
        
    } catch (error) {
        console.error(`Health check failed for ${url} (${fetchPath}):`, error);
        return {
            isHealthy: false,
            lastChecked: Date.now()
        };
    }
}

export default function PoolHealthStatus({ className = "" }: PoolHealthStatusProps) {
    // 各プールのヘルス状態を取得
    const globalHealth = useSWR(`pool-health-${POOL_NODES[0].url}`, () => checkPoolHealth(POOL_NODES[0].url), {
        refreshInterval: 120000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
        errorRetryInterval: 60000,
        dedupingInterval: 60000,
        fallbackData: { isHealthy: false, lastChecked: Date.now() }
    });

    const indiaHealth = useSWR(`pool-health-${POOL_NODES[1].url}`, () => checkPoolHealth(POOL_NODES[1].url), {
        refreshInterval: 120000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
        errorRetryInterval: 60000,
        dedupingInterval: 60000,
        fallbackData: { isHealthy: false, lastChecked: Date.now() }
    });

    const japanHealth = useSWR(`pool-health-${POOL_NODES[2].url}`, () => checkPoolHealth(POOL_NODES[2].url), {
        refreshInterval: 120000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
        errorRetryInterval: 60000,
        dedupingInterval: 60000,
        fallbackData: { isHealthy: false, lastChecked: Date.now() }
    });

    const usaEastHealth = useSWR(`pool-health-${POOL_NODES[3].url}`, () => checkPoolHealth(POOL_NODES[3].url), {
        refreshInterval: 120000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
        errorRetryInterval: 60000,
        dedupingInterval: 60000,
        fallbackData: { isHealthy: false, lastChecked: Date.now() }
    });

    const swedenHealth = useSWR(`pool-health-${POOL_NODES[4].url}`, () => checkPoolHealth(POOL_NODES[4].url), {
        refreshInterval: 120000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
        errorRetryInterval: 60000,
        dedupingInterval: 60000,
        fallbackData: { isHealthy: false, lastChecked: Date.now() }
    });

    const usaWestHealth = useSWR(`pool-health-${POOL_NODES[5].url}`, () => checkPoolHealth(POOL_NODES[5].url), {
        refreshInterval: 120000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
        errorRetryInterval: 60000,
        dedupingInterval: 60000,
        fallbackData: { isHealthy: false, lastChecked: Date.now() }
    });

    const healthChecks = [
        {
            ...POOL_NODES[0],
            healthData: globalHealth.data || { isHealthy: false, lastChecked: Date.now() },
            isLoading: globalHealth.data === undefined && !globalHealth.error
        },
        {
            ...POOL_NODES[1],
            healthData: indiaHealth.data || { isHealthy: false, lastChecked: Date.now() },
            isLoading: indiaHealth.data === undefined && !indiaHealth.error
        },
        {
            ...POOL_NODES[2],
            healthData: japanHealth.data || { isHealthy: false, lastChecked: Date.now() },
            isLoading: japanHealth.data === undefined && !japanHealth.error
        },
        {
            ...POOL_NODES[3],
            healthData: usaEastHealth.data || { isHealthy: false, lastChecked: Date.now() },
            isLoading: usaEastHealth.data === undefined && !usaEastHealth.error
        },
        {
            ...POOL_NODES[4],
            healthData: swedenHealth.data || { isHealthy: false, lastChecked: Date.now() },
            isLoading: swedenHealth.data === undefined && !swedenHealth.error
        },
        {
            ...POOL_NODES[5],
            healthData: usaWestHealth.data || { isHealthy: false, lastChecked: Date.now() },
            isLoading: usaWestHealth.data === undefined && !usaWestHealth.error
        }
    ];

    // stratum4（Coming Soon）とstratum5（Coming Soon）を除外してアクティブなプールのみカウント
    const activeHealthChecks = healthChecks.filter(check =>
        check.url !== 'stratum4.digitalregion.jp' && check.url !== 'stratum5.digitalregion.jp'
    );
    const healthyCount = activeHealthChecks.filter(check => check.healthData.isHealthy).length;
    const totalCount = activeHealthChecks.length;
    const healthPercentage = totalCount > 0 ? (healthyCount / totalCount) * 100 : 0;

    return (
        <div className={`bg-gray-800 rounded-lg border border-gray-700 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <ServerIcon className="w-8 h-8 text-green-400" />
                        {healthyCount === totalCount && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-300">Pool Health Status</h3>
                        <p className="text-sm text-gray-400">
                            {healthyCount}/{totalCount} pools online • {healthPercentage.toFixed(0)}% uptime
                        </p>
                    </div>
                </div>

                {/* 全体ステータスインジケーター */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${healthyCount === totalCount ? 'bg-green-400/20 text-green-400' :
                    healthyCount > 0 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-400/20 text-red-400'
                    }`}>
                    {healthyCount === totalCount ? 'Operational' :
                        healthyCount > 0 ? 'Degraded' : 'Down'}
                </div>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {healthChecks.map((pool, index) => (
                        <div
                            key={pool.url}
                            className={`w-full p-6 rounded-lg border transition-all duration-300 hover:shadow-lg min-h-[160px] ${pool.url === 'stratum4.digitalregion.jp' || pool.url === 'stratum5.digitalregion.jp' ?
                                'bg-gray-800/30 border-gray-600/50 opacity-60' :
                            `bg-gray-700/50 hover:bg-gray-700/70 ${pool.healthData.isHealthy ? 'border-green-400/30 shadow-green-400/10' :
                                pool.isLoading ? 'border-gray-600/50' : 'border-red-400/30 shadow-red-400/10'
                            }`
                            }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-start gap-4 h-full">
                            {/* 国旗とステータスインジケーター */}
                            <div className="flex-shrink-0 relative">
                                <FlagIcon country={pool.country} />
                                {/* ステータスバッジ */}
                                <div className="absolute -bottom-1 -right-1">
                                    {pool.isLoading ? (
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin bg-gray-800"></div>
                                    ) : pool.healthData.isHealthy ? (
                                        <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                                    ) : (
                                        <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
                                    )}
                                </div>
                            </div>

                            {/* プール情報 */}
                            <div className="flex-grow min-w-0 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white font-semibold text-base truncate">{pool.location}</h4>
                                        </div>
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${pool.isLoading ? 'bg-gray-600/50 text-gray-300' :
                                            pool.healthData.isHealthy ? 'bg-green-400/20 text-green-400' :
                                                (pool.url === 'stratum4.digitalregion.jp' || pool.url === 'stratum5.digitalregion.jp') ? 'bg-orange-500/20 text-orange-400' : 'bg-red-400/20 text-red-400'
                                            }`}>
                                            {pool.isLoading ? 'Checking' :
                                                pool.healthData.isHealthy ? 'Online' :
                                                    (pool.url === 'stratum4.digitalregion.jp' || pool.url === 'stratum5.digitalregion.jp') ? 'Coming Soon' : 'Offline'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-400 truncate mb-4">{pool.url}</p>
                                </div>

                                {/* メトリクス行 */}
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    <div className="flex flex-col items-center p-2.5 bg-gray-800/50 rounded-lg min-w-0">
                                        <span className="text-gray-400 text-xs mb-1">Latency</span>
                                        <span className={`font-mono font-medium text-xs ${pool.healthData.latency ? 'text-white' :
                                            (pool.url === 'stratum4.digitalregion.jp' || pool.url === 'stratum5.digitalregion.jp') ? 'text-gray-500' : 'text-gray-500'
                                            }`}>
                                            {(pool.url === 'stratum4.digitalregion.jp' || pool.url === 'stratum5.digitalregion.jp') ? '---' :
                                                pool.healthData.latency ? `${pool.healthData.latency}ms` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center p-2.5 bg-gray-800/50 rounded-lg min-w-0">
                                        <span className="text-gray-400 text-xs mb-1">Port</span>
                                        <span className={`font-medium text-xs ${(pool.url === 'stratum4.digitalregion.jp' || pool.url === 'stratum5.digitalregion.jp') ? 'text-gray-500' : 'text-white'
                                            }`}>
                                            {(pool.url === 'stratum4.digitalregion.jp' || pool.url === 'stratum5.digitalregion.jp') ? '---' : pool.stratumPort}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center p-2.5 bg-gray-800/50 rounded-lg min-w-0">
                                        <span className="text-gray-400 text-xs mb-1">Region</span>
                                        <span className="text-white font-medium text-xs text-center leading-tight w-full overflow-hidden">
                                            {pool.region}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Last updated:</span>
                    <span className="text-gray-300">
                        {new Date().toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}
                    </span>
                </div>

                {/* ヘルス状態バー */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Global Health</span>
                        <span>{healthPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${healthPercentage === 100 ? 'bg-green-400' :
                                healthPercentage >= 66 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}
                            style={{ width: `${healthPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
