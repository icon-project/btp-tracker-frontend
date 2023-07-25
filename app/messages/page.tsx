"use client";
import {useRouter} from "next/navigation";
import SelectFilter from "@/app/components/SelectFilter";
import {PageNation} from "@/app/components/PageNation";

export default function Page() {
    const statusOptions = {
        "all": "status",
        "send": "SEND",
        "receive": "RECEIVE",
    };
    const networks = {
        "all": "network",
        "0xaa36a7.eth2": "0xaa36a7.eth2",
        "0x61.bsc": "0x61.bsc",
        "0x111.icon": "0x111.icon",
    };
    const columns = {
        "25": "25",
        "50": "50",
        "100": "100"
    };
    return (
        <section>
            <h2 className="text-4xl text-center mt-7">BTP Messages</h2>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <div className="flex flex-row-reverse">
                        <SelectFilter options={statusOptions}/>
                        <SelectFilter options={networks} optionalClasses={"mr-2"}/>
                    </div>
                    <MessageTable/>
                    <nav className="flex justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-400">show
                            <SelectFilter options={columns}/>
                        </span>
                        <PageNation/>
                    </nav>
                </div>
            </div>
        </section>
    )
}

export function MessageTable({optionalClasses} : {optionalClasses?: string}) {
    const commonClass = "w-full text-xl text-left";
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
            <tr className="cursor-pointer bg-white border-2 hover:bg-gray-200" tabIndex={0}
                onClick={() => router.push("/message")}>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                    0x61.bsc
                </td>
                <td className="px-6 py-4">
                    100
                </td>
                <td className="px-6 py-4">
                    SEND
                </td>
                <td className="px-6 py-4">
                    false
                </td>
                <td className="px-6 py-4">
                    2023-07-20:00:00:00
                </td>
            </tr>
            </tbody>
        </table>
    )
}
