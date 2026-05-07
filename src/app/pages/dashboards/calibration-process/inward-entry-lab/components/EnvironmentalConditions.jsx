import React from "react";

function EnvironmentalConditions({
  formData,
  handleFormChange,
  errors,
  temperatureRange,
  humidityRange,
}) {
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Temperature End (°C) <span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="tempend"
            value={formData.tempend}
            onChange={handleFormChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-white"
            placeholder="Enter temperature range"
            // required attribute removed
          />
          {errors.tempend && (
            <p className="mt-1 text-xs text-red-500">{errors.tempend}</p>
          )}
          {!errors.tempend && !formData.tempend && (
            <p className="mt-1 text-xs text-red-500">This field is required</p>
          )}
          {temperatureRange && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Range:{" "}
              {temperatureRange.min
                ? `${temperatureRange.min} - ${temperatureRange.max}`
                : temperatureRange.value || "N/A"}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Humidity End (%RH) <span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="humiend"
            value={formData.humiend}
            onChange={handleFormChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-white"
            placeholder="Enter humidity range"
            // required attribute removed
          />
          {errors.humiend && (
            <p className="mt-1 text-xs text-red-500">{errors.humiend}</p>
          )}
          {!errors.humiend && !formData.humiend && (
            <p className="mt-1 text-xs text-red-500">This field is required</p>
          )}
          {humidityRange && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Range:{" "}
              {humidityRange.min
                ? `${humidityRange.min} - ${humidityRange.max}`
                : humidityRange.value || "N/A"}
            </p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default EnvironmentalConditions;
