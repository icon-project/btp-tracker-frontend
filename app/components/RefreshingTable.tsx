'use client'
import useSWR from "swr";
import {MessageTable} from "@/app/messages/MessageTable";
import Link from "next/link";
import {BTPMessage} from "@/app/data/BTPMessage";
import {useEffect} from "react";

const fetchData = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
};
export default function RefreshingTable() {
    const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URI}/api/ui/btp/status/latest?sort=updatedAt&sortDesc=desc&limit=15`, fetchData);
    useEffect(() => {
        const refreshInterval = setInterval(async () => {
            await mutate();
        }, 2000);

        return () => {
            clearInterval(refreshInterval);
        };
    });
    if (!data) return(
        <>
            <div className="w-full bg-gray-100 text-center text-2xl text-[#27aab9]">
                <Link href={"/messages"}>more</Link>
            </div>
        </>
    )
    const messages = data["list"] as BTPMessage[];
    return (
        <>
            <MessageTable optionalClasses={"mt-7"} messages={messages}/>
            <div className="w-full bg-gray-100 text-center text-2xl text-[#27aab9]">
                <Link href={"/messages"}>more</Link>
            </div>
        </>
    );
}
