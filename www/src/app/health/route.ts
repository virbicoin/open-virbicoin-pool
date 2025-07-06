import os from "os";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const hostname = os.hostname();
        const time = new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
            .format(new Date())
            .replace(/\//g, "-")
            .replace(", ", " ");

        return NextResponse.json({ status: "healthy", hostname, time });
    } catch (error) {
        return NextResponse.json(
            { status: "unhealthy", hostname: os.hostname(), time: new Date().toISOString(), error: (error as Error).message },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";