import Link from "next/link";

export default function Page() {
    return (
        <section>
            <h2 className="text-4xl text-center mt-7">BTP Message</h2>
            <div className="overflow-x-auto m-10 flex justify-center">
                <div className="w-3/4 flex-col">
                    <MessageDetail/>
                    <EventList/>
                </div>
            </div>
        </section>
    )
}

function MessageDetail() {
    return (
      <>
          <table className="w-full text-xl text-left mb-10">
              <caption className="text-left text-lg font-bold mb-2">Message</caption>
              <tbody>
              <tr className="bg-white border-2">
                  <th scope="col" className="bg-gray-100 px-6 py-3">
                      src
                  </th>
                  <td scope="col" className="px-6 py-3">
                      0x61.bsc
                  </td>
                  <th scope="col" className="bg-gray-100 px-6 py-3">
                      nsn
                  </th>
                  <td scope="col" className="px-6 py-3">
                      100
                  </td>
              </tr>
              <tr className="bg-white border-2">
                  <th scope="row" className="bg-gray-100 px-6 py-3">
                      status
                  </th>
                  <td className="px-6 py-3">
                      RECEIVE
                  </td>
                  <th scope="col" className="bg-gray-100 px-6 py-3">
                      last occurred
                  </th>
                  <td scope="col" className="px-6 py-3">
                      0x111.icon
                  </td>
              </tr>
              <tr className="bg-white border-2">
                  <th scope="row" className="bg-gray-100 px-6 py-3">
                      finalized
                  </th>
                  <td className="px-6 py-4">
                      100
                  </td>
                  <th scope="col" className="bg-gray-100 px-6 py-3">
                      last updated
                  </th>
                  <td scope="col" className="px-6 py-3">
                      2023-07-20 00:00:00
                  </td>
              </tr>
              </tbody>
          </table>
      </>
    );
}

function EventList() {
    return (
        <>
            <table className="w-full text-xl text-left">
                <caption className="text-left text-lg font-bold mb-2">Message delivery</caption>
                <thead className="bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        occurred at
                    </th>
                    <th scope="col" className="px-6 py-3">
                        event
                    </th>
                    <th scope="col" className="px-6 py-3">
                        next
                    </th>
                    <th scope="col" className="px-6 py-3">
                        created
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr className="bg-white border-2">
                    <td className="px-6 py-4">
                        0x61.bsc
                    </td>
                    <td className="px-6 py-4">
                        SEND
                    </td>
                    <td className="px-6 py-4">
                        0x111.icon
                    </td>
                    <td className="px-6 py-4">
                        2023-07-20:00:00:00
                    </td>
                </tr>
                <tr className="bg-white border-2">
                    <td className="px-6 py-4">
                        0x111.icon
                    </td>
                    <td className="px-6 py-4">
                        RECEIVE
                    </td>
                    <td className="px-6 py-4">
                    </td>
                    <td className="px-6 py-4">
                        2023-07-20:00:01:00
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    )
}
