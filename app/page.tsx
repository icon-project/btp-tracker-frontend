import Link from "next/link";
import Image from "next/image";
import RefreshingTable from "@/app/components/RefreshingTable";
import SearchForm from "@/app/components/SearchForm";

const networkIconMap: {[key: string]: string} = {
    "0x7.icon": "/logos/icon.png",
    "0xaa36a7.eth2": "/logos/eth.png",
    "0x61.bsc": "/logos/bnb.png",
    "0x111.icon": "/logos/havah.png",
}

export interface Summary {
    networkName: string
    networkAddress: string,
    total: number,
    inDelivery: number,
    completed: number
}

export default async function Page() {
    try {
        const summaryRes = await fetch(`${process.env.API_URI}/api/ui/network/summary`, {cache: 'no-store'});
        const summaryJson = await summaryRes.json();
        return (
            <>
                <div className="flex justify-center bg-[#27aab9] pb-10">
                    <SearchForm options={summaryJson["list"]}/>
                </div>
                <Container>
                    <Summaries summaryList={summaryJson["list"]}/>
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
                summaryList && summaryList.map(summary => <Summary key={summary["networkAddress"]} summary={summary}/>)
            }
        </>
    )
}

function Summary({summary}: { summary: Summary }) {
    return (
        <div className="w-1/3 text-lg text-left border p-2">
            <Image className="rounded-full inline" src={networkIconMap[summary["networkAddress"]]}
                   alt={summary["networkAddress"]} width={30} height={30}/>
            <Link href={`/messages?network=${summary["networkAddress"]}`}
                  className="text-[#27aab9]"> {summary["networkName"]}</Link><br/>
            <hr className={"my-3"}/>
            <span>total message : {summary["total"]}</span><br/>
            <span>in delivery : {summary["inDelivery"]}</span><br/>
            <span>completed : {summary["completed"]}</span>
        </div>
    )
}
