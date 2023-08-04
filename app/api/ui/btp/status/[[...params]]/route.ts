import { NextResponse } from 'next/server';
import {getMessage} from "@/app/api/message";
import {BTPMessage} from "@/app/data/BTPMessage";

export async function GET(request: Request, { params }: { params: { params : string[] } }) {
    const p = params["params"];
    const { searchParams, search } = new URL(request.url);
    if (p) {
        if (p[0] == "latest") return getMessages(15);
        if (p.length == 1) return NextResponse.json(getMessage(parseInt(p[0])));
    }
    const limitP = searchParams.get("limit");
    const limit = limitP ? parseInt(limitP) : 0;
    const src = searchParams.get("src");
    const status = searchParams.get("status");
    return getMessages(limit, src, status);
}

function getMessages(limit: number, src?: string | null, status?: string | null) {
    const messages: BTPMessage[] = new Array<BTPMessage>();
    for (let i = 0; i < limit; i++)
        messages.push(getMessage(i, src, status));
    return NextResponse.json({"list": messages, "total_pages": 15});
}
