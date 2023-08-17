import Link from "next/link";
import "../globals.css";
import SearchForm from "@/app/components/SearchForm";

export default async function Header() {
    const title =<p className="text-5xl text-white bg-[#27aab9] text-center p-7">BTP Message Explorer</p>;
    try {
        const r = await fetch(`${process.env.API_URI}/api/ui/network/summary`, {cache: 'no-store'});
        const j = await r.json();
        return (
            <header>
                <NaviBar/>
                {title}
                <SearchForm options={j["list"]}/>
            </header>
        )
    } catch(error) {
        return (
            <header>
                <NaviBar/>
                {title}
                <SearchForm/>
            </header>
        )
    }

}
function NaviBar() {
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