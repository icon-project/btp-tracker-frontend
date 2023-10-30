'use client'
import { useEffect, useState } from 'react';
import ImgInfoContext from "@/app/context";

const ImgInfoContextProvider = ({ children }: {children: React.ReactNode}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/ui/network/summary`)
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
