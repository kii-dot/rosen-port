export { TransactionHistory };

const dummyTransactionData = {
  0: {
    Token: "ADA",
    BridgeRoute: ["SigUSD","ADA"],
    DateTime: "2 Jul 2024 22:35",
    Status: "Waiting to Fill",
    Actions: undefined
  },
  1: {
    Token: "ERG",
    BridgeRoute: ["ADA","ERG"],
    DateTime: "2 Jul 2024 22:35",
    Status: "Completed",
    Actions: undefined
  },
  2: {
    Token: "ADA",
    BridgeRoute: ["SigUSD","ADA"],
    DateTime: "2 Jul 2024 22:35",
    Status: "Completed",
    Actions: undefined
  },
}

function TransactionHistory() {
  return<table className="w-full table-auto text-gray-300">
            <thead>
              <tr>
                <th>Token</th>
                <th>Bridge Route</th>
                <th>Time & Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(dummyTransactionData).map((keyName) => {
                return <>
                  <tr className="text-white odd:bg-indigo-950 even:bg-indigo-900 opacity-60">
                    <td>
                      {dummyTransactionData[keyName].Token}
                    </td>
                    <td>
                      {dummyTransactionData[keyName].BridgeRoute[0]}-&gt;{dummyTransactionData[keyName].BridgeRoute[1]}
                    </td>
                    <td>
                      {dummyTransactionData[keyName].DateTime}
                    </td>
                    <td>
                      {dummyTransactionData[keyName].Status}
                    </td>
                    <td>
                      {dummyTransactionData[keyName].Actions}
                    </td>

                  </tr>
                
                </>;
              }
              )}
            </tbody>
          </table>
}
