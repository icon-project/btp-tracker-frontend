'use client'
import {usePathname, useRouter} from "next/navigation";
import {useContext} from "react";
import {Summary} from "@/app/components/Summuries";
import NetworkInfoContext from "@/app/context";

export default function SearchForm({options, onSubmitAction}: {options?: Summary[], onSubmitAction?: () => void}) {
    const nMap = useContext(NetworkInfoContext);
    const router = useRouter();
    const autoFocus = usePathname() !== "/";
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const selectElement = document.querySelector("#searchSelect") as HTMLSelectElement;
        const inputElement = document.querySelector("#searchInput") as HTMLInputElement;
        const net = selectElement.value;
        const nsn = inputElement.value;
        router.push(`/message/${net}/${nsn}`);
        if (!!onSubmitAction) onSubmitAction();
    }
    return (
            <form className={"flex w-full justify-center"} onSubmit={onSubmit}>
                <select className="text-xl bg-[#85dbe5] border border-[#27aab9] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 text-white mr-1" id={"searchSelect"}>
                    {options && options.map((option) => (
                        <option key={option.network_address} value={option.network_address}>
                            {nMap[option.network_address]?.name}
                        </option>
                    ))}
                </select>
                <input type="text" pattern="0|[1-9][0-9]*"
                       className="bg-[#85dbe5] rounded-lg block pl-10 p-2.5 focus:bg-[#f0ffff] w-1/4 mr-1 placeholder:text-2xl placeholder:text-gray-150"
                       placeholder="Network Serial Number"
                       required
                       id={"searchInput"}
                       autoFocus={autoFocus}
                       onInvalid={e => (e.target as HTMLInputElement).setCustomValidity("Enter valid NSN")}
                       onInput={e => (e.target as HTMLInputElement).setCustomValidity("")}
                />
                <button type="submit"
                        className="h-full p-2.5 text-xl font-medium text-white bg-[#85dbe5] rounded-lg">
                    <svg className="w-5 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </form>
    )
}