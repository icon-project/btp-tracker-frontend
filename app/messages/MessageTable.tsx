'use client'
import {useRouter} from "next/navigation";
import {BTPMessage} from "@/app/data/BTPMessage";
import Image from "next/image";
import React, {useContext} from 'react';
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
import ImgInfoContext from "@/app/context";
import ImgInfo, {NetworkMap, TrackerNetwork} from "@/app/ImgInfo";
import ImgInfoContextProvider from "@/app/ImgInfo";

interface BTPResponse {
    content: BTPMessage[],
    total_elements: number,
    total_pages: number,
    pageable: {
        page: number,
        size: number,
        sort: string
    }
}

const queryClient = new QueryClient();

async function fetchData(options: {
    pageIndex: number,
    pageSize: number,
    columnFilters: ColumnFiltersState
}): Promise<BTPResponse> {
    const filterNames = ["source network", "status"];
    const srcFilter = options.columnFilters[0];
    const statusFilter = options.columnFilters[1];
    const filterQuery = `${filterNames.filter(n => n == srcFilter.value).length == 0 ? "&query[src]=" + srcFilter.value : ""}${!!statusFilter && filterNames.filter(n => n == statusFilter.value).length == 0 ? "&query[status]=" + statusFilter.value : ""}`;
    const req = `${process.env.NEXT_PUBLIC_API_URI}/tracker/bmc?task=search&page=${options.pageIndex}&size=${options.pageSize}&sort=created_at desc${filterQuery}`;
    const res = await fetch(req, {cache: 'no-store'});
    return await res.json();
}

export function MessageTableWithFilter({networkOptions, selected}: { networkOptions: string[], selected: string }) {
    const data = useContext(ImgInfoContext);
    return (
        <QueryClientProvider client={queryClient}>
            <FilterableMessageTable networkOptions={networkOptions} selected={selected}/>
        </QueryClientProvider>
    )
}

export function MessageTable({messages}: { messages: BTPMessage[] }) {
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
                header: "source network",
                accessorKey: "src",
            },
            {
                header: "serial number",
                accessorKey: "nsn",
            },
            {
                header: "status",
                accessorKey: "status.String",
            },
            {
                header: "links",
                accessorKey: "links.String",
            },
            {
                header: "finalized",
                accessorKey: "finalized",
            },
            {
                header: "last network address",
                accessorKey: "last_network_address.String",
            },
            {
                header: "last updated time",
                accessorKey: "updated_at",
            },

        ],
        []
    );
}

function FilterableMessageTable({networkOptions, selected}: { networkOptions: string[], selected: string}) {
    const statusOptions = ["status", "SEND", "RECEIVE", "ROUTE", "ERROR", "REPLY", "DROP"];
    const [{pageIndex, pageSize}, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 25,
        })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([{id: "src", value: selected}]);
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
        ['content', fetchDataOptions],
        () => fetchData(fetchDataOptions),
        {keepPreviousData: true}
    );
    const columns = Columns();
    const defaultData = React.useMemo(() => [], []);
    const tableInstance = useReactTable({
        columns,
        data: dataQuery.data?.content?? defaultData,
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
            <Table tableInstance={tableInstance} statusOptions={statusOptions} srcOptions={networkOptions} selectedSrc={selected}/>
            <TableFooter tableInstance={tableInstance} dataQuery={dataQuery}/>
        </>
    );
}

function Table({tableInstance, statusOptions, srcOptions, selectedSrc}: {
    tableInstance: Table<BTPMessage>,
    statusOptions?: string[],
    srcOptions?: string[],
    selectedSrc?: string
}) {
    return (
        <>
            <table className="w-full text-left">
                <thead className="bg-gray-100 border-2">
                {tableInstance.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} scope="col" className="pl-6 py-1 font-medium">
                                {header.column.id === "src" && !!srcOptions &&
                                    <ColumnFilter column={header.column} options={srcOptions} defaultValue={selectedSrc}/>}
                                {header.column.id === "status" && !!statusOptions &&
                                    <ColumnFilter column={header.column} options={statusOptions}/>}
                                {header.column.id === "src" && !!srcOptions || header.column.id === "status" && !!statusOptions || flexRender(header.column.columnDef.header, header.getContext())}
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

function TableCell({cell, lastNetwork}: { cell: Cell<BTPMessage, any>, lastNetwork: any }) {
    const c = useContext(ImgInfoContext);
    if (!c) return <div></div>;
    let nMap: NetworkMap = {};
    c.map((net: TrackerNetwork) => (
        nMap[net.address] = {
            name: net.name,
            address: net.address,
            type: net.type,
            imageBase64: net.imageBase64
        }))

    const cellClass = "pl-6 py-3";
    const imgCellClass = "flex items-center px-6 py-2 font-medium whitespace-nowrap";
    const value = cell.getValue() as string;
    return (
        <td key={cell.id} className={cell.column.id === 'src' ? imgCellClass : cellClass}>
            {(cell.column.id) === 'src' &&
                <Image className="rounded-full" alt={value}
                       src={`data:image/png;base64,${nMap[value].imageBase64}`} width={30} height={30}/> }

            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            {(cell.column.id) === "status" && (value === "ROUTE") &&
                <span className="font-medium text-xs text-gray-400">({lastNetwork})</span>}
        </td>
    )
}

function TableRow({row}: { row: Row<BTPMessage> }) {
    const router = useRouter();
    return (
        <tr key={row.id} className="cursor-pointer bg-white border-2 hover:bg-gray-200" tabIndex={0}
            onClick={() => router.push(`/message/${row.original.id}`)}>
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} cell={cell} lastNetwork={row.original.last_network_address}/>
            ))}
        </tr>
    )
}

function ColumnFilter({options, column, defaultValue}: { options: string[], column: Column<any>, defaultValue?: string}) {
    return (
        <select onChange={e => column.setFilterValue(e.target.value)} defaultValue={defaultValue}>
            {
                options.map((elem) =>
                    <option key={elem} value={elem} className={"text-xs font-light"}>{elem}</option>
                )
            }
        </select>
    )
}

function TableFooter({tableInstance, dataQuery}: {
    tableInstance: Table<BTPMessage>,
    dataQuery: UseQueryResult<BTPResponse>
}) {
    const commonClass = "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ";
    const linkClass = `${commonClass}hover:bg-gray-100 hover:text-gray-700`;
    const pageLimitOptions = [25, 50, 100];
    return (
        <nav className="flex justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-400">show
                            <select className="w-25 p-2 mb-6 text-xl text-gray-900 rounded-lg bg-white"
                                    onChange={e => tableInstance.setPageSize(Number(e.target.value))}>
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
                        {tableInstance.getState().pagination.pageIndex + 1 + " page"}
                    </span>
                <li>
                    <button className={linkClass} onClick={() => tableInstance.nextPage()}>&#62;</button>
                </li>
                <li>
                    <button className={linkClass}
                            onClick={() => tableInstance.setPageIndex(dataQuery.data!.total_pages)}>&#62;&#62;</button>
                </li>
            </ul>
        </nav>
    )

}