'use client'
import {useRouter} from "next/navigation";
import {BTPMessage} from "@/app/data/BTPMessage";
import Image from "next/image";
import React from 'react';
import {
    Cell, Column, ColumnFiltersState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    Row,
    Table
} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {QueryClient, QueryClientProvider, useQuery, UseQueryResult} from "react-query";

const networkIconMap: { [key: string]: string } = {
    "0x7.icon": "/logos/icon.png",
    "0xaa36a7.eth2": "/logos/eth.png",
    "0x61.bsc": "/logos/bnb.png",
    "0x111.icon": "/logos/havah.png",
}

interface BTPResponse {
    list: BTPMessage[],
    total_pages: number,
}

const queryClient = new QueryClient();

async function fetchData(options: {pageIndex: number, pageSize: number, columnFilters: ColumnFiltersState}): Promise<BTPResponse> {
    const firstFilter = options.columnFilters[0];
    const secondFilter = options.columnFilters[1];
    const optionalQuery = `${firstFilter?.value ? "&" + firstFilter.id + "=" + firstFilter.value : ""}${secondFilter?.value ? "&" + secondFilter.id + "=" + secondFilter.value:""}`;
    const req = `${process.env.NEXT_PUBLIC_API_URI}/api/ui/btp/status?page=${options.pageIndex}&limit=${options.pageSize}${optionalQuery}`;
    const res = await fetch(req, {cache: 'no-store'});
    return await res.json();
}

export function MessageTableWithFilter({networkOptions}: {networkOptions: string[]}) {
    return (
        <QueryClientProvider client={queryClient}>
            <FilterableMessageTable networkOptions={networkOptions}/>
        </QueryClientProvider>
    )
}

export function MessageTable({messages}: {messages: BTPMessage[]}) {
    const columns = Columns();
    const tableInstance = useReactTable({
        columns, data: messages,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    return (
        <Table tableInstance={tableInstance}/>
    );
}

function Columns() {
    return React.useMemo(
        () => [
            {
                header: "src",
                accessorKey: "src",
            },
            {
                header: "nsn",
                accessorKey: "nsn",
            },
            {
                header: "status",
                accessorKey: "status",
            },
            {
                header: "finalized",
                accessorKey: "finalized",
            },
            {
                header: "last updated",
                accessorKey: "lastUpdated",
            },
        ],
        []
    );
}

function FilterableMessageTable({networkOptions}: { networkOptions?: string[]}) {
    const statusOptions = ["", "SEND", "RECEIVE", "ROUTE", "ERROR", "REPLY", "DROP"];
    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 25,
        })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )
    const fetchDataOptions = {
        pageIndex,
        pageSize,
        columnFilters
    }
    const dataQuery = useQuery(
        ['data', fetchDataOptions],
        () => fetchData(fetchDataOptions),
        {keepPreviousData: true}
    );
    const columns = Columns();
    const defaultData = React.useMemo(() => [], []);
    const tableInstance = useReactTable({
        columns, data: dataQuery.data?.list?? defaultData,
        getCoreRowModel: getCoreRowModel(),
        pageCount: dataQuery.data?.total_pages ?? -1,
        state: {
            pagination,
            columnFilters,
        },
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
    });
    return (
        <>
            <Table tableInstance={tableInstance} statusOptions={statusOptions} srcOptions={networkOptions}/>
            <TableFooter tableInstance={tableInstance} dataQuery={dataQuery}/>
        </>
    );
}

function Table({tableInstance, statusOptions, srcOptions}: {tableInstance: Table<BTPMessage>, statusOptions?: string[], srcOptions?: string[]}) {
    return (
        <>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-2">
                {tableInstance.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} scope="col" className="px-6 py-3">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.id === "src" && !!srcOptions ? <ColumnFilter column={header.column} options={srcOptions}/> :
                                    null}
                                {header.column.id === "status" && !!statusOptions ? <ColumnFilter column={header.column} options={statusOptions}/> :
                                    null}
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
    )
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

function ColumnFilter({options, column}: {options: string[], column: Column<any>}) {
    return (
        <select onChange={e => column.setFilterValue(e.target.value)}>
            {
                options.map((elem) =>
                    <option key={elem} value={elem} className={"text-xs font-light"}>{elem}</option>
                )
            }
        </select>
    )
}

function TableFooter({tableInstance, dataQuery}: {tableInstance: Table<BTPMessage>, dataQuery: UseQueryResult<BTPResponse>}) {
    const commonClass = "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ";
    const linkClass = `${commonClass}hover:bg-gray-100 hover:text-gray-700`;
    const pageLimitOptions = [25, 50, 100];
    return (
        <nav className="flex justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-400">show
                            <select className="w-25 p-2 mb-6 text-xl text-gray-900 rounded-lg bg-white" onChange={e => tableInstance.setPageSize(Number(e.target.value))}>
                                {
                                    pageLimitOptions.map((elem) =>
                                        <option key={elem} value={elem}>{elem}</option>
                                    )
                                }
                            </select>
                        </span>
            <ul className="flex h-8 text-sm">
                <li>
                    <button className={linkClass} onClick={() => tableInstance.setPageIndex(0)}>&#60;&#60;</button>
                </li>
                <li>
                    <button className={linkClass} onClick={() => tableInstance.previousPage()}>&#60;</button>
                </li>
                <span className={commonClass}>
                        {tableInstance.getState().pagination.pageIndex+1 + " page"}
                    </span>
                <li>
                    <button className={linkClass} onClick={() => tableInstance.nextPage()}>&#62;</button>
                </li>
                <li>
                    <button className={linkClass} onClick={() => tableInstance.setPageIndex(dataQuery.data!.total_pages)}>&#62;&#62;</button>
                </li>
            </ul>
        </nav>
    )

}