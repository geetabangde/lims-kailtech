
import Select from 'react-select';
import { getDisabledStatus } from '../../../../../../utils/cellHelpers';

function TableCell({
  cell,
  rowIndex,
  colIndex,
  row,
  selectedTableData,
  tableInputValues,
  observationErrors,
  handleInputChange,
  handleObservationBlur,
  handleRowSave,
  unitsList,
  dynamicHeadings,
  setObservationErrors,
  disabledColumns
}) {
  const key = `${rowIndex}-${colIndex}`;
  const currentValue = tableInputValues[key] ?? (cell?.toString() || '');

  // ✅ GTM Unit Select
  if (selectedTableData.id === 'observationgtm' && cell === 'UNIT_SELECT') {
    return (
      <td className="px-3 py-2 whitespace-nowrap text-sm border-r border-gray-200 dark:border-gray-600 last:border-r-0">
        <Select
          options={unitsList}
          className="w-full text-sm"
          classNamePrefix="select"
          placeholder="Select unit..."
          value={unitsList.find(u => u.label === currentValue)}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '32px',
              fontSize: '0.875rem'
            })
          }}
          onChange={(selected) => {
            handleInputChange(rowIndex, colIndex, selected?.label || '');
            handleObservationBlur(rowIndex, colIndex, selected?.value?.toString() || '');
          }}
        />
      </td>
    );
  }

  // ✅ Static Text Cells (GTM, RTD WI)
  if (
    (selectedTableData.id === 'observationgtm' || selectedTableData.id === 'observationrtdwi') &&
    (cell === '-' || cell === 'UUC' || cell === 'Master')
  ) {
    return (
      <td className="px-3 py-2 whitespace-nowrap text-sm border-r border-gray-200 dark:border-gray-600 last:border-r-0 text-center font-medium">
        {cell}
      </td>
    );
  }

  // ✅ RTD WI Unit Select
  if (selectedTableData.id === 'observationrtdwi' && cell === 'UNIT_SELECT') {
    return (
      <td className="px-3 py-2 whitespace-nowrap text-sm border-r border-gray-200 dark:border-gray-600 last:border-r-0">
        <Select
          options={unitsList}
          className="w-full text-sm"
          classNamePrefix="select"
          placeholder="Select unit..."
          value={unitsList.find(u => u.label === currentValue)}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '32px',
              fontSize: '0.875rem'
            })
          }}
          onChange={(selected) => {
            handleInputChange(rowIndex, colIndex, selected?.label || '');
            handleObservationBlur(rowIndex, colIndex, selected?.value?.toString() || '');
          }}
        />
      </td>
    );
  }

  // ✅ Regular Input Cell
  const isDisabled = getDisabledStatus(
    selectedTableData.id,
    colIndex,
    row,
    cell,
    dynamicHeadings,
    disabledColumns
  );

  return (
    <td className="px-3 py-2 whitespace-nowrap text-sm border-r border-gray-200 dark:border-gray-600 last:border-r-0">
      <input
        type="text"
        className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white ${
          isDisabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
        } ${observationErrors[key] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
        value={currentValue}
        onChange={(e) => {
          if (isDisabled) return;
          handleInputChange(rowIndex, colIndex, e.target.value);
          if (observationErrors[key]) {
            setObservationErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[key];
              return newErrors;
            });
          }
        }}
        onBlur={(e) => {
          if (isDisabled) return;
          if (['observationctg', 'observationdpg', 'observationodfm', 'observationmm', 
               'observationit', 'observationmt', 'observationmg', 'observationfg', 
               'observationhg', 'observationppg', 'observationexm', 'observationmsr', 
               'observationgtm', 'observationdg', 'observationrtdwi'].includes(selectedTableData.id)) {
            handleObservationBlur(rowIndex, colIndex, e.target.value);
          } else {
            handleRowSave(rowIndex);
          }
        }}
        disabled={isDisabled}
      />
      {observationErrors[key] && (
        <div className="text-red-500 text-xs mt-1">{observationErrors[key]}</div>
      )}
    </td>
  );
}

export default TableCell;