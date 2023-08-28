'use client'
import Link from "next/link";
import "../globals.css";
import SearchButton from "@/app/components/SearchButton";
import {Summary} from "@/app/page";
import {Portal} from "@/app/components/Portal";
import React, {useState} from "react";
import SearchForm from "@/app/components/SearchForm";

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
            <div id={"modal-root"}/>
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

function ModalSearchForm({options, closeModal}: {options?: Summary[], closeModal: any}) {
    return (
        <Portal>
            <div onClick={() => {closeModal()}} className="justify-center items-center flex fixed inset-0 z-50">
                <div onClick={(e) => e.stopPropagation()} className="content-center">
                    <SearchForm options={options}/>
                </div>
            </div>
        </Portal>
    )
}
