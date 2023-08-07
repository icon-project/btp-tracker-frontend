import Link from "next/link";
import {MessageTable} from "@/app/messages/MessageTable";
import {BTPMessage} from "@/app/data/BTPMessage";

const networkIconMap: {[key: string]: string} = {
    "0x7.icon": "/logos/icon.png",
    "0xaa36a7.eth2": "/logos/eth.png",
    "0x61.bsc": "/logos/bnb.png",
    "0x111.icon": "/logos/havah.png",
}

interface Summary {
    networkName: string
    networkAddress: string,
    total: number,
    inDelivery: number,
    completed: number
}

export default async function Home() {
    const messagesRes = await fetch(`${process.env.API_URI}/api/ui/btp/status/latest?sort=updatedAt&sortDesc=desc&limit=15`, {cache: 'no-store'});
    const messagesJson = await messagesRes.json();
    const btpMessages = messagesJson["list"] as BTPMessage[];
    const summaryRes = await fetch(`${process.env.API_URI}/api/ui/network/summary`, {cache: 'no-store'});
    const summaryJson = await summaryRes.json();
    return (
        <>
            <div className="m-10 flex items-center justify-center">
                <div className="w-3/4 flex flex-wrap">
                    <Summaries summaryList={summaryJson["list"]}/>
                    <MessageTable optionalClasses={"mt-7"} messages={btpMessages}/>
                    <div className="w-full bg-gray-100 text-center text-2xl text-[#27aab9]">
                        <Link href={"/messages"}>more</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

function Summaries({summaryList} : {summaryList: Summary[]}) {
    return (
        <>
        {
            summaryList && summaryList.map(summary => <Summary key={summary["networkAddress"]} summary={summary}/>)
        }
        </>
    )
}

function Summary({summary} : {summary: Summary}) {
    return (
        <div className="w-1/3 text-xl text-left border p-10">
            <img className="w-5 h-5 rounded-full inline" src={networkIconMap[summary["networkAddress"]]} alt={summary["networkAddress"]}/>
            <Link href="/messages" className="text-[#27aab9]"> {summary["networkName"]}</Link><br/>
            <span className={"text-2xl font-medium"}>total : {summary["total"]}</span><br/>
            <span className={"text-2xl font-medium"}>in delivery : {summary["inDelivery"]}</span><br/>
            <span className={"text-2xl font-medium"}>completed : {summary["completed"]}</span>
        </div>
    )
}