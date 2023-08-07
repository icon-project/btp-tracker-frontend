'use client'
import {useRouter} from "next/navigation";

export default function SearchForm({options}: {options: {networkAddress: string}[]}) {
    const router = useRouter();
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const selectElement = document.querySelector("#searchSelect") as HTMLSelectElement;
        const inputElement = document.querySelector("#searchInput") as HTMLInputElement;
        const net = selectElement.value;
        const nsn = inputElement.value;
        router.push(`/message/${net}/${nsn}`);
    }
    return (
        <div className="flex justify-center p-3 bg-[#27aab9] pb-20">
            <form className={"flex w-full justify-center"} onSubmit={onSubmit}>
                <select className="text-xl bg-hsla border border-[#27aab9] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 text-white mr-1" id={"searchSelect"}>
                    {options.map((option) => (
                        <option key={option.networkAddress} value={option.networkAddress}>
                            {option.networkAddress}
                        </option>
                    ))}
                </select>
                <input type="text"
                       className="bg-hsla rounded-lg block pl-10 p-2.5 focus:bg-[#f0ffff] w-1/4 mr-1 placeholder:text-2xl placeholder:text-gray-150" placeholder="NSN" required id={"searchInput"}/>
                <button type="submit"
                        className="h-full p-2.5 text-xl font-medium text-white bg-hsla rounded-lg">
                    <svg className="w-5 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </form>
        </div>
    )
}