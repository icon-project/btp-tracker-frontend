import React from "react";
import {MessageTableWithFilter} from "@/app/messages/MessageTable";
import {Summary} from "@/app/components/Summuries";
import {getNetworkOptions} from "@/app/utils/util";
export default async function Page({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
    try {
        const networkOptions = await getNetworkOptions();
        let net = networkOptions.filter(m => searchParams["network"] == m)[0] ?? "src";
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
