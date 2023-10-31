'use client'
import { useEffect, useState } from 'react';
import ImgInfoContext from "@/app/context";
import {createRow} from "@tanstack/table-core";

export interface TrackerNetwork {
    name: string,
    address: string,
    type: string,
    imageBase64: string
}

export type NetworkMap = {
    [key: string]: TrackerNetwork;
}

const ImgInfoContextProvider = ({ children }: {children: React.ReactNode}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/tracker/bmc/network`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <ImgInfoContext.Provider value={data as any}>
            {children}
        </ImgInfoContext.Provider>
    );
};

export default ImgInfoContextProvider;
