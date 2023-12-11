import "../../index.css";
import {Portal} from "./Portal";
import {useContext, useState} from "react";
import SearchForm from "./SearchForm";
import {Link, useLocation} from "react-router-dom";
import NetworkInfoContext from "../../utils/context.tsx";

export default function Header() {
    const title = <p className="text-5xl text-white bg-[#27aab9] text-center p-7">BTP Message Explorer</p>;
    const [isOpen, setIsOpen] = useState(false);
    const nMap = useContext(NetworkInfoContext);
    function handleOpenModal() {
        setIsOpen(true);
    }
    function handleCloseModal() {
        setIsOpen(false);
    }
    if (Object.keys(nMap).length === 0) return <NaviBar handleOpenModal={handleOpenModal}/>;
    return (
        <>
            <div id={"modal-root"} className={"flex"}/>
            {isOpen && <ModalSearchForm options={Object.keys(nMap)} closeModal={handleCloseModal}/>}
            <NaviBar handleOpenModal={handleOpenModal}/>
            {title}
        </>
    )
}

function NaviBar({handleOpenModal}: {handleOpenModal: () => void}) {
    return (
        <nav className="border-gray-200 bg-[#27aab9]" aria-label="Main navigation">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="items-center">
                    <span className="self-center text-3xl font-semibold whitespace-nowrap text-white">Home</span>
                </Link>
                <SearchButton openModal={handleOpenModal}/>
            </div>
        </nav>
    )
}

function SearchButton({openModal}: {openModal: () => void}) {
    const path = useLocation();

    const onSearchButton = () => {
        if (path.pathname !== "/") {
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

function ModalSearchForm({options, closeModal}: {options: string[], closeModal: () => void}) {
    return (
        <Portal>
            <div onClick={() => {closeModal()}} className="justify-center fixed inset-0 z-10 bg-gray-100 bg-opacity-40">
                <div className={"flex h-1/6"}></div>
                <div onClick={(e) => e.stopPropagation()}>
                    <SearchForm options={options} onSubmitAction={closeModal}/>
                </div>
            </div>
        </Portal>
    )
}
