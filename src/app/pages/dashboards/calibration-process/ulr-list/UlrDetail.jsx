import  { useState } from 'react';


export default function ULRList() {
  const [startDate, setStartDate] = useState('05/10/2023');
  const [endDate, setEndDate] = useState('05/11/2025');
  const [customer, setCustomer] = useState('DILIP BUILDCON LIMITED(9826729981)');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <h1 className="text-2xl font-normal text-gray-800 mb-6">ULR List</h1>
        
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Start Date */}
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-normal w-24">Start Date</label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* End Date */}
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-normal w-24">End Date</label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Customer and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Dropdown */}
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-normal w-24">Customer</label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px'
              }}
            >
              <option value="DILIP BUILDCON LIMITED(9826729981)">
                DILIP BUILDCON LIMITED(9826729981)
              </option>
            </select>
          </div>
          
          {/* Search Button */}
          <div className="flex items-center gap-4">
            <div className="w-24"></div>
            <button className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-300 rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  ID no
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Certificate no
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  ULR No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Receive Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Issue Date
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Empty table body - data will be populated after search */}
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  No records found. Click Search to load data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scrollbar indicator at bottom */}
        <div className="mt-2 relative">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-400 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}