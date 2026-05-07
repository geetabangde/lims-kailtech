import React from "react";

function MastersList({ masters }) {
  return (
    <React.Fragment>
      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 p-2 text-left font-medium text-gray-800 dark:border-gray-600 dark:text-white">
                  Reference Standard
                </th>
                <th className="border border-gray-300 p-2 text-left font-medium text-gray-800 dark:border-gray-600 dark:text-white">
                  S.w/o
                </th>
                <th className="border border-gray-300 p-2 text-left font-medium text-gray-800 dark:border-gray-600 dark:text-white">
                  LD.No.
                </th>
                <th className="border border-gray-300 p-2 text-left font-medium text-gray-800 dark:border-gray-600 dark:text-white">
                  Certificate No.
                </th>
                <th className="border border-gray-300 p-2 text-left font-medium text-gray-800 dark:border-gray-600 dark:text-white">
                  Valid Upto
                </th>
              </tr>
            </thead>
            <tbody>
              {masters && masters.length > 0 ? (
                masters.map((item, index) => (
                  <tr key={index} className="dark:bg-gray-800">
                    <td className="border border-gray-300 p-2 dark:border-gray-600 dark:text-white">
                      {item.name}
                    </td>
                    <td className="border border-gray-300 p-2 dark:border-gray-600 dark:text-white">
                      {item.serialno}
                    </td>
                    <td className="border border-gray-300 p-2 dark:border-gray-600 dark:text-white">
                      {item.idno}
                    </td>
                    <td className="border border-gray-300 p-2 dark:border-gray-600 dark:text-white">
                      {item.certificateno}
                    </td>
                    <td className="border border-gray-300 p-2 dark:border-gray-600 dark:text-white">
                      {item.enddate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border border-gray-300 p-2 text-center dark:border-gray-600 dark:text-white"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MastersList;
