

function TableHeader({ tableStructure }) {
  return (
    <thead>
      {/* Main Headers */}
      <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        {tableStructure.headers.map((header, index) => (
          <th
            key={index}
            colSpan={header.colspan}
            className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600 last:border-r-0"
          >
            {header.name}
          </th>
        ))}
      </tr>

      {/* Sub Headers (if any) */}
      {tableStructure.subHeadersRow.some(item => item !== null) && (
        <tr className="bg-gray-50 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-600">
          {tableStructure.subHeadersRow.map((subHeader, index) => (
            <th
              key={index}
              className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 last:border-r-0"
            >
              {subHeader}
            </th>
          ))}
        </tr>
      )}
    </thead>
  );
}

export default TableHeader;