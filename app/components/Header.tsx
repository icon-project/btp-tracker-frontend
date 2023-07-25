import Link from "next/link";
import "../globals.css";

export default function Header() {
    return (
        <header>
            <NaviBar/>
            <p className="text-5xl text-white bg-[#27aab9] text-center p-7">BTP Message Explorer</p>
            <SearchInput/>
        </header>
    )
}
export function NaviBar() {
    return (
        <nav className="border-gray-200 bg-[#27aab9]" aria-label="Main navigation">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="items-center">
                    <span className="self-center text-3xl font-semibold whitespace-nowrap text-white">Home</span>
                </Link>
            </div>
        </nav>
    )
}

export function SearchInput() {
    const options = [
        {"value": "0xaa36a7.eth2", "name": "0xaa36a7.eth2"},
        {"value": "0x61.bsc", "name": "0x61.bsc"},
        {"value": "0x111.icon", "name": "0x111.icon"},
    ]
    return (
        <div className="flex justify-center p-3 bg-[#27aab9] pb-20">
                <select className="text-xl bg-hsla border border-[#27aab9] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 text-white mr-1">
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <input type="text"
                       className="bg-hsla rounded-lg block pl-10 p-2.5 focus:bg-[#f0ffff] w-1/4 mr-1 placeholder:text-2xl placeholder:text-gray-150" placeholder="NSN" required/>
                <button type="submit"
                        className="h-full p-2.5 text-xl font-medium text-white bg-hsla rounded-lg">
                    <svg className="w-5 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
        </div>
    )
}