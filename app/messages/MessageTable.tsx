'use client'
import {useRouter} from "next/navigation";
import {BTPMessage} from "@/app/data/BTPMessage";
import Image from "next/image";
import React from 'react';
import {Cell, getCoreRowModel, getPaginationRowModel, getSortedRowModel, Row} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";

const networkIconMap: { [key: string]: string } = {
    "0x7.icon": "/logos/icon.png",
    "0xaa36a7.eth2": "/logos/eth.png",
    "0x61.bsc": "/logos/bnb.png",
    "0x111.icon": "/logos/havah.png",
}

export function MessageTable({optionalClasses, messages}: { optionalClasses?: string, messages?: BTPMessage[] }) {
    const columns = React.useMemo(
        () => [
            {
                header: "src",
                accessorKey: "src",
            },
            {
                header: "nsn",
                accessorKey: "nsn"
            },
            {
                header: "status",
                accessorKey: "status"
            },
            {
                header: "finalized",
                accessorKey: "finalized"
            },
            {
                header: "last updated",
                accessorKey: "lastUpdated"
            },
        ],
        []
    );
    const data = React.useMemo(
        () => messages,
        [messages]
    ) as BTPMessage[];
    const commonClass = "w-full text-sm text-left";
    const className = optionalClasses ? `${commonClass} ${optionalClasses}` : commonClass;
    const router = useRouter();
    const tableInstance = useReactTable({
        columns, data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <table className={className}>
                <thead className="bg-gray-100 border-2">
                {tableInstance.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} scope="col" className="px-6 py-3">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {tableInstance.getRowModel().rows.map(row => (
                    <TableRow key={row.id} row={row}/>
                ))}
                </tbody>
            </table>
        </>
    );
}

function TableCell({cell, lastNetwork}: {cell: Cell<BTPMessage, any>, lastNetwork: string}) {
    const cellClass = "px-6 py-4";
    const imgCellClass = "flex items-center px-6 py-4 font-medium whitespace-nowrap";
    const value = cell.getValue() as string;
    return (
        <td key={cell.id} className={cell.column.id === 'src' ? imgCellClass : cellClass}>
            {(cell.column.id) === 'src' &&
                <Image className="rounded-full" alt={networkIconMap[value]}
                       src={networkIconMap[value]} width={30} height={30}/>}
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            {(cell.column.id) === "status" && (value === "ROUTE") && <span className="font-medium text-xs text-gray-400">({lastNetwork})</span>}
        </td>
    )
}

function TableRow({row}: {row: Row<BTPMessage>}) {
    const router = useRouter();
    return (
        <tr key={row.id} className="cursor-pointer bg-white border-2 hover:bg-gray-200" tabIndex={0}
            onClick={() => router.push(`/message/${row.id}`)}>
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} cell={cell} lastNetwork={row.original.lastNetwork}/>
            ))}
        </tr>
        )
}
