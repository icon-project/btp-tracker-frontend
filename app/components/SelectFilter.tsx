export default function SelectFilter({options, optionalClasses} : {options: {[key: string]: string}, optionalClasses?: string}) {
    const commonClasses = "w-25 p-2 mb-6 text-xl text-gray-900 rounded-lg bg-white";
    const className = optionalClasses? `${commonClasses} ${optionalClasses}` : commonClasses;
    return (
        <>
            <select className={className}>
                {
                    Object.keys(options).map(key =>
                        <option key={key} value={key}>{options[key]}</option>
                    )
                }
            </select>
        </>
    )
}
