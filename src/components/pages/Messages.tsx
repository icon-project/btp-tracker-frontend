import React from "react";
import {MessageTableWithFilter} from "../layout/MessageTable";
import {useLoaderData, useSearchParams} from "react-router-dom";
import {Summary} from "../layout/Summuries.tsx";
import {COL} from "../../utils";
import Layout from "../layout/layout.tsx";
export default function Page() {
    const summaries = useLoaderData() as Summary[];
    const networks = summaries.map(no => no.network_address);
    const options: string[] = [COL.SRC];
    options.push(...networks);
    const [searchParams] = useSearchParams({});
    const network = searchParams.get("network") || "";
    const net = options.filter(m => network == m)[0] ?? "src";
    return (
        <Layout>
            <Container>
                <MessageTableWithFilter networkOptions={options} selected={net}/>
            </Container>
        </Layout>
    )
}

function Container({children}: {children: React.ReactNode}) {
    return (
        <section>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <h3 className="text-xl text-left my-3 text-gray-500">BTP Messages</h3>
                    {children}
                </div>
            </div>
        </section>
    )
}
