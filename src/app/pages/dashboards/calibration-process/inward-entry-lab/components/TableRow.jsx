
import TableCell from './TableCell';

function TableRow({
  row,
  rowIndex,
  selectedTableData,
  tableInputValues,
  observationErrors,
  handleInputChange,
  handleObservationBlur,
  handleRowSave,
  unitsList,
  dynamicHeadings,
  setObservationErrors,
  disabledColumns // Optional: for MM's hardcoded disabled columns
}) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      {row.map((cell, colIndex) => (
        <TableCell
          key={colIndex}
          cell={cell}
          rowIndex={rowIndex}
          colIndex={colIndex}
          row={row}
          selectedTableData={selectedTableData}
          tableInputValues={tableInputValues}
          observationErrors={observationErrors}
          handleInputChange={handleInputChange}
          handleObservationBlur={handleObservationBlur}
          handleRowSave={handleRowSave}
          unitsList={unitsList}
          dynamicHeadings={dynamicHeadings}
          setObservationErrors={setObservationErrors}
          disabledColumns={disabledColumns}
        />
      ))}
    </tr>
  );
}

export default TableRow;