import { useEffect, useState } from 'react';
import NetworkInfoContext from "./context";

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
        fetch(`${import.meta.env.VITE_API_URL}/tracker/bmc/network`)
            .then((response) => response.json())
            .then((data) => {
                const nMap: NetworkMap = {};
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
