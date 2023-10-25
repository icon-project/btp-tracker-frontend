import {BTPEvent, BTPMessage} from "@/app/data/BTPMessage";

export default async function Page({params}: { params: { params: string[] } }) {
    const p = params["params"];
    if (!p || p.length > 2 || p.length == 0) throw Error("invalid request. param length must be 1 or 2");
    const reqUri = p.length == 1 ?
        `${process.env.API_URI}/tracker/bmc/status/${p[0]}?task=status`
        : `${process.env.API_URI}/tracker/bmc/search?query[src]=${p[0]}&query[nsn]=${p[1]}`;
    const res = await fetch(reqUri);
    console.log(res);
    const message: BTPMessage = await res.json();
    const events: BTPEvent[] = message.btp_events!;
    return (
        <section>
            <h2 className="text-4xl text-center mt-7">BTP Message</h2>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <MessageDetail message={message}/>
                    <EventList events={events}/>
                </div>
            </div>
        </section>
    )
}

function MessageDetail({message}: { message: BTPMessage }) {
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
                        src
                    </th>
                    <td scope="col" className={cellClass}>
                        {message.src}
                    </td>
                    <th scope="col" className={headerClass}>
                        nsn
                    </th>
                    <td scope="col" className={cellClass}>
                        {message.nsn}
                    </td>
                </tr>
                <tr className="bg-white border-2">
                    <th scope="row" className={headerClass}>
                        status
                    </th>
                    <td className={cellClass}>
                        {message.status?.String}
                    </td>
                    <th scope="col" className={headerClass}>
                        last occurred
                    </th>
                    <td className={cellClass}>
                        {message.last_network_address?.String}
                    </td>
                </tr>
                <tr className="bg-white border-2">
                    <th scope="row" className={headerClass}>
                        finalized
                    </th>
                    <td className={cellClass}>
                        {message.finalized ? "true" : "false"}
                    </td>
                    <th scope="col" className={headerClass}>
                        last updated
                    </th>
                    <td scope="col" className={cellClass}>
                        {message.updated_at}
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    );
}

function EventList({events}: { events: BTPEvent[] }) {
    const cellClass = "pl-2 py-2 font-light";
    const headerClass = cellClass + " bg-gray-100 text-gray-400";
    return (
        <>
            <table className="w-full text-left">
                <caption className="text-left text-lg text-gray-400 mb-2">Message delivery</caption>
                <thead className="bg-gray-100">
                <tr className="border-2">
                    <th scope="col" className={headerClass}>
                        occurred at
                    </th>
                    <th scope="col" className={headerClass}>
                        event
                    </th>
                    <th scope="col" className={headerClass}>
                        next
                    </th>
                    <th scope="col" className={headerClass}>
                        created
                    </th>
                </tr>
                </thead>
                <tbody>
                {events && events.map(
                    (btpEvent) => (
                        <>
                            <tr key={btpEvent.id} className="bg-white border-2">
                                <td className={cellClass}>
                                    {btpEvent.network_address}
                                </td>
                                <td className={cellClass}>
                                    {btpEvent.event}
                                </td>
                                <td className={cellClass}>
                                    {btpEvent.next}
                                </td>
                                <td className={cellClass}>
                                    {btpEvent.created_at}
                                </td>
                            </tr>
                        </>
                    )
                    )}
                </tbody>
            </table>
        </>
    )
}
