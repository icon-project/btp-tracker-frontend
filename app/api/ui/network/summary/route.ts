import { NextResponse } from 'next/server';
import {getMessage} from "@/app/api/message";

export async function GET(request: Request, { params }: { params: { params : string[] } }) {
}

function getSummaries(limit: number, src?: string | null, status?: string | null) {
}
