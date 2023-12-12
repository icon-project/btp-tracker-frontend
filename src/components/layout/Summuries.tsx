import {useContext} from "react";
import NetworkInfoContext from "../../utils/context";
import {getNetworkName} from "../../utils";
import {Link} from "react-router-dom";

export interface Summary {
    network_address: string,
    status_total: number,
    status_in_delivery: number,
    status_completed: number
}
export default function Summaries({summaryList}: { summaryList?: Summary[] }) {
    return (
        <>
            {
                summaryList && summaryList.map(summary => <Summary key={summary["network_address"]} summary={summary}/>)
            }
        </>
    )
}

function Summary({summary}: { summary: Summary }) {
    const nMap = useContext(NetworkInfoContext);
    if(Object.keys(nMap).length === 0) return (<div></div>)
    return (
        <div className="w-1/3 text-lg text-left border p-2">
            <img className="rounded-full inline" src={`data:image/png;base64,${nMap[summary["network_address"]].imageBase64}`}
               alt={summary["network_address"]} width={30} height={30}/>
            <Link to={`/messages?network=${summary["network_address"]}`} className="text-[#27aab9]"> {getNetworkName(nMap, summary["network_address"])}</Link><br/>
            <hr className={"my-3"}/>
            <table className="text-right">
                <tbody>
                <tr>
                    <td>Total Message :</td>
                    <td>{summary["status_total"]}</td>
                </tr>
                <tr>
                    <td>In Delivery :</td>
                    <td>{summary["status_in_delivery"]}</td>
                </tr>
                <tr>
                    <td>Completed :</td>
                    <td>{summary["status_completed"]}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}
