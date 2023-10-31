'use client'
import {MessageTable} from "@/app/messages/MessageTable";
import Link from "next/link";
import {BTPMessage} from "@/app/data/BTPMessage";
import {useEffect} from "react";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";

const fetchData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/tracker/bmc?task=status&page=0&size=15&sort=created_at desc`);
    return await response.json();
};
export default function RefreshingTable() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Table/>
        </QueryClientProvider>
    )
}

function Table() {
    const query = useQuery(
        ['data'],
        () => fetchData(),
        {keepPreviousData: true}
    );
    useEffect(() => {
        const refreshInterval = setInterval(async () => {
            await query.refetch();
        }, 2000);

        return () => {
            clearInterval(refreshInterval);
        };
    });
    if (!query.data) return (
        <>
            <div className="w-full bg-gray-100 text-center text-[#27aab9] mt-7">
                <Link href={"/messages"}>more ...</Link>
            </div>
        </>
    )
    const messages = query.data["content"] as BTPMessage[];
    return (
        <>
            <div className="w-full mt-7"></div>
            <MessageTable messages={messages}/>
            <div className="w-full bg-gray-100 text-center text-[#27aab9]">
                <Link href={"/messages"}>more ...</Link>
            </div>
        </>
    );
}
