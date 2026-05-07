import React from 'react'

function InstrumentInfo({ instrument, inwardEntry, caliblocation }) {
  return (
    <React.Fragment>
      <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-12 gap-4 text-sm">
                <div className="col-span-6 space-y-2">
                  <div className="flex">
                    <span className="w-48 font-medium text-gray-700 dark:text-gray-200">
                      Name Of The Equipment:
                    </span>
                    <span className="text-gray-900 dark:text-white">{instrument?.name || 'N/A'}</span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    PRESSURE, MASS & VOLUME LAB<br />
                    Alloted Lab: {caliblocation}
                  </div>
                  <div className="flex">
                    <span className="w-48 font-medium text-gray-700 dark:text-gray-200">Make:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.make || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 font-medium text-gray-700 dark:text-gray-200">Model:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.model || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 font-medium text-gray-700 dark:text-gray-200">SR no:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.serialno || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 font-medium text-gray-700 dark:text-gray-200">Id no:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.idno || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 font-medium text-gray-700 dark:text-gray-200">Calibrated On:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.startdate || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 font-medium text-gray-700 dark:text-gray-200">Issue Date:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.issuedate || 'N/A'}</span>
                  </div>
                </div>
                <div className="col-span-6 space-y-2">
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">BRN No:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.bookingrefno || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">Receive Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {inwardEntry?.sample_received_on || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">Range:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.equipmentrange || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">Least Count:</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.leastcount || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">Condition Of UUC:</span>
                    <span className="text-gray-900 dark:text-white">
                      {instrument?.conditiononrecieve || 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">
                      Calibration performed At:
                    </span>
                    <span className="text-gray-900 dark:text-white">{instrument?.performedat || 'Lab'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">Temperature (°C):</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.temperature || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-700 dark:text-gray-200">Humidity (%RH):</span>
                    <span className="text-gray-900 dark:text-white">{instrument?.humidity || 'N/A'}</span>
                  </div>
                </div>
              </div>
      </div>
    </React.Fragment>  
  )
}

export default InstrumentInfo;
