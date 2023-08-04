import {BTPEvent, BTPMessage} from "@/app/data/BTPMessage";

export default async function Page({params}: { params: { params: string[] } }) {
    const p = params["params"];
    if (!p || p.length > 2 || p.length == 0) throw Error("invalid request. param length must be 1 or 2");
    const reqUri = p.length == 1 ? `${process.env.API_URI}/api/ui/btp/status/${p[0]}` : `${process.env.API_URI}/api/ui/btp/search?source=${p[0]}&nsn=${p[1]}`;
    const res = await fetch(reqUri);
    console.log(res);
    const message: BTPMessage = await res.json();
    const events: BTPEvent[] = message.events!;
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
    const messageEvent = message.events!;
    const lastOccurred = messageEvent[messageEvent.length - 1].occurredIn;
    return (
        <>
            <table className="w-full text-xl text-left mb-10">
                <caption className="text-left text-lg font-bold mb-2">Message</caption>
                <tbody>
                <tr className="bg-white border-2">
                    <th scope="col" className="bg-gray-100 px-6 py-3">
                        src
                    </th>
                    <td scope="col" className="px-6 py-3">
                        {message.src}
                    </td>
                    <th scope="col" className="bg-gray-100 px-6 py-3">
                        nsn
                    </th>
                    <td scope="col" className="px-6 py-3">
                        {message.nsn}
                    </td>
                </tr>
                <tr className="bg-white border-2">
                    <th scope="row" className="bg-gray-100 px-6 py-3">
                        status
                    </th>
                    <td className="px-6 py-3">
                        {message.status}
                    </td>
                    <th scope="col" className="bg-gray-100 px-6 py-3">
                        last occurred
                    </th>
                    <td scope="col" className="px-6 py-3">
                        {lastOccurred}
                    </td>
                </tr>
                <tr className="bg-white border-2">
                    <th scope="row" className="bg-gray-100 px-6 py-3">
                        finalized
                    </th>
                    <td className="px-6 py-4">
                        {message.finalized ? "true" : "false"}
                    </td>
                    <th scope="col" className="bg-gray-100 px-6 py-3">
                        last updated
                    </th>
                    <td scope="col" className="px-6 py-3">
                        {message.lastUpdated}
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    );
}

function EventList({events}: { events: BTPEvent[] }) {
    return (
        <>
            <table className="w-full text-xl text-left">
                <caption className="text-left text-lg font-bold mb-2">Message delivery</caption>
                <thead className="bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        occurred at
                    </th>
                    <th scope="col" className="px-6 py-3">
                        event
                    </th>
                    <th scope="col" className="px-6 py-3">
                        next
                    </th>
                    <th scope="col" className="px-6 py-3">
                        created
                    </th>
                </tr>
                </thead>
                <tbody>
                {events && events.map(
                    (btpEvent) => (
                        <>
                            <tr key={btpEvent.id} className="bg-white border-2">
                                <td className="px-6 py-4">
                                    {btpEvent.occurredIn}
                                </td>
                                <td className="px-6 py-4">
                                    {btpEvent.event}
                                </td>
                                <td className="px-6 py-4">
                                    {btpEvent.next}
                                </td>
                                <td className="px-6 py-4">
                                    {btpEvent.createdAt}
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
