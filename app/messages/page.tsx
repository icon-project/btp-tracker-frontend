import SelectFilter from "@/app/components/SelectFilter";
import {PageNation} from "@/app/components/PageNation";
import {MessageTable} from "@/app/messages/MessageTable";
import {BTPMessage} from "@/app/data/BTPMessage";
import {Summary} from "@/app/page";

const statusOptions = ["status", "SEND", "RECEIVE", "ROUTE", "ERROR", "REPLY", "DROP"];
const limitOptions = ["25", "50", "100"];
export default async function Page({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
    const networkOptions = await getNetworkOptions();
    const net = ensureOptionValue(searchParams["network"] as string, networkOptions);
    const status = ensureOptionValue(searchParams["status"] as string, statusOptions);
    const limitParam = ensureOptionValue(searchParams["limit"] as string, limitOptions);
    const limit = limitParam ? limitParam : limitOptions[0];
    const pageParamNum = parseInt(searchParams["page"] as string || "1");
    const page = pageParamNum > 0 ? pageParamNum : 1;
    const req = `${process.env.API_URI}/api/ui/btp/status?page=${page}&limit=${limit}${net ? "&src=" + net : ""}${status ? "&status=" + status : ""}`;
    const res = await fetch(req, {cache: 'no-store'});
    const j = await res.json();
    const messages = j["list"] as BTPMessage[];
    const pageCount = j["total_pages"] as number;
    return (
        <section>
            <h2 className="text-4xl text-center mt-7">BTP Messages</h2>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <div className="flex flex-row-reverse">
                        <SelectFilter options={statusOptions} query={"status"}/>
                        <SelectFilter options={networkOptions} query={"network"} optionalClasses={"mr-2"}/>
                    </div>
                    <MessageTable messages={messages}/>
                    <nav className="flex justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-400">show
                            <SelectFilter options={limitOptions} query={"limit"}/>
                        </span>
                        <PageNation pageCount={pageCount}/>
                    </nav>
                </div>
            </div>
        </section>
    )
}

function ensureOptionValue(value: string, options: string[]) {
    for (let i = 1; i < options.length; i++)
        if (options[i] == value) return value;
    return "";
}

async function getNetworkOptions() {
    const summaryRes = await fetch(`${process.env.API_URI}/api/ui/network/summary`, {cache: 'no-store'});
    const summaryJson = await summaryRes.json();
    const summaries = summaryJson["list"] as Summary[];
    const options: string[] = ["network"];
    for (let i = 0; i < summaries.length; i++) options.push(summaries[i].networkAddress);
    return options;
}
