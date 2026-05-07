import React from 'react'
function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}
function DateNotesForm({ formData, handleFormChange }) {
  return (
    <React.Fragment>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Calibration End Date/Done date:
        </label>
        <input
            type="date"
            name="enddate"
            value={formatDateForInput(formData.enddate)}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
        />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Suggested Due Date:
        </label>
        <input
            type="date"
            name="duedate"
            value={formatDateForInput(formData.duedate)}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
        />
        </div>
    </div>
    </React.Fragment>
  )
}

export default DateNotesForm
