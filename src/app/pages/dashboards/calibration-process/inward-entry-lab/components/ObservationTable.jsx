import React from 'react';
import DynamicModeAlert from './DynamicModeAlert';
import MultiUnitTable from './MultiUnitTable';
import SingleObservationTable from './SingleObservationTable';

function ObservationTable({
  observationTemplate,
  selectedTableData,
  tableStructure,
  tableInputValues,
  observationErrors,
  handleInputChange,
  handleObservationBlur,
  handleRowSave,
  unitsList,
  dynamicHeadings,
  suffix,
  renderThermalCoefficientSection,
  setObservationErrors,
  observations
}) {
  return (
    <React.Fragment>
      {renderThermalCoefficientSection()}

      <div className="mb-6">
        <h2 className="text-md font-medium text-gray-800 dark:text-white mb-4">
          Observation Detail
        </h2>

        {/* Current Template Info */}
        {observationTemplate && (
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Current Observation Template:</strong> {observationTemplate}
            </p>
          </div>
        )}

        {selectedTableData && tableStructure && (
          <div className="space-y-6">
            {/* Dynamic Mode Alert */}
            <DynamicModeAlert 
              dynamicHeadings={dynamicHeadings} 
              suffix={suffix} 
            />

            {/* Conditional Rendering: Multi-Unit vs Single Table */}
            {selectedTableData.id === 'observationmm' && selectedTableData.unitTypes ? (
              <MultiUnitTable
                selectedTableData={selectedTableData}
                tableStructure={tableStructure}
                tableInputValues={tableInputValues}
                observationErrors={observationErrors}
                handleInputChange={handleInputChange}
                handleObservationBlur={handleObservationBlur}
                setObservationErrors={setObservationErrors}
              />
            ) : (
              <SingleObservationTable
                selectedTableData={selectedTableData}
                tableStructure={tableStructure}
                tableInputValues={tableInputValues}
                observationErrors={observationErrors}
                handleInputChange={handleInputChange}
                handleObservationBlur={handleObservationBlur}
                handleRowSave={handleRowSave}
                unitsList={unitsList}
                dynamicHeadings={dynamicHeadings}
                setObservationErrors={setObservationErrors}
              />
            )}
          </div>
        )}

        {/* No Data Message */}
        {observationTemplate && observations.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No observations found for template: {observationTemplate}</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default ObservationTable;