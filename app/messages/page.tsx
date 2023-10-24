import {Summary} from "@/app/page";
import React from "react";
import {MessageTableWithFilter} from "@/app/messages/MessageTable";
export default async function Page({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
    try {
        const networkOptions = await getNetworkOptions();
        let net = networkOptions.filter(m => searchParams["network"] == m)[0] ?? "source network";
        return (
            <Container>
                <MessageTableWithFilter networkOptions={networkOptions} selected={net}/>
            </Container>
        )
    } catch(error) {
        return <Container/>
    }
}

function Container({children}: {children?: React.ReactNode}) {
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

export async function getNetworkOptions() {
    const summaryRes = await fetch(`${process.env.API_URI}/tracker/bmc/summary`, {cache: 'no-store'});
    const summaryJson = await summaryRes.json();
    const summaries = summaryJson as Summary[];
    const options: string[] = ["source network"];
    for (let i = 0; i < summaries.length; i++) options.push(summaries[i].network_address);
    return options;
}
