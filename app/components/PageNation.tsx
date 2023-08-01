'use client'
import Link from "next/link";
import {useSearchParams} from "next/navigation";

export function PageNation() {
    const searchParams = useSearchParams()!;
    const params = new URLSearchParams(searchParams.toString());
    const queryObject = Object.fromEntries(params);
    delete queryObject["page"];
    const p = parseInt(params.get("page") as string || "1");
    const commonClass = "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ";
    const linkClass = `${commonClass}hover:bg-gray-100 hover:text-gray-700`;
    const prev = p - 1 > 0 ? <Link href={{pathname: "/messages", query: {...queryObject, "page": p-1}}} title="prev page" className={linkClass}>&#60;</Link> :
        <span className={commonClass}>&#60;</span>;
    return (
        <ul className="flex h-8 text-sm">
            <li>
                <Link href={{pathname: "/messages", query: {...queryObject, "page": "1"}}} title="first page"
                      className={linkClass}>&#60;&#60;</Link>
            </li>
            <li>
                {prev}
            </li>
            <li>
                <span className={commonClass}>{p}page</span>
            </li>
            <li>
                <Link href={{pathname: "/messages", query: {...queryObject, "page": p+1}}} title="next page"
                      className={linkClass}>&#62;</Link>
            </li>
            <li>
                <Link href={{pathname: "/messages", query: {...queryObject, "page": "5"}}} title="last page"
                      className={linkClass}>&#62;&#62;</Link>
            </li>
        </ul>
    )
}