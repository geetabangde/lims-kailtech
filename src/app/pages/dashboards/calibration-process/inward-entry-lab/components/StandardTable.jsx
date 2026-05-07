// StandardTable.jsx
import React from 'react'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

function StandardTable({
  selectedTableData,
  tableStructure,
  tableInputValues,
  observationErrors,
  handleInputChange,
  handleObservationBlur,
  handleRowSave,
  unitsList,
  setObservationErrors
}) {
  const rows = selectedTableData.staticRows?.length > 0 
    ? selectedTableData.staticRows 
    : [Array(tableStructure.subHeadersRow.length).fill('')];

  return (
    <React.Fragment>
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 gita">
      <table className="w-full text-sm">
        <TableHeader tableStructure={tableStructure} />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 bangde">
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              selectedTableData={selectedTableData}
              tableStructure={tableStructure}
              tableInputValues={tableInputValues}
              observationErrors={observationErrors}
              handleInputChange={handleInputChange}
              handleObservationBlur={handleObservationBlur}
              handleRowSave={handleRowSave}
              unitsList={unitsList}
              setObservationErrors={setObservationErrors}
            />
          ))}
        </tbody>
      </table>
    </div>
    </React.Fragment>
  );
}

export default StandardTable;