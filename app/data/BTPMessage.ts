export interface BTPEvent {
    id: number,
    src: string,
    nsn: number,
    next: string,
    event: string,
    occurredIn: string,
    createdAt: string,
}

export interface BTPMessage {
    id: number,
    src: string,
    nsn: string,
    status: string,
    finalized: boolean,
    lastUpdated: string,
    events?: BTPEvent[],
}