import { NextResponse } from 'next/server';
import {getMessage} from "@/app/api/message";

const networks = ["0x7.icon", "0xaa36a7.eth2", "0x61.bsc", "0x111.icon"];
export async function GET() {
    return NextResponse.json({"list": getSummaries()})
}

function getSummaries() {
    return networks.map((value, index) => getSummary(index));
}

function getSummary(id: number) {
    return {
        networkName: networks[id].split(".")[1],
        networkAddress: networks[id],
        total: (id+1) * 100,
        inDelivery: (id+1) * 50,
        completed: (id+1) * 50
    }
}
