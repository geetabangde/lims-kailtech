import React from 'react'

function Notes({ formData, handleFormChange }) {
  return (
    <React.Fragment>
    <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes:</label>
        <textarea
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            placeholder="Enter notes"
        />
    </div>
    </React.Fragment>
  )
}

export default Notes
