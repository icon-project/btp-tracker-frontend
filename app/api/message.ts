import {BTPEvent, BTPMessage} from "@/app/data/BTPMessage";

const statusArr = ["SEND", "RECEIVE", "ROUTE", "ERROR", "REPLY", "DROP"];
const finalizedArr = [true, false];
const networks = ["0x7.icon", "0xaa36a7.eth2", "0x61.bsc", "0x111.icon"];

export function getMessage(id: number, srcParam?: string | null, statusParam?: string | null): BTPMessage {
    const date = new Date();
    const src = srcParam ? srcParam : networks[id % 4];
    const status = statusParam ? statusParam : statusArr[id % 6];
    const lastNetwork = status === statusArr[2] ? networks[0] : "";
    return {
        id: id,
        src: src,
        nsn: `${id}`,
        finalized: finalizedArr[id % 2],
        lastUpdated: date.toLocaleString(),
        status,
        lastNetwork,
        events: getDelivery(src, id)
    };
}

function getDelivery(src: string, nsn: number) {
    const delivery: BTPEvent[] = [];
    const id = nsn;
    const event1 = <BTPEvent>{
        id,
        src,
        nsn,
        next: networks[id % 4],
        event: statusArr[0],
        occurredIn: src,
        createdAt: new Date().toLocaleString(),
    }
    const event2 = <BTPEvent>{
        id: id+1,
        src,
        nsn,
        event: statusArr[1],
        occurredIn: networks[id%4],
        createdAt: new Date().toLocaleString(),
    }
    delivery.push(event1);
    delivery.push(event2);
    return delivery;
}