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

// アクティブプール（稼働中）
const ACTIVE_POOL_NODES: PoolNode[] = [
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
        location: "Japan Central",
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
        location: "Sweden Central",
        flag: "🇸🇪",
        country: "SE",
        stratumPort: 8002,
        region: "North Europe"
    }
];

// 非アクティブプール（未実装・Coming Soon）
const INACTIVE_POOL_NODES: PoolNode[] = [
    {
        url: "stratum5.digitalregion.jp",
        location: "Western USA",
        flag: "🇺🇸",
        country: "US",
        stratumPort: 8002,
        region: "North America"
    }
];

// 全プールノード（表示用）
const POOL_NODES: PoolNode[] = [...ACTIVE_POOL_NODES, ...INACTIVE_POOL_NODES];

// プールのヘルス状態をチェックする関数
async function checkPoolHealth(url: string): Promise<PoolHealthData> {
    const startTime = Date.now();

    // 開発環境での模擬データ
    if ((process.env.NODE_ENV as string) === 'development') {
        // プール設定から動的に生成
        const healthProbability: Record<string, number> = {};
        const latencyBase: Record<string, number> = {};
        
        // アクティブプールは90%確率でオンライン
        ACTIVE_POOL_NODES.forEach(pool => {
            healthProbability[pool.url] = 0.90;
            // 地域別の基本レイテンシを設定
            switch (pool.region) {
                case 'Global':
                    latencyBase[pool.url] = 50;
                    break;
                case 'South Asia':
                    latencyBase[pool.url] = 180;
                    break;
                case 'North East Asia':
                    latencyBase[pool.url] = 20;
                    break;
                case 'North America':
                    latencyBase[pool.url] = 150;
                    break;
                case 'North Europe':
                    latencyBase[pool.url] = 120;
                    break;
                default:
                    latencyBase[pool.url] = 100;
            }
        });
        
        // 非アクティブプールは0%確率
        INACTIVE_POOL_NODES.forEach(pool => {
            healthProbability[pool.url] = 0.00;
            latencyBase[pool.url] = 130; // 仮想値
        });

        const probability = healthProbability[url as keyof typeof healthProbability] || 0.95;
        const baseLatency = latencyBase[url as keyof typeof latencyBase] || 100;

        // 非アクティブプールは特別処理
        const isInactivePool = INACTIVE_POOL_NODES.some(node => node.url === url);
        if (isInactivePool) {
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
        // プールリストから動的にプロキシパスマッピングを生成
        const proxyPathMapping: Record<string, string> = {};
        
        // アクティブプールのみプロキシパスを設定
        ACTIVE_POOL_NODES.forEach(pool => {
            if (pool.url === 'stratum.digitalregion.jp') {
                proxyPathMapping[pool.url] = '/api/stats';
            } else {
                // stratum1.digitalregion.jp -> pool1, stratum2.digitalregion.jp -> pool2, etc.
                const match = pool.url.match(/stratum(\d+)\.digitalregion\.jp/);
                if (match) {
                    const poolNumber = match[1];
                    proxyPathMapping[pool.url] = `/api/pool${poolNumber}/stats`;
                }
            }
        });
        
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
    // 各プールのヘルス状態を動的に取得
    const healthResults = POOL_NODES.map(pool => 
        useSWR(`pool-health-${pool.url}`, () => checkPoolHealth(pool.url), {
            refreshInterval: 120000,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 1,
            errorRetryInterval: 60000,
            dedupingInterval: 60000,
            fallbackData: { isHealthy: false, lastChecked: Date.now() }
        })
    );

    // ヘルスチェック結果をプールデータと組み合わせ
    const healthChecks = POOL_NODES.map((pool, index) => ({
        ...pool,
        healthData: healthResults[index].data || { isHealthy: false, lastChecked: Date.now() },
        isLoading: healthResults[index].data === undefined && !healthResults[index].error
    }));

    // アクティブプールのみをカウント
    const activeHealthChecks = healthChecks.filter(check =>
        ACTIVE_POOL_NODES.some(node => node.url === check.url)
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
                            className={`w-full p-6 rounded-lg border transition-all duration-300 hover:shadow-lg min-h-[160px] ${INACTIVE_POOL_NODES.some(node => node.url === pool.url) ?
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
                                                INACTIVE_POOL_NODES.some(node => node.url === pool.url) ? 'bg-orange-500/20 text-orange-400' : 'bg-red-400/20 text-red-400'
                                            }`}>
                                            {pool.isLoading ? 'Checking' :
                                                pool.healthData.isHealthy ? 'Online' :
                                                    INACTIVE_POOL_NODES.some(node => node.url === pool.url) ? 'Coming Soon' : 'Offline'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-400 truncate mb-4">{pool.url}</p>
                                </div>

                                {/* メトリクス行 */}
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    <div className="flex flex-col items-center p-2.5 bg-gray-800/50 rounded-lg min-w-0">
                                        <span className="text-gray-400 text-xs mb-1">Latency</span>
                                        <span className={`font-mono font-medium text-xs ${pool.healthData.latency ? 'text-white' :
                                            INACTIVE_POOL_NODES.some(node => node.url === pool.url) ? 'text-gray-500' : 'text-gray-500'
                                            }`}>
                                            {INACTIVE_POOL_NODES.some(node => node.url === pool.url) ? '---' :
                                                pool.healthData.latency ? `${pool.healthData.latency}ms` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center p-2.5 bg-gray-800/50 rounded-lg min-w-0">
                                        <span className="text-gray-400 text-xs mb-1">Port</span>
                                        <span className={`font-medium text-xs ${INACTIVE_POOL_NODES.some(node => node.url === pool.url) ? 'text-gray-500' : 'text-white'
                                            }`}>
                                            {INACTIVE_POOL_NODES.some(node => node.url === pool.url) ? '---' : pool.stratumPort}
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
                        {new Date().toLocaleString(undefined, { timeZoneName: 'short' }) || 'N/A'}
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
