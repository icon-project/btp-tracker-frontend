'use client'

import {usePathname} from "next/navigation";

export default function SearchButton({openModal}: {openModal: any}) {
    const path = usePathname();

    const onSearchButton = () => {
        if (path !== "/") {
            openModal();
        }
        const searchInput = document.querySelector("#searchInput") as HTMLInputElement
        searchInput?.focus();
    }
    return (
        <button type="button"
                className="h-full p-2.5 text-xl font-medium text-white bg-hsla rounded-lg" onClick={() => onSearchButton()}>
            <svg className="w-5 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
        </button>
        )
}
