import os from "os";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const hostname = os.hostname();
        const now = new Date();
        const time = new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "long",
        }).format(now);
        return NextResponse.json({ status: "healthy", hostname, time });
    } catch (error) {
        const now = new Date();
        const time = new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "long",
        }).format(now);
        return NextResponse.json(
            { status: "unhealthy", hostname: os.hostname(), time, error: (error as Error).message },
            { status: 500 }
        );
    }
}
export const dynamic = "force-dynamic";