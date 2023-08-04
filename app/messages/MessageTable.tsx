'use client'
import {useRouter} from "next/navigation";
import {BTPMessage} from "@/app/data/BTPMessage";

const networkIconMap: {[key: string]: string} = {
    "0x7.icon": "/logos/icon.png",
    "0xaa36a7.eth2": "/logos/eth.png",
    "0x61.bsc": "/logos/bnb.png",
    "0x111.icon": "/logos/havah.png",
}

export function MessageTable({optionalClasses, messages}: { optionalClasses?: string, messages?: BTPMessage[] }) {
    const commonClass = "w-full text-sm text-left";
    const className = optionalClasses ? `${commonClass} ${optionalClasses}` : commonClass;
    const router = useRouter();
    return (
        <table className={className}>
            <caption className="text-left text-lg font-bold mb-1">messages</caption>
            <thead className="bg-gray-100 border-2">
            <tr>
                <th scope="col" className="px-6 py-3">
                    src
                </th>
                <th scope="col" className="px-6 py-3">
                    nsn
                </th>
                <th scope="col" className="px-6 py-3">
                    status
                </th>
                <th scope="col" className="px-6 py-3">
                    finalized
                </th>
                <th scope="col" className="px-6 py-3">
                    last updated
                </th>
            </tr>
            </thead>
            <tbody>
            {
                messages && messages.map(
                    (m) => (
                        <tr key={m.id} className="cursor-pointer bg-white border-2 hover:bg-gray-200" tabIndex={0}
                            onClick={() => router.push(`/message/${m.id}`)}>
                            <td scope="row" className="flex items-center px-6 py-4 font-medium whitespace-nowrap">
                                <img className="w-5 h-5 rounded-full" src={networkIconMap[m.src]} alt={m.src}/>
                                <div className="pl-3 text-base font-semibold">{m.src}</div>
                            </td>
                            <td className="px-6 py-4">
                                {m.nsn}
                            </td>
                            <td className="px-6 py-4">
                                {m.status}
                            </td>
                            <td className="px-6 py-4">
                                {m.finalized ? "true" : "false"}
                            </td>
                            <td className="px-6 py-4">
                                {m.lastUpdated}
                            </td>
                        </tr>
                    )
                )
            }
            </tbody>
        </table>
    )
}
