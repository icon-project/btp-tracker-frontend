'use client'
import { useEffect, useState } from 'react';
import NetworkInfoContext from "@/app/context";

export interface TrackerNetwork {
    name: string,
    address: string,
    type: string,
    imageBase64: string
}

export type NetworkMap = {
    [key: string]: TrackerNetwork;
}

const NetworkInfoProvider = ({ children }: {children: React.ReactNode}) => {
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/tracker/bmc/network`)
            .then((response) => response.json())
            .then((data) => {
                let nMap: NetworkMap = {};
                data.map((net: TrackerNetwork) => (
                    nMap[net.address] = {
                        name: net.name,
                        address: net.address,
                        type: net.type,
                        imageBase64: net.imageBase64
                    }))
                setData(nMap);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <NetworkInfoContext.Provider value={data as any}>
            {children}
        </NetworkInfoContext.Provider>
    );
};

export default NetworkInfoProvider;
