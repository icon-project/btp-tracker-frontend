import SelectFilter from "@/app/components/SelectFilter";
import {PageNation} from "@/app/components/PageNation";
import {Message, MessageTable} from "@/app/messages/MessageTable";

const statusOptions = ["status", "SEND", "RECEIVE"];
const networkOptions = ["network", "0xaa36a7.eth2", "0x61.bsc", "0x111.icon"];
const limitOptions = ["25", "50", "100"];
export default async function Page({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
    const req = getReqURL(searchParams);
    const r = await fetch(req, {cache: 'no-store'});
    const j = await r.json();
    const rows = j["rows"] as Message[];
    return (
        <section>
            <h2 className="text-4xl text-center mt-7">BTP Messages</h2>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <div className="flex flex-row-reverse">
                        <SelectFilter options={statusOptions} query={"status"}/>
                        <SelectFilter options={networkOptions} query={"network"} optionalClasses={"mr-2"}/>
                    </div>
                    <MessageTable messages={rows}/>
                    <nav className="flex justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-400">show
                            <SelectFilter options={limitOptions} query={"limit"}/>
                        </span>
                        <PageNation/>
                    </nav>
                </div>
            </div>
        </section>
    )
}

function getReqURL(searchParams: {[key: string]: string | string[] | undefined}) {
    const net = ensureOptionValue(searchParams["network"] as string, networkOptions);
    const status = ensureOptionValue(searchParams["status"] as string, statusOptions);
    const limitParam = ensureOptionValue(searchParams["limit"] as string, limitOptions);
    const limit = limitParam ? limitParam : limitOptions[0];
    const pageParamNum = parseInt(searchParams["page"] as string || "1");
    const page = pageParamNum > 0 ? pageParamNum : 1;
    return `${process.env.API_URI}/api/v1/status?page=${page}&limit=${limit}${net ? "&network=" + net : ""}${status ? "&status=" + status : ""}`;
}

function ensureOptionValue(value: string, options: string[]) {
    for (let i = 1; i < options.length; i++)
        if (options[i] == value) return value;
    return "";
}
