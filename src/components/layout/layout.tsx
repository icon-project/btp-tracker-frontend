import {ReactNode} from 'react';
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import NetworkInfoProvider from "../../utils/NetworkInfo.tsx";

export default function Layout({children}: { children?: ReactNode }) {
    return (
        <NetworkInfoProvider>
            <div className={"min-h-screen flex flex-col"}>
                <Header/>
                <div className="w-full flex-col">
                    {children}
                </div>
                <Footer/>
            </div>
        </NetworkInfoProvider>
    )
}