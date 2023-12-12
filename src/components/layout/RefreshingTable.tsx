import {MessageTable} from "./MessageTable";
import {BTPMessage} from "../../data/BTPMessage";
import {useEffect} from "react";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {Link} from "react-router-dom";

const fetchData = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tracker/bmc?task=status&page=0&size=15&sort=created_at desc`);
    return await response.json();
};
export default function RefreshingTable() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <TableCom/>
        </QueryClientProvider>
    )
}

function TableCom() {
    const query = useQuery(
        ['data'],
        () => fetchData(),
        {keepPreviousData: true}
    );
    useEffect(() => {
        const refreshInterval = setInterval(async () => {
            await query.refetch();
        }, 2000);

        return () => {
            clearInterval(refreshInterval);
        };
    });
    if (!query.data) return (
        <>
            <div className="w-full bg-gray-100 text-center text-[#27aab9] mt-7">
                <Link to={"/messages"}>more ...</Link>
            </div>
        </>
    )
    const messages = query.data["content"] as BTPMessage[];
    return (
        <>
            <div className="w-full mt-7"></div>
            <MessageTable messages={messages}/>
            <div className="w-full bg-gray-100 text-center text-[#27aab9]">
                <Link to={"/messages"}>more ...</Link>
            </div>
        </>
    );
}
