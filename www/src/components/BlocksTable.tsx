"use client";
import TimeAgo from "@/components/TimeAgo";
import { formatDifficulty } from "@/lib/formatters";

export type Block = {
    height: number;
    hash: string;
    timestamp: number;
    shares?: number;
    difficulty?: number;
    reward?: string | number;
    uncle?: boolean;
    orphan?: boolean;
};

type BlocksTableProps = {
    blocks: Block[];
    type: "matured" | "immature" | "pending";
};

export default function BlocksTable({ blocks, type }: BlocksTableProps) {
    return (
        <div className="table-responsive">
            <table className="table table-condensed table-striped">
                <thead>
                    <tr>
                        <th>Height</th>
                        {type !== "pending" && <th>Block Hash</th>}
                        <th>Time Found</th>
                        {type === "matured" && <th>Variance</th>}
                        {type === "pending" && <th>Difficulty</th>}
                        {type === "pending" && <th>Variance</th>}
                        {type !== "pending" && <th>Reward</th>}
                    </tr>
                </thead>
                <tbody>
                    {blocks.map((block) => (
                        <tr key={`${block.height}-${block.hash || block.timestamp}`}>
                            <td>
                                <a href={`https://explorer.digitalregion.jp/block/${block.height}`} target="_blank" rel="noopener noreferrer">{block.height}</a>
                            </td>
                            {type !== "pending" && (
                                <td>
                                    {(type === "immature" || type === "matured") && block.orphan ? (
                                        <span style={{
                                            display: 'inline-block',
                                            background: '#ffb3b3', // soft red
                                            color: '#a94442',      // muted red text
                                            borderRadius: '4px',
                                            padding: '0 6px',      // reduce vertical padding
                                            fontWeight: 'bold',
                                            fontSize: '85%',       // slightly smaller font
                                            border: '1px solid #f2bcbc',
                                            lineHeight: 1.2,       // compact line height
                                        }}>Orphan</span>
                                    ) : (
                                        <a href={`https://explorer.digitalregion.jp/block/${block.hash}`} className="hash" target="_blank" rel="noopener noreferrer">
                                            {block.hash}
                                        </a>
                                    )}
                                </td>
                            )}
                            <td><TimeAgo timestamp={block.timestamp} /></td>
                            {type === "matured" && (
                                <td>
                                    {block.orphan ? '' : (
                                        (() => {
                                            if (block.shares && block.difficulty) {
                                                const variance = (block.shares / block.difficulty) * 100;
                                                const className = variance <= 100 ? 'label label-success' : 'label label-info';
                                                return <span className={className}>{Math.round(variance)}%</span>;
                                            }
                                            return 'N/A';
                                        })()
                                    )}
                                </td>
                            )}
                            {type === "pending" && (
                                <>
                                    <td>{formatDifficulty(block.difficulty ?? 0)}</td>
                                    <td>
                                        {(() => {
                                            if (block.shares && block.difficulty) {
                                                const variance = (block.shares / block.difficulty) * 100;
                                                const className = variance <= 100 ? 'label label-success' : 'label label-info';
                                                return <span className={className}>{Math.round(variance)}%</span>;
                                            }
                                            return 'N/A';
                                        })()}
                                    </td>
                                </>
                            )}
                            {type !== "pending" && (
                                <td>
                                    {(type === "immature" || type === "matured") && block.orphan ? '' : (
                                        block.reward ?
                                            <span className={`label ${block.uncle ? 'label-default' : 'label-primary'}`}>
                                                {(Number(block.reward) / 1e18).toFixed(4)} VBC
                                            </span> :
                                            'N/A'
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}