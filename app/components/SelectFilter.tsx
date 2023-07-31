'use client'
import React, {useCallback, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function SelectFilter({options, query, optionalClasses} : {options: string[], query: string, optionalClasses?: string}) {
    const commonClasses = "w-25 p-2 mb-6 text-xl text-gray-900 rounded-lg bg-white";
    const className = optionalClasses? `${commonClasses} ${optionalClasses}` : commonClasses;
    const [Selected, setSelected] = useState(options[0]);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value == options[0]) {
                params.delete(name);
            } else {
                params.set(name, value)
            }

            return params.toString()
        },
        [searchParams, options]
    )
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value);
        const q = createQueryString(query, e.target.value);
        router.push(`${pathname}?${q}`);
    };
    return (
        <>
            <select className={className} onChange={handleSelect}>
                {
                    options.map((elem) =>
                        <option key={elem} value={elem}>{elem}</option>
                    )
                }
            </select>
        </>
    )
}
