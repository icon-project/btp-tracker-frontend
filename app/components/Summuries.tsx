'use client'
import Image from "next/image";
import Link from "next/link";
import {useContext} from "react";
import NetworkInfoContext from "@/app/context";

export interface Summary {
    network_name: string
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
    const networkInfo = useContext(NetworkInfoContext);
    if(Object.keys(networkInfo).length === 0) return (<div></div>)
    return (
        <div className="w-1/3 text-lg text-left border p-2">
            <Image className="rounded-full inline" src={`data:image/png;base64,${networkInfo[summary["network_name"]].imageBase64}`}
               alt={summary["network_address"]} width={30} height={30}/>
            <Link href={`/messages?network=${summary["network_address"]}`} className="text-[#27aab9]"> {summary["network_name"]}</Link><br/>
            <hr className={"my-3"}/>
            <span>total message : {summary["status_total"]}</span><br/>
            <span>in delivery : {summary["status_in_delivery"]}</span><br/>
            <span>completed : {summary["status_completed"]}</span>
        </div>
    )
}
