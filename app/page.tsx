import Link from "next/link";
import Image from "next/image";
import RefreshingTable from "@/app/components/RefreshingTable";
import SearchForm from "@/app/components/SearchForm";

const networkIconMap: {[key: string]: string} = {
    "0x3.icon": "/logos/icon.png",
    "0x25d6efd.eth2": "/logos/eth.png",
    "0x63.bsc": "/logos/bnb.png",
    "0x111.icon": "/logos/havah.png",
}

export interface Summary {
    network_name: string
    network_address: string,
    status_total: number,
    status_in_delivery: number,
    status_completed: number
}

export default async function Page() {
    try {
        const summaryRes = await fetch(`${process.env.API_URI}/tracker/bmc/summary`, {cache: 'no-store'});
        const summaryJson = await summaryRes.json();
        return (
            <>
                <div className="flex justify-center bg-[#27aab9] pb-10">
                    <SearchForm options={summaryJson}/>
                </div>
                <Container>
                    <Summaries summaryList={summaryJson}/>
                    <RefreshingTable/>
                </Container>
            </>
        )
    } catch (error) {
        return (
            <>
                <div className="flex justify-center bg-[#27aab9] pb-10">
                    <SearchForm/>
                </div>
                <Container>
                    <Summaries/>
                </Container>
            </>
        )
    }
}

function Container({children}: { children: React.ReactNode }) {
    return (
        <>
            <div className="m-10 flex items-center justify-center">
                <div className="w-3/4 flex flex-wrap">
                    {children}
                </div>
            </div>
        </>
    )
}

function Summaries({summaryList}: { summaryList?: Summary[] }) {
    return (
        <>
            {
                summaryList && summaryList.map(summary => <Summary key={summary["network_address"]} summary={summary}/>)
            }
        </>
    )
}

function Summary({summary}: { summary: Summary }) {
    return (
        <div className="w-1/3 text-lg text-left border p-2">
            <Image className="rounded-full inline" src={networkIconMap[summary["network_address"]]}
                   alt={summary["network_address"]} width={30} height={30}/>
            <Link href={`/messages?network=${summary["network_address"]}`}
                  className="text-[#27aab9]"> {summary["network_name"]}</Link><br/>
            <hr className={"my-3"}/>
            <span>total message : {summary["status_total"]}</span><br/>
            <span>in delivery : {summary["status_in_delivery"]}</span><br/>
            <span>completed : {summary["status_completed"]}</span>
        </div>
    )
}
