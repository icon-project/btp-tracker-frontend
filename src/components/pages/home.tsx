import SearchForm from "../layout/SearchForm.tsx";
import Summaries, {Summary} from "../layout/Summuries.tsx";
import {useLoaderData} from "react-router-dom";
import Layout from "../layout/layout.tsx";
import RefreshingTable from "../layout/RefreshingTable.tsx";

export default function Home() {
    const summaryJson = useLoaderData() as Summary[];
    const options = summaryJson.map(s => s.network_address);
    return (
        <Layout>
            <div className="flex justify-center bg-[#27aab9] pb-10">
                <SearchForm options={options}/>
            </div>
            <Container>
                <Summaries summaryList={summaryJson}/>
                <RefreshingTable/>
            </Container>
        </Layout>
    )
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
