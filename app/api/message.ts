import {Message} from "@/app/messages/MessageTable";

export function getMessage(id: number, networkParm?: string | null, statusParam?: string | null): Message {
    const statusArr = ["SEND", "RECEIVE", "ROUTE", "ERROR", "REPLY", "DROP"];
    const finalizedArr = [true, false];
    const networks = ["0x7.icon", "0xaa36a7.eth2", "0x61.bsc", "0x111.icon"];
    const date = new Date();
    const network = networkParm ? networkParm : networks[id % 4];
    const status = statusParam ? statusParam : statusArr[id % 6];
    return <Message>{
        id: id,
        src: network,
        nsn: `${id}`,
        finalized: finalizedArr[id % 2],
        lastUpdated: date.toLocaleString(),
        status
    };
}