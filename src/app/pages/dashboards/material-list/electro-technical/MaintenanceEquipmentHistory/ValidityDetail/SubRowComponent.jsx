import { flexRender, useReactTable, getCoreRowModel } from "@tanstack/react-table";
// import { Fragment } from "react";
import { Table, THead, Tr, Th, TBody, Td } from "components/ui";
import { uncertinityColumns } from "./columns";  // Import uncertinity columns

export function SubRowComponent({ row }) {
  const { uncertinity = [], interpolation_formula = "N/A" } = row.original;

  // Create a sub-table for uncertinity
  const subTable = useReactTable({
    data: uncertinity,
    columns: uncertinityColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 bg-gray-50 dark:bg-dark-700">
      {/* uncertinity Detail Table */}
      <h3 className="text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">Masters Validity Detail uncertinity Detail</h3>
      <div className="overflow-x-auto">
        <Table className="w-full text-left">
          <THead>
            {subTable.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {subTable.getRowModel().rows.map((subRow) => (
              <Tr key={subRow.id}>
                {subRow.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      {/* Interpolation Formula Detail */}
      <h3 className="text-sm font-medium text-gray-700 dark:text-dark-200 mt-4 mb-2">Interpolation Formula Detail</h3>
      <div className="border border-gray-300 p-2 rounded">
        <p>{interpolation_formula}</p>
      </div>
    </div>
  );
}



// // SubRowComponent.js
// import { flexRender, useReactTable, getCoreRowModel } from "@tanstack/react-table";
// import { Table, THead, Tr, Th, TBody, Td } from "components/ui";
// import { uncertinityColumns } from "./columns";
// import { RowActions } from "./RowActions"; // Import the updated RowActions

// export function SubRowComponent({ row }) {
//   const { uncertinity = [], interpolation_formula = "N/A" } = row.original;

//   const subTable = useReactTable({
//     data: uncertinity,
//     columns: uncertinityColumns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <div className="p-4 bg-gray-50 dark:bg-dark-700">
//       <h3 className="text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">Masters Validity Detail uncertinity Detail</h3>
//       <div className="overflow-x-auto">
//         <Table className="w-full text-left">
//           <THead>
//             {subTable.getHeaderGroups().map((headerGroup) => (
//               <Tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <Th key={header.id}>
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </Th>
//                 ))}
//               </Tr>
//             ))}
//           </THead>
//           <TBody>
//             {subTable.getRowModel().rows.map((subRow) => (
//               <Tr key={subRow.id}>
//                 {subRow.getVisibleCells().map((cell) => (
//                   <Td key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     {cell.column.id === "action" && (
//                       <RowActions
//                         row={subRow.original}
//                         table={subTable}
//                         isuncertinityTable={true} // Pass true for uncertinity table
//                       />
//                     )}
//                   </Td>
//                 ))}
//               </Tr>
//             ))}
//           </TBody>
//         </Table>
//       </div>

//       <h3 className="text-sm font-medium text-gray-700 dark:text-dark-200 mt-4 mb-2">Interpolation Formula Detail</h3>
//       <div className="border border-gray-300 p-2 rounded">
//         <p>{interpolation_formula}</p>
//       </div>
//     </div>
//   );
// }