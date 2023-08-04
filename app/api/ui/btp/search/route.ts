import {getMessage} from "@/app/api/message";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
    const { searchParams, search } = new URL(request.url);
    const src = searchParams.get("source");
    const nsn = parseInt(searchParams.get("nsn") || "1");
    return NextResponse.json(getMessage(nsn, src));
}
