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

interface TrackerNetwork {
    name: string,
    address: string,
    type: string,
    image_base64: string
}

const tnMap: { [key: string]: TrackerNetwork } = {
    "0x63.bsc": {
        name: "bscnetwork",
        address: "0x63.bsc",
        type: "bsc",
        image_base64: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFMklEQVR4XtVbvW4TQRhMSWwipYYngCeACsp0pEsJFZTp8gapaXgD6F0gETsIWaRIARIopAAJJAcJCgq4s5M4/zE3l6y1nv253fXe2R5plOR2787f7PfN7u05c3MVIGksLiYbNx92W/XnaavWSFv1TrpZT7Kfg5xXv3fQhj7oi3P4OjOD7ub8ahZUexjguGzW271W/THfZ+qAkYsauMJaI3mzsMz3nThG0rky1jr8OSpHPuJ57fKHq4q1zkRKI9moP5nMqJtYoRBwZ/UDTAdLnzmma9RNLMkb8rRXbjadjF4OfINZIccRhFkaeebYmZCWNMV1390enOy9GAgc7j5T+kRkwnE5oUy3vzxLh8ELXPR/Kv1i0Xt2KCPte1t3OWYtyhLCqxzSyKl//GNdO+omQIQSysKtFGKO/tm/LY5tBEff1wenf17z4REcZ17B1w0llu4cr4I0wuizyelw9ndr2P+iv8fNI4iXDQWLpDRC8KApoMuzZND/uqb0Fzz59ZJPGSJiJphLQdM5mP3dpxxDlhm3lH7M3vs7fNpg/8OS0m8cctw5ktbCMnd0YT9LT8Dk3giIj4EHH5eGAeqEwXm64ygvAcws3O5CrRdc79UpnW1kkzvv7Th9KPYHV9c/+ramzCZBpdGst0eC93V+Dpyxv31POQfEqNrq3OYPmDFsOMxKjs+xsducXx0K4LuPZxKgyOQEdSbpMpI28XwFGMkCpbGALMB5d0c76vAHpCwWQrp6xqgeflpRju9v38/vgTWCrqRgsFwK3gK0JDPkhiKyAEdZgNxHNjnAZJJM2eQEdCJwFgULkLT9H3psAmCki6ALiAXTQe4fQ4D8Iel6Z1dptPEoq3MZsgAuDz3IBlxDnMOCmiB/BlkA/G6abm3Mp8Or11VqowsPPq/kN/cVIBTyvXFfmKLOW1yJ2IPmfyZMSfxelQCnWfD8ObzZrDWC1v+oVz4mWJUAMmGcOl8pZvZwFLLVjZrFqo+Pgy4mGAq+lyCmxBATTPFgpDlYSNm0TNOb7qEmBFhc8bVBni4DBRiMLQCgWweAwiRDgdWhyeSQgTLCBQgsARkmAQSLngEYLsGwsC7naJiXQEfTYKVNAJiR6ckOu0BFwPKYzxM7TPKxOALABAOmwSIBBE5+vxpxZ90mCUO+D2Yb+V5yWxQBMA2GLIRcBQBkk/QVgCG3xRAgXwiFLIV9BABE27QJsL9540H0h6FZEmD4xogbimgTAMTUJe/giOOhAug2RWMIEG0/AGbHfUAx9Ym/fQXAIkg3KyDL4m6IRNoSY9dn+grAxKwAU9XBWwB5Syz/YiN3sNAkgIBp9TaOANgms8FXAOVlqW8WgEUwZQPXLyC/KpOJrXAbcC0+p5CY/xkh06HLEtfkD7JJ6kwOPO9+ka6kQucPLuy9rT3i+HNwRx/a0pv7utIEk2Cu5LiHCHkwkmnKBtGOOjaVBcgbLQyku2+tq6zgDTGyQa5z+fhVIKOvwuQvUMjXEYA/hGx6qiwIHgjxAhMFxN9cJsgG8XJVgM8PMjkDFec3YdxSMJEF0IHPiUeH0RfwfVnqykkK4Dz6AiEPSS607RWaFlDj0vtrcgJlloJskjA53cvVOPRIfR3KKgfQ9C2QWPROexP4wrNCjmMslJkJsRlt5BlphEVS6dy0fA0uBsqaHWIw2O19cV0OHf4AE2M26qWlvQ2TF6LWyXd2J410EiKUXeshwEZDyJsmZzbr7akY8SJc/2NlWwkglFng2Lfk+8wM4M4YuW7T4d/nsz7oW5Wj/wdXGukMTSgLegAAAABJRU5ErkJggg=="
    },
    "0x25d6efd.eth2": {
        name: "eth2network",
        address: "0x25d6efd.eth2",
        type: "eth2",
        image_base64: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUxpcWx7bP///+zv8Ovu7+vu7////////+vu7////+zv8L+/v+vu7+rt7urt7uzv8Ozv7/L19u3v8Ovt7u3w8eru7uvu7+zw8e3w8aFk/+7y9Ozv8Ozu8O/y8uzv8PL19sCqquns7PD09e7u7uvv7+ft7fDy9O7y8uvu7uzu7+ru78zMzOvr7+/z8+rs7u7x8+zv8evu8O3w8e7w8uzu7+jo6+Xn5/L19vH19vL19uvu7/Dz9e7y9Ovu7+/y8/Hz9e/z9PH19vDz9Ozs7Ovw8Ovy8u3w8n////D09fH09e7x8e3w8e3w8evv7+vv8Ozv8O3x8evv7+vw8PL19e7x9Ovt7uzw8evv8O7x8u7y8+3w8uzv8C8wMIKDhBMTEzQ1NTU2Nuvu7+rt7oSFhjEyMu/y8/X4+RERES0uLoOEhfb5+jIzM/Dz9O7x8nx9fens7TAxMfP29/L19v3//+3w8fL19/z//xUVFXt8fYGCg/j8/Dc4OPT4+CQlJRQUFP7//4WGh3x9ficoKP////r9/3+AgYeJifr9/i4vLzM0NCssLPf6++nr7PT3+Hp7fCkqKiIjI35/gH1+fyorKzY3N9bY2dfa2xcXF+Xo6fn8/fv//4mKi4CBgsfJyufp6vj7/fT4+QwNDAQEBPDz9LO1tT0+PtHT1CEhIR8fH6utriMkJF1eXiYnJ0NEREVGRvX5+ra4uY+QkcHDxN7h4oyPj6WnqFNVVQcHB/Dz9WxtbpWWl8zOz77AwaGjpEtMTBsbG3d4eZyen3R2duPm53h5eujq6+Hk5ZiZmsTHyNve3rCys6msrdPV1oKEhWRlZert7xgZGZucnfj7/N3g4VpcXJKUlWZoaKChosjLzLq9vqyur/H19s3Q0TU1Nvb6+25wcGlra8rNzkFCQicnJ9nb3ODi4/L291FSU2BiYkdJSbu+vz9BQSMjI8HExezw8VdZWe/y9Kiqq7CysqSmp0xNTjo7O5aYmc3P0E5OTvT29/H09VZXWHFzc56goGJjY7i6u4a+3GEAAABbdFJOUwABAvz9+wQB/gP4BPr8/v269Nb7+hiOKe0BjuteqGLnA2H8FocVd46Q+NgFKEE/ralr74/qLiy/wv3EbW3H/oaG6+oceCh3AtPSXffQkNHOrahr9V3Pztb+/oaqvdwxAAAHE0lEQVRYw41Xd1wTZxj+wAt3AVEcQKm0bhFXW0W7696r2z8uMckll5DkIlmFpGkgCWUTCCNSFFw/91bcow7c1Vaptq6qHXbv3XR+dwG9+y5gvz8gv7t7n3vXPe/zAiA6KTHwT/TkGfcndM+IJeyxGd0T0l5MxuHFGBzc++BSAKTDR82K1bYYLLSdJO20xdCinfly2vA4eOeeENB84qDpWpvBhGFYV4KEh+gKf5oMNu20QYncAx2caBwkjh1v83eRYJwtPCoV94/AJF202RPG9gd4dEevj3qyt42WYOSdo6JpVdtvTMJk934qCsS1H/2YR7MZCUHy7EPB4LU7CCQBIR4b3U4mcBw82K1FYE6SlHbbLS3Fu0BI6rs9yD4bwR4f9TodTwrtrR8eK11Xn8W/Fk8XpaWIEaLwuAfyMeHrYQmXbKvQbFpiUvEvEp3yH4jDo5D3p/R5KK8zYk5S/jPeatcaj9AFkuyc95BU6AMuxR/OixfZhxY2qL21xZmNyyjhnfi8h3FBJmNAUr7o/bCEF7yeBUrzxg0hFXKrc/5gEMOvf99FPUX2lGW7Q69eoMw0fn0QDYLsuajv3absA5Jf6NdF/P7mxQ1yFsBcuupdBvGhS79uw0B0WwKkT78aL3bg07ccag5AZgwcbkFdiK9/Iro1DVLwfLZEnADr6iq9PAwgM1ceMCB5JCXZj4SDwPGBvR7vSorPvuo7ABrfZ3b0NsH06s/VUgoGRHCA8l+pUMvbAGAQ++rLkUd62AawLuBg4H0MIc5gk8cpvwtgzlQGrUgQxDMjE8FUWM1JtggZCB10qHkAMuP6veIs2KawzTB0iB8Tt8CHbAJ4ADLNxpVoJTr5hwyFSRihFdmT9vJtBShA5RfHTchjmHYETGJSnkScwZVcBvkAspLAYrQfJbYkWISXDJgoAZ/I247e0QYAz36/MA3YljkxIDnWhNZAxRzxhgNwygsLatvMje7PLe8I62BKHwZSt2CiDJ7iKuB06gvlezev/disaUVYvxMJAtOmgsFLEQCV6Y3FDXpori4seHuTJjNXd95drDGzzVDz1W1a8FFhS2eDBDQFlOWqQ+10egorLq6SaWqNOTqdrm5NKYQoNgYWCEuJGRJAdwuBZPBslVPu8Rzd5So2KpVKTY5u/nydLndtDRtJzTdCjrbOAxmiPt5XtVi9902FrESpVCjCAPDo5h/yyUp8uwS9QNAZINaODIIDDXIYukwBrRU8ANaN826j+8IifhD2dIB+RKcLNsDQlWFzAQALURdQXLfy80gAAu3BErfC1WaOAMzPydm9/P0yQTeBdGEIqu8vv1dTfBeBD5Bbt3z376eu8R2wx4IMWuiD3W/98Xef0SUGqNOt0Oy0GmgBK2WAeVYBgOkExRiOX/rFp6wVAuTkrjikX3JjWdZCXh0IS3e0keimH4Ihuix4tLiUi6MVgA3+n7NLQ2WNfwV5DM820mxhK1P+xuozzcw17faLlWYIwQHA4Fd89G+Z1dB0buMPRRS/lQeDVIRPKO2Zozu2k7Tf9NNmX4mLBcjRrfCdpLUW8u+Pcs5lZwm+51QwLF30OZ90eH9dzdBlJwo/qHSV1OXuzj18uyXkv7LLHfiTtKv4n3NsMoiZg3zPKua0Wl9VtbMpxJRdv1Vaunz3rsstIcPZmz6fpuQ3v8ABw1zI60koKbND1aN3eLYeZ6x/bP259uoyy7LmHYr1ZkXgoHA4SPIgpUUgVVVop0Otd1ZsazTRZc3NZa8wb20OZBpL1t9EmJ0jVRzSeieUUpbsgKSsLvAeCYYYq/bUBneN0ayp3NyM0AmkdVZbTBENFsq6uoAlVL23YV3z6YpSt9HM8tGBG1kIKU+C5lNB4shnCBGvb+V4XS93FG5aw3Gicc2OonJkut43EE5GdrjaeohGi+mCl5sMnmPs21lK3rCHVCHznRuucLz378WImb2p0MlSu7q6lhuupS50uHZ9vNfAsFSTgkfE852yNHKzoXUyadzrWsrbERhQ4kQ/US/WeNZ17HQIAxgDx9DJGl//tLRN6UWDyd3EIsuedQlqnLBG8v1cLlSrrMhKhuqsI5lHhYLOsAfm4uJGbVYHMo9thsH5EYTul606MXASqSAUmkl8odmO1FUx7zugUtW43/OrUKn7nFDqwlpKxWKblZpOr6ty1buI1O2c92yfKDyC3O9EoLXcX1Dt2rhVWAECiyD3WR9S0opEC4dl5eHKc0WihSMq8soCV556ZOUhmcLvvhWQULsrD7d0jX4MWbooa3C1heKZ78l+dEz762ccu/ZBCP7axzDU3bWPtnW09oUXz/7jJmRrIy+er9nGj0vscPEMr76Jg6ZFXn2nD5p4r9W3dfmOGz577kzh8h07a9Rw6f9ZvlkItkfx5BlpCfMy0kkiPWNeQlrqMNbxmBTx0/8BsP8D5OWd4s8AAAAASUVORK5CYII="
    },
    "0x3.icon": {
        name: "iconnetwork",
        address: "0x3.icon",
        type: "icon",
        image_base64: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAACylBMVEVHcEwA//8Af38AAAAArqofxckAv78A//8fxMgfxMgfxMgfxMgfxckexckA//8fxMgexckfxckfxcohxsoexMgfxcgfx8oexsk/v78gycwew8gexskgys4fxssfyc0ewsUfxckexckfyMwAqv8ewccexsogx8sgzNAfyc0ew8gexcgfyMwexckexMgfxckfxckfxckfyc0fxcgfyc4ewsofxcwgxcsexckfxckdxcUexcgfx8kexMkcv8Igys4gys4kws4AAP8fys4gys4exMghwsIexMcgyc0gyc0gx80exskfyc4gyMwfyMwfyckfxsoeyMsA/wAfx8wfxckexcgew8gcs8wexcgexsodw8gexMcfxcgfxcofxckfxMcfxcgbyMgbv8gfw8cexskexMgexMkfx8wfxMgfxcn////+//8gxckixsr8/v4hxckbxMghxsoh09cjxsocxMggzdH9/v8Ww8cRwcYXw8cYw8caxMj7/v7v+/vw+/sPwcUVwsf5/f1BztExys0gzdISwsYhxskryMwexckdxMgtycwnx8si1dmp6eofxsohz9Nl19oh1Nis6esSwcY/zdEgyMwVwsYfyMwgzNAyys5CztJEz9IsyMzn+fna9fYfx8vb9vYhz9Qh0tbm+fn0/Pwh0dUgx8sgyc0i1NgZw8jw+/wQwcbQ8/TO8/NAztFu2dwzy85DztK27O297u8sycw2y8+r6esUwsbq+fr6/v7r+vq67e4Uwsfo+fm57e79//+f5uggy88gys4h09g1y84Wwscvyc0h0NTy+/x93eDm+Pkh0dbz/PwRwcUTwsaq6eohxcqn6Ooxys4LwMSw6+wxyc1w2tw4zM8kxspIz9MdxMlR0tXX9fUkx8px2t2o6er5/f72/P34/f3c9vei5+gfxsvi9/h73d9l19n0/P2a5eY+zdGa5ecfxcoSwsUYDpguAAAAaHRSTlMAAwIBA/sEAf79/Pv99wL6+/ztFpD+jl0EbWut56n8YfqH/gMZjnf+09jqQdY//rnV9GL1KiiP6roo+CnPLL/zFQHC/cQux/2Fhu/rp+oY/PYBeHf3jgXR0F6P/WKo/qgcHP7O+OmOusE4YbMAAAawSURBVFjDjVcHVxNZFH4EkhkIKFLt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"
    }
    // havah
    // "0x111.icon" : {
    //      name: "havahnetwork",
    //      address: "0x111.icon",
    //      type: "icon",
    //      imageBase64: "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"
    // }
}

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
    const cellClass = "pl-6 py-3";
    const imgCellClass = "flex items-center px-6 py-2 font-medium whitespace-nowrap";
    const value = cell.getValue() as string;
    return (
        <td key={cell.id} className={cell.column.id === 'src' ? imgCellClass : cellClass}>
            {(cell.column.id) === 'src' &&
                <Image className="rounded-full" alt={value}
                       src={`data:image/png;base64,${tnMap[value].image_base64}`} width={30} height={30}/> }

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