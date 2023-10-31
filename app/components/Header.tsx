'use client'
import Link from "next/link";
import "../globals.css";
import {Portal} from "@/app/components/Portal";
import React, {useState} from "react";
import SearchForm from "@/app/components/SearchForm";
import {usePathname} from "next/navigation";
import {Summary} from "@/app/components/Summuries";

export default function Header({networkOptions}: {networkOptions?: Summary[]}) {
    const title = <p className="text-5xl text-white bg-[#27aab9] text-center p-7">BTP Message Explorer</p>;
    const [isOpen, setIsOpen] = useState(false);
    function handleOpenModal() {
        setIsOpen(true);
    }
    function handleCloseModal() {
        setIsOpen(false);
    }
    return (
        <>
            <div id={"modal-root"} className={"flex"}/>
            {isOpen && <ModalSearchForm options={networkOptions} closeModal={handleCloseModal}/>}
            <NaviBar handleOpenModal={handleOpenModal}/>
            {title}
        </>
    )
}

function NaviBar({handleOpenModal}: {handleOpenModal: () => void}) {
    return (
        <nav className="border-gray-200 bg-[#27aab9]" aria-label="Main navigation">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="items-center">
                    <span className="self-center text-3xl font-semibold whitespace-nowrap text-white">Home</span>
                </Link>
                <SearchButton openModal={handleOpenModal}/>
            </div>
        </nav>
    )
}

function SearchButton({openModal}: {openModal: () => void}) {
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
                className="h-full p-2.5 text-xl font-medium text-white bg-[#85dbe5] rounded-lg" onClick={() => onSearchButton()}>
            <svg className="w-5 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
        </button>
    )
}

function ModalSearchForm({options, closeModal}: {options?: Summary[], closeModal: () => void}) {
    return (
        <Portal>
            <div onClick={() => {closeModal()}} className="justify-center items-center flex fixed inset-0">
                <div onClick={(e) => e.stopPropagation()}>
                    <SearchForm options={options} onSubmitAction={closeModal}/>
                </div>
            </div>
        </Portal>
    )
}
