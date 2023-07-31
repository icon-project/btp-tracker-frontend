import { NextResponse } from 'next/server';
import {getMessage} from "@/app/api/message";
import {Message} from "@/app/messages/MessageTable";

export async function GET(request: Request) {
    const { searchParams, search } = new URL(request.url);
    const limitP = searchParams.get("limit");
    const limit = limitP ? parseInt(limitP) : 0;
    const net = searchParams.get("network");
    const status = searchParams.get("status");
    const messages: Message[] = new Array<Message>();
    for (let i = 0; i < limit; i++)
        messages.push(getMessage(i, net, status));
    return NextResponse.json({"rows": messages});
}