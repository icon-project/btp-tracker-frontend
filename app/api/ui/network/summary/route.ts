import { NextResponse } from 'next/server';

const networks:[string, string][] = [["0x7.icon", "icon"], ["0xaa36a7.eth2", "eth2"], ["0x61.bsc","bsc"], ["0x111.icon", "havah"]];
export async function GET() {
    return NextResponse.json({"list": getSummaries()})
}

function getSummaries() {
    return networks.map((value, index) => getSummary(index));
}

function getSummary(id: number) {
    return {
        networkName: networks[id][1],
        networkAddress: networks[id][0],
        total: (id+1) * 100,
        inDelivery: (id+1) * 50,
        completed: (id+1) * 50
    }
}
