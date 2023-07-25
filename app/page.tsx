import Link from "next/link";
import {MessageTable} from "@/app/messages/page";

export default function Home() {
    return (
        <>
            <div className="m-10 flex items-center justify-center">
                <div className="w-3/4 flex flex-wrap">
                    <Summaries/>
                    <MessageTable optionalClasses={"mt-7"}/>
                    <div className="w-full bg-gray-100 text-center text-2xl text-[#27aab9]">
                        <Link href={"/messages"}>more</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

function Summaries() {
    return (
        <>
            <Summary summary={{"network": "0xaa36a7.eth2", "total": "200"}}/>
            <Summary summary={{"network": "0x61.bsc", "total": "100"}}/>
            <Summary summary={{"network": "0x111.icon", "total": "300"}}/>
        </>
    )
}

function Summary({summary} : {summary: {[keys: string]: string}}) {
    return (
        <div className="w-1/3 p-3 text-xl text-right border p-10">
            <Link href="/messages?net=eth" className="text-[#27aab9]">{summary["network"]}</Link><br/>
            <span className={"text-2xl font-medium"}>{summary["total"]} messages</span>
        </div>
    )
}