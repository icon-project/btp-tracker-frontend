import Link from "next/link";

export function PageNation() {
    return (
        <ul className="flex h-8 text-sm">
            <li>
                <Link href="#" title="first page"
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">&#60;&#60;</Link>
            </li>
            <li>
                <Link href="#" title="prev page"
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">&#60;</Link>
            </li>
            <li>
                <Link href="#" aria-current="page"
                      className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">3
                    page</Link>
            </li>
            <li>
                <Link href="#" title="next page"
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">&#62;</Link>
            </li>
            <li>
                <Link href="#" title="last page"
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">&#62;&#62;</Link>
            </li>
        </ul>
    )
}