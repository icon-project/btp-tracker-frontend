import Link from "next/link";
import Image from "next/image";
import RefreshingTable from "@/app/components/RefreshingTable";
import SearchForm from "@/app/components/SearchForm";
import Summaries from "@/app/components/Summuries";

interface TrackerNetwork {
    name: string,
    address: string,
    type: string,
    image_base64: string
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
