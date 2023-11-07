import {BTPEvent, BTPMessage} from "@/app/data/BTPMessage";
import {getElapsedTime} from "@/app/utils/util";

export default async function Page({params}: { params: { params: string[] } }) {
    const p = params["params"];
    if (!p || p.length > 2 || p.length == 0) throw Error("invalid request. param length must be 1 or 2");
    const reqUri = p.length == 1 ?
        `${process.env.API_URI}/tracker/bmc/status/${p[0]}?task=status`
        : `${process.env.API_URI}/tracker/bmc/search?query[src]=${p[0]}&query[nsn]=${p[1]}`;
    const res = await fetch(reqUri, {cache: 'no-store'});
    const message: BTPMessage = await res.json();
    const links: number[] = JSON.parse(message.links.String);
    // Array of BTPEVent
    const events: BTPEvent[] = message.btp_events!;
    let btpMessageFinalized: boolean = true;
    for (let i = 0; i < events.length; i++) {
        if (!events[i].finalized) {
            btpMessageFinalized = false;
            break;
        }
    }
    return (
        <section>
            <h2 className="text-4xl text-center mt-7">BTP Message</h2>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <MessageDetail message={message} finalized={btpMessageFinalized}/>
                    <EventList events={events} links={links}/>
                </div>
            </div>
        </section>
    )
}

function MessageDetail({message, finalized}: { message: BTPMessage, finalized: boolean }) {
    const cellClass = "pl-2 py-2 font-light";
    const headerClass = cellClass + " bg-gray-100 text-gray-400";
    // @ts-ignore
    return (
        <>
            <table className="w-full text-left mb-10 table-fixed">
                <caption className="text-left text-lg text-gray-400 mb-2">Message</caption>
                <tbody>
                <tr className="bg-white border-2">
                    <th scope="col" className={headerClass}>
                        Source Network
                    </th>
                    <td scope="col" className={cellClass}>
                        {message.src}
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
                    <td className={cellClass}>
                        {message.last_network_address?.String}
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
                        Last updated
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

function EventList({events, links}: { events: BTPEvent[], links: number[] }) {
    const cellClass = "pl-2 py-2 font-light";
    const headerClass = cellClass + " bg-gray-100 text-gray-400";
    return (
        <>
            <table className="w-full text-left">
                <caption className="text-left text-lg text-gray-400 mb-2">Message delivery</caption>
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
                        Created
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    links && links.map(
                        (link) => {
                            return events && events.map((event) => {
                                if (link == event.id)
                                    return (<>
                                        <tr key={event.id} className="bg-white border-2">
                                            <td className={cellClass}>
                                                {event.network_address}
                                            </td>
                                            <td className={cellClass}>
                                                {event.event}
                                            </td>
                                            <td className={cellClass}>
                                                {event.next}
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
