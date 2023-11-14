import {BTPEvent, BTPMessage} from "@/app/data/BTPMessage";
import {getElapsedTime, getNetworkIcon, getNetworkMap, getNetworkName} from "@/app/utils/util";
import {boolean} from "zod";
import {NetworkMap} from "@/app/NetworkInfo";
import Image from "next/image";
import React from "react";

export default async function Page({params}: { params: { params: string[] } }) {
    const nMap: NetworkMap = await getNetworkMap();

    const p = params["params"];
    if (!p || p.length > 2 || p.length == 0) throw Error("invalid request. param length must be 1 or 2");
    const reqUri = p.length == 1 ?
        `${process.env.API_URI}/tracker/bmc/status/${p[0]}?task=status`
        : `${process.env.API_URI}/tracker/bmc/search?query[src]=${p[0]}&query[nsn]=${p[1]}`;
    const res = await fetch(reqUri, {cache: 'no-store'});
    const message: BTPMessage = await res.json();
    const links: number[] = JSON.parse(message.links?.String);
    // Array of BTPEVent
    const events: BTPEvent[] = message.btp_events!;
    let btpMessageFinalized = events.every((event) => {
        return event.finalized
    })
    return (
        <section>
            <h2 className="text-4xl text-center mt-7">BTP Message Delivery</h2>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <MessageDetail message={message} finalized={btpMessageFinalized} nMap={nMap}/>
                    <EventList events={events} links={links} nMap={nMap}/>
                    <EventListUnlinked events={events} links={links} nMap={nMap}/>
                </div>
            </div>
        </section>
    )
}

function MessageDetail({message, finalized, nMap}: { message: BTPMessage, finalized: boolean, nMap: NetworkMap }) {
    const cellClass = "pl-7 py-2 font-light";
    const imgCellClass = "flex items-center px-6 py-2 font-medium whitespace-nowrap";
    const headerClass = cellClass + " bg-gray-100 text-gray-400";
    // @ts-ignore
    return (
        <>
            <table className="w-full text-left mb-10 table-fixed">
                <caption className="text-left text-lg text-gray-400 mb-2">Message Delivery Status</caption>
                <tbody>
                <tr className="bg-white border-2">
                    <th scope="col" className={headerClass}>
                        Source Network
                    </th>
                    <td scope="col" className={imgCellClass}>
                        <Image className="rounded-full pr-2" alt={message.src}
                               src={`data:image/png;base64,${getNetworkIcon(nMap, message.src)}`} width={30} height={30}/>
                        {getNetworkName(nMap, message.src)}
                    </td>
                    <th scope="row" className={headerClass}>
                    </th>
                    <td className={cellClass}>
                    </td>
                </tr>
                <tr className="bg-white border-2">
                    <th scope="col" className={headerClass}>
                        Serial Number
                    </th>
                    <td scope="col" className={cellClass}>
                        {message.nsn}
                    </td>
                    <th scope="col" className={headerClass}>
                        Last occurred
                    </th>
                    <td className={imgCellClass}>
                        <Image className="rounded-full pr-2" alt={message.last_network_address?.String}
                               src={`data:image/png;base64,${getNetworkIcon(nMap, message.last_network_address?.String)}`} width={30} height={30}/>
                        {getNetworkName(nMap, message.last_network_address?.String)}
                    </td>
                </tr>
                <tr className="bg-white border-2">
                    <th scope="row" className={headerClass}>
                        Status
                    </th>
                    <td className={cellClass}>
                        {message.status?.String} - Block({finalized ? "Finalized" : "Not Yet"})
                    </td>
                    <th scope="col" className={headerClass}>
                        Last Updated
                    </th>
                    <td scope="col" className={cellClass}>
                        {getElapsedTime(message.updated_at)}
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    );
}

function EventList({events, links, nMap}: { events: BTPEvent[], links: number[], nMap: NetworkMap }) {
    const cellClass = "pl-2 py-2 font-light";
    const imgCellClass = "flex items-center px-6 py-2 font-medium whitespace-nowrap";
    const headerClass = cellClass + " bg-gray-100 text-gray-400";
    return (
        <>
            <table className="w-full text-left mb-10">
                <caption className="text-left text-lg text-gray-400 mb-2">Message Delivery Events - Linked</caption>
                <thead className="bg-gray-100">
                <tr className="border-2">
                    <th scope="col" className={headerClass}>
                        From
                    </th>
                    <th scope="col" className={headerClass}>
                        Event
                    </th>
                    <th scope="col" className={headerClass}>
                        Next
                    </th>
                    <th scope="col" className={headerClass}>
                        Finalized
                    </th>
                    <th scope="col" className={headerClass}>
                        Updated
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    links && links.map(
                        (link) => {
                            return events && events.map((event) => {
                                if (link === event.id)
                                    return (<>
                                        <tr key={event.id} className="bg-white border-2">
                                            <td className={imgCellClass}>
                                                <Image className="rounded-full pr-2" alt={event.network_address}
                                                       src={`data:image/png;base64,${getNetworkIcon(nMap, event.network_address)}`} width={30} height={30}/>
                                                {getNetworkName(nMap, event.network_address)}
                                            </td>
                                            <td className={cellClass}>
                                                {event.event}
                                            </td>
                                            <td className={imgCellClass}>
                                                {event.next === '' ? '' :
                                                    <Image className="rounded-full pr-2" alt={event.next} src={`data:image/png;base64,${getNetworkIcon(nMap, event.next)}`} width={30} height={30} />}
                                                {getNetworkName(nMap, event.next)}
                                            </td>
                                            <td className={cellClass}>
                                                {event.finalized ? "Yes" : "Not Yet"}
                                            </td>
                                            <td className={cellClass}>
                                                {getElapsedTime(event.created_at)}
                                            </td>
                                        </tr>
                                    </>)
                            })
                        }
                    )
                }
                </tbody>
            </table>
        </>
    )
}

function EventListUnlinked({events, links, nMap}: { events: BTPEvent[], links: number[], nMap: NetworkMap }) {
    const cellClass = "pl-2 py-2 font-light";
    const imgCellClass = "flex items-center px-6 py-2 font-medium whitespace-nowrap";
    const headerClass = cellClass + " bg-gray-100 text-gray-400";
    if(!events.some((event) => {return !links.includes(event.id)})) {
        return (<></>);
    }

    return (
        <>
            <table className="w-full text-left">
                <caption className="text-left text-lg text-gray-400 mb-2">Message Delivery Events - Unlinked</caption>
                <thead className="bg-gray-100">
                <tr className="border-2">
                    <th scope="col" className={headerClass}>
                        From
                    </th>
                    <th scope="col" className={headerClass}>
                        Event
                    </th>
                    <th scope="col" className={headerClass}>
                        Next
                    </th>
                    <th scope="col" className={headerClass}>
                        Finalized
                    </th>
                    <th scope="col" className={headerClass}>
                        Updated
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    events && events.map(
                        (event) => {
                            if(!Array.isArray(links)) {
                                return (<></>)
                            } else {
                                if(!links.includes(event.id)){
                                    return (<>
                                        <tr key={event.id} className="bg-white border-2">
                                            <td className={imgCellClass}>
                                                <Image className="rounded-full pr-2" alt={event.network_address}
                                                       src={`data:image/png;base64,${getNetworkIcon(nMap, event.network_address)}`} width={30} height={30}/>
                                                {getNetworkName(nMap, event.network_address)}
                                            </td>
                                            <td className={cellClass}>
                                                {event.event}
                                            </td>
                                            <td className={imgCellClass}>
                                                {event.next === '' ? '' :
                                                    <Image className="rounded-full pr-2" alt={event.next} src={`data:image/png;base64,${getNetworkIcon(nMap, event.next)}`} width={30} height={30} />}
                                                {getNetworkName(nMap, event.next)}
                                            </td>
                                            <td className={cellClass}>
                                                {event.finalized ? "Yes" : "Not Yet"}
                                            </td>
                                            <td className={cellClass}>
                                                {getElapsedTime(event.created_at)}
                                            </td>
                                        </tr>
                                    </>)
                                }
                            }
                        }
                    )
                }
                </tbody>
            </table>
        </>
    )
}
