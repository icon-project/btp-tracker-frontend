'use client'
import Image from "next/image";
import Link from "next/link";
import {useContext} from "react";
import NetworkInfoContext from "@/app/context";

export interface Summary {
    network_address: string,
    status_total: number,
    status_in_delivery: number,
    status_completed: number
}
export default function Summaries({summaryList}: { summaryList?: Summary[] }) {
    return (
        <>
            {
                summaryList && summaryList.map(summary => <Summary key={summary["network_address"]} summary={summary}/>)
            }
        </>
    )
}

function Summary({summary}: { summary: Summary }) {
    const nMap = useContext(NetworkInfoContext);
    if(Object.keys(nMap).length === 0) return (<div></div>)
    return (
        <div className="w-1/3 text-lg text-left border p-2">
            <Image className="rounded-full inline" src={`data:image/png;base64,${nMap[summary["network_address"]].imageBase64}`}
               alt={summary["network_address"]} width={30} height={30}/>
            <Link href={`/messages?network=${summary["network_address"]}`} className="text-[#27aab9]"> {nMap[summary["network_address"]].name} ({nMap[summary["network_address"]].address})</Link><br/>
            <hr className={"my-3"}/>
            <span className="p-5">Total message : {summary["status_total"]}</span><br/>
            <span className="p-5">In Delivery : {summary["status_in_delivery"]}</span><br/>
            <span className="p-5">Completed : {summary["status_completed"]}</span>
        </div>
    )
}
