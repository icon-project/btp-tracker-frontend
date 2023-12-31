import {BTPMessage} from "../../data/BTPMessage";
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
import NetworkInfoContext from "../../utils/context";
import {getElapsedTime, getNetworkIcon, getNetworkName, GV, COL} from "../../utils";
import {useNavigate} from "react-router-dom";

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
    const filterNames = [COL.SRC, COL.STATUS];
    const srcFilter = options.columnFilters[0];
    const statusFilter = options.columnFilters[1];
    const filterQuery = `${filterNames.filter(n => n == srcFilter.value).length == 0 ? "&query[src]=" + srcFilter.value : ""}${!!statusFilter && filterNames.filter(n => n == statusFilter.value).length == 0 ? "&query[status]=" + statusFilter.value : ""}`;
    const req = `${import.meta.env.VITE_API_URL}/tracker/bmc?task=search&page=${options.pageIndex}&size=${options.pageSize}&sort=created_at desc${filterQuery}`;
    const res = await fetch(req, {cache: 'no-store'});
    return await res.json();
}

export function MessageTableWithFilter({networkOptions, selected}: { networkOptions: string[], selected: string }) {
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
    return <TableComp tableInstance={tableInstance}/>;
}

function Columns() {
    return React.useMemo(
        () => [
            {
                header: GV.SOURCE_NETWORK,
                accessorKey: "src",
            },
            {
                header: "Network Serial Number",
                accessorKey: "nsn",
            },
            {
                header: "Status",
                accessorKey: "status.String",
            },
            {
                header: "Last Network Address",
                accessorKey: "last_network_address.String",
            },
            {
                header: "Last Updated",
                accessorKey: "updated_at",
            },

        ],
        []
    );
}

function FilterableMessageTable({networkOptions, selected}: { networkOptions: string[], selected: string }) {
    const statusOptions = [COL.STATUS, "Unknown", "Sending", "WaitReply", "Replying", "Completed"];
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
        data: dataQuery.data?.content ?? defaultData,
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
            <TableComp tableInstance={tableInstance} statusOptions={statusOptions} srcOptions={networkOptions}
                       selectedSrc={selected}/>
            <TableFooter tableInstance={tableInstance} dataQuery={dataQuery}/>
        </>
    );
}

function TableComp({tableInstance, statusOptions, srcOptions, selectedSrc}: {
    tableInstance: Table<BTPMessage>,
    statusOptions?: string[],
    srcOptions?: string[],
    selectedSrc?: string
}) {
    return (
        <table className="w-full text-left">
            <thead className="bg-gray-100 border-2">
            {tableInstance.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} scope="col" className="pl-6 py-1 font-medium">
                            {header.column.id === "src" && !!srcOptions &&
                                <ColumnFilter column={header.column} options={srcOptions} defaultValue={selectedSrc}/>}
                            {header.column.id === "status_String" && !!statusOptions &&
                                <ColumnFilter column={header.column} options={statusOptions}/>}
                            {header.column.id === "src" && !!srcOptions || header.column.id === "status_String" && !!statusOptions || flexRender(header.column.columnDef.header, header.getContext())}
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
    )
}

function TableCell({cell}: { cell: Cell<BTPMessage, any> }) {
    const nMap = useContext(NetworkInfoContext);
    if (Object.keys(nMap).length === 0) return <td></td>;
    const cellClass = "pl-6 py-3";
    const imgCellClass = "flex items-center px-6 py-2 font-medium whitespace-nowrap";
    const value = cell.getValue() as string;
    return (
        <td key={cell.id}
            className={(cell.column.id === 'src') || (cell.column.id === 'last_network_address_String') ? imgCellClass : cellClass}>
            {(cell.column.id === 'src' || cell.column.id === 'last_network_address_String') &&
                <img className="rounded-full pr-2" alt={value}
                     src={`data:image/png;base64,${getNetworkIcon(nMap, value)}`} width={30} height={30}/>}
            {(cell.column.id === 'src' || cell.column.id === 'last_network_address_String') && `${getNetworkName(nMap, value)}`}
            {(cell.column.id === 'nsn' || cell.column.id === 'status_String') && flexRender(cell.column.columnDef.cell, cell.getContext())}
            {(cell.column.id) === "updated_at" ? <span>{getElapsedTime(value)}</span> : ''}
        </td>
    )
}

function TableRow({row}: { row: Row<BTPMessage> }) {
    const navigate = useNavigate();
    return (
        <tr key={row.id} className="cursor-pointer bg-white border-2 hover:bg-gray-200" tabIndex={0}
            onClick={() => navigate(`/message/${row.original.id}`)}>
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} cell={cell}/>
            ))}
        </tr>
    )
}

function ColumnFilter({options, column, defaultValue}: { options: string[], column: Column<any>, defaultValue?: string }) {
    const nMap = useContext(NetworkInfoContext);
    function getDisplayingValue(header: string, elem: string): string {
        for (const p in COL) if (elem === COL[p]) return "All";

        if (header === GV.SOURCE_NETWORK) return getNetworkName(nMap, elem);
        return elem;
    }

    return (
        <>
            {column.columnDef.header}
            <br/>
            <select onChange={e => column.setFilterValue(e.target.value)} defaultValue={defaultValue}>
                {options.map((elem) => <option key={elem} value={elem} className='text-xs font-light'>{
                        getDisplayingValue(column.columnDef.header as string, elem)
                    }</option>
                )}
            </select>
        </>
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
                        {tableInstance.getState().pagination.pageIndex + 1} of {dataQuery.data?.total_pages}
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