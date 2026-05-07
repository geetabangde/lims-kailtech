import React from 'react'

function ThermalCoefficientForm({ thermalCoeff, setThermalCoeff, handleThermalCoeffBlur, selectedTableData }) {
  
  return (
    <React.Fragment>
    <div className="mb-6">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Thermal Coefficient</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600">
              <div className={`grid ${selectedTableData.id === 'observationmt' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    UUC Thermal Coefficient:
                  </label>
                  <input
                    type="text"
                    value={thermalCoeff.uuc}
                    onChange={(e) => setThermalCoeff((prev) => ({ ...prev, uuc: e.target.value }))}
                    onBlur={(e) => handleThermalCoeffBlur('thermalcoffuuc', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    placeholder="Enter UUC thermal coefficient"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Master Thermal Coefficient:
                  </label>
                  <input
                    type="text"
                    value={thermalCoeff.master}
                    onChange={(e) => setThermalCoeff((prev) => ({ ...prev, master: e.target.value }))}
                    onBlur={(e) => handleThermalCoeffBlur('thermalcoffmaster', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    placeholder="Enter master thermal coefficient"
                  />
                </div>
                {/* Additional field for MT */}
                {selectedTableData.id === 'observationmt' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Thickness of graduation Line:
                    </label>
                    <input
                      type="text"
                      value={thermalCoeff.thickness_of_graduation}
                      onChange={(e) => setThermalCoeff((prev) => ({ ...prev, thickness_of_graduation: e.target.value }))}
                      onBlur={(e) => handleThermalCoeffBlur('thicknessofgraduation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      placeholder="Enter thickness"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
      
    </React.Fragment>
  )
}

export default ThermalCoefficientForm
