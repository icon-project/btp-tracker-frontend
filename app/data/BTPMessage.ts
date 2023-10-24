export interface BTPEvent {
    id: number,
    src: string,
    nsn: number,
    next: string,
    event: string,
    network_name: string,
    network_address: string,
    event_id: string,
    tx_hash: string,
    finalized: boolean,
    created_at: string,
    updated_at: string,
}

export interface BTPMessage {
    id: number,
    src: string,
    nsn: string,
    status: {
        String: string,
        Valid: boolean
    },
    finalized: boolean,
    last_network_name: {
        String: string,
        Valid: boolean
    },
    last_network_address: {
        String: string,
        Valid: boolean
    },
    links: {
        String: string,
        Valid: boolean
    },
    created_at: string,
    updated_at: string,
    btp_events?: BTPEvent[],
}