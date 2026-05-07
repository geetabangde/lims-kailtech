
import TableHeader from './TableHeader';
import TableRow from './TableRow';

function SingleObservationTable({
  selectedTableData,
  tableStructure,
  tableInputValues,
  observationErrors,
  handleInputChange,
  handleObservationBlur,
  handleRowSave,
  unitsList,
  dynamicHeadings,
  setObservationErrors
}) {
  const rows = selectedTableData.staticRows?.length > 0
    ? selectedTableData.staticRows
    : [Array(tableStructure.subHeadersRow.length).fill('')];

  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-600">
      <table className="w-full text-sm">
        <TableHeader tableStructure={tableStructure} />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              selectedTableData={selectedTableData}
              tableInputValues={tableInputValues}
              observationErrors={observationErrors}
              handleInputChange={handleInputChange}
              handleObservationBlur={handleObservationBlur}
              handleRowSave={handleRowSave}
              unitsList={unitsList}
              dynamicHeadings={dynamicHeadings}
              setObservationErrors={setObservationErrors}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SingleObservationTable;