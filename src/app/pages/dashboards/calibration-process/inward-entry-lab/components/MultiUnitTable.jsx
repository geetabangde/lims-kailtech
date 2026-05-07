
import TableHeader from './TableHeader';
import TableRow from './TableRow';

function MultiUnitTable({
  selectedTableData,
  tableStructure,
  tableInputValues,
  observationErrors,
  handleInputChange,
  handleObservationBlur,
  setObservationErrors
}) {
  return selectedTableData.unitTypes.map((unitTypeGroup, groupIndex) => {
    if (!unitTypeGroup || !unitTypeGroup.calibration_points) return null;

    // Calculate starting row index
    let startingRowIndex = 0;
    for (let i = 0; i < groupIndex; i++) {
      if (selectedTableData.unitTypes[i]?.calibration_points) {
        startingRowIndex += selectedTableData.unitTypes[i].calibration_points.length;
      }
    }

    const unitTypeRows = unitTypeGroup.calibration_points.map(point => {
      const observations = [];
      if (point.observations && Array.isArray(point.observations)) {
        for (let i = 0; i < 5; i++) {
          observations.push(point.observations[i]?.value || '');
        }
      }
      while (observations.length < 5) observations.push('');

      return [
        point.sequence_number?.toString() || '',
        point.mode || 'Measure',
        point.range || '',
        point.nominal_values?.calculated_master?.value || '',
        point.nominal_values?.master?.value || '',
        ...observations,
        point.calculations?.average || '',
        point.calculations?.error || ''
      ];
    });

    return (
      <div key={groupIndex} className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 bg-blue-50 dark:bg-blue-900 p-2 rounded">
          {unitTypeGroup.unit_type}
        </h3>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 kjjkh">
          <table className="w-full text-sm">
            <TableHeader tableStructure={tableStructure} />
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {unitTypeRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  row={row}
                  rowIndex={startingRowIndex + rowIndex}
                  selectedTableData={selectedTableData}
                  tableInputValues={tableInputValues}
                  observationErrors={observationErrors}
                  handleInputChange={handleInputChange}
                  handleObservationBlur={handleObservationBlur}
                  setObservationErrors={setObservationErrors}
                  disabledColumns={[0, 1, 3, 4, 10, 11]} // MM specific
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  });
}

export default MultiUnitTable;