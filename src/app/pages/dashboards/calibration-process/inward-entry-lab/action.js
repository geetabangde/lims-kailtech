// import {
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
//   Transition,
// } from "@headlessui/react";
// import {
//   EllipsisHorizontalIcon,
//   PencilIcon,
// } from "@heroicons/react/24/outline";
// import clsx from "clsx";
// import { Fragment, useCallback, useState } from "react";
// import PropTypes from "prop-types";
// import { ConfirmModal } from "components/shared/ConfirmModal";
// import { Button } from "components/ui";
// import axios from "utils/axios";
// import { toast } from "sonner";
// import { useNavigate, useLocation } from "react-router";

// // ----------------------------------------------------------------------

// const confirmMessages = {
//   pending: {
//     description:
//       "Are you sure you want to delete this Inward Entry? Once deleted, it cannot be restored.",
//   },
//   success: {
//     title: "Inward Entry operation deleted",
//   },
// };

// export function RowActions({ row, table }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);
//   const [deleteError, setDeleteError] = useState(false);

//   // Convert localStorage string to array of numbers
//   const permissions =
//     localStorage.getItem("userPermissions")?.split(",").map(Number) || [];

//   // console.log("User permissions:", permissions);

//   const closeModal = () => {
//     setDeleteModalOpen(false);
//   };

//   const handleDeleteRows = useCallback(async () => {
//     const id = row.original.id;
//     // const status = row.original.status;
//     const params = new URLSearchParams(location.search);
//     const caliblocation =
//       params.get("caliblocation") || row.original.caliblocation || "Lab";
//     const calibacc =
//       params.get("calibacc") || row.original.calibacc || "Nabl";

//     setConfirmDeleteLoading(true);

//     try {
//       await axios.delete(
//         `/calibrationoperations/calibration-method-destroy/${id}?caliblocation=${encodeURIComponent(
//           caliblocation
//         )}&calibacc=${encodeURIComponent(calibacc)}`
//       );
//       table.options.meta?.deleteRow(row);
//       setDeleteSuccess(true);
//       toast.success("Calibration operation deleted ✅", {
//         duration: 1000,
//         icon: "🗑️",
//       });
//     } catch (error) {
//       console.error("Delete failed:", error);
//       setDeleteError(true);
//       toast.error("Failed to delete calibration operation ❌", {
//         duration: 2000,
//       });
//     } finally {
//       setConfirmDeleteLoading(false);
//     }
//   }, [row, table, location.search]);

//   const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

//   const getNavigationUrl = (path) => {
//     const params = new URLSearchParams(location.search);
//     const caliblocation =
//       params.get("caliblocation") || row.original.caliblocation || "Lab";
//     const calibacc =
//       params.get("calibacc") || row.original.calibacc || "Nabl";
//     return `${path}?caliblocation=${encodeURIComponent(
//       caliblocation
//     )}&calibacc=${encodeURIComponent(calibacc)}`;
//   };

//   // Actions list with permission property
//   const actions = [
//     // Conditionally include "Add Inward Item" based on status
//     ...(row.original.status === -1
//       ? [
//         {
//           label: "Add Inward Item",
//           permission: 98,
//           onClick: () =>
//             navigate(
//               getNavigationUrl(
//                 `/dashboards/calibration-process/inward-entry-lab/add-inward-item/${row.original.id}`
//               )
//             ),
//         },
//       ]
//       : []),
//     ...(row.original.status === 4 || row.original.status === 5 || row.original.status === 11
//       ? [
//         {
//           label: "Edit CRF Entry Detail",

//           onClick: () =>
//             navigate(
//               getNavigationUrl(
//                 `/dashboards/calibration-process/inward-entry-lab/edit-inward-entry/${row.original.id}`
//               )
//             ),
//         },
//       ]
//       : []),
//     ...(row.original.status === 0
//       ? [
//         {
//           label: "Review Inward",
//           permission: 99,
//           onClick: () =>
//             navigate(
//               getNavigationUrl(
//                 `/dashboards/calibration-process/inward-entry-lab/review-inward/${row.original.id}`
//               )
//             ),
//         },
//       ]
//       : []),
//     ...(row.original.status === 1
//       ? [
//         {
//           label: "Technical Acceptance",
//           permission: 100,
//           onClick: () =>
//             navigate(
//               getNavigationUrl(
//                 `/dashboards/calibration-process/inward-entry-lab/technical-acceptance/${row.original.id}`
//               )
//             ),
//         },
//       ]
//       : []),
//     ...(row.original.status === 2
//       ? [
//         {
//           label: "Edit Bd Person",
//           permission: 101,
//           onClick: () =>
//             navigate(
//               getNavigationUrl(
//                 `/dashboards/calibration-process/inward-entry-lab/edit-bd-person/${row.original.id}`
//               )
//             ),
//         },

//       ]
//       : []),
//     ...(row.original.status === 4
//       ? [
//         {
//           label: "Perform Calibration",
//           permission: 97,
//           onClick: () =>
//             navigate(
//               getNavigationUrl(
//                 `/dashboards/calibration-process/inward-entry-lab/perform-calibration/${row.original.id}`
//               )
//             ),
//         },
//       ]
//       : []),

//     {
//       label: "Edit Bd Person",
//       permission: 406,
//       onClick: () =>
//         navigate(
//           getNavigationUrl(
//             `/dashboards/calibration-process/inward-entry-lab/edit-bd-person/${row.original.id}`
//           )
//         ),
//     },
//     ...(row.original.status === 2
//       ? [
//         {
//           label: "Transfer In lab",
//           // permission:101,
//           onClick: () =>
//             navigate(
//               getNavigationUrl(
//                 `/dashboards/calibration-process/inward-entry-lab/sample-transfer-in-lab/${row.original.id}`
//               )
//             ),
//         },
//       ]
//       : []),
//     {
//       label: "SRF View",
//       permission: 372,
//       onClick: () =>
//         navigate(
//           getNavigationUrl(
//             `/dashboards/calibration-process/inward-entry-lab/srf-view/${row.original.id}`
//           )
//         ),
//     },
//     {
//       label: "CRF View",
//       permission: 373,
//       onClick: () =>
//         navigate(
//           getNavigationUrl(
//             `/dashboards/calibration-process/inward-entry-lab/crf-view/${row.original.id}`
//           )
//         ),
//     },
//     {
//       label: "Edit Work Order detail",
//       onClick: () =>
//         navigate(
//           getNavigationUrl(
//             `/dashboards/calibration-process/inward-entry-lab/edit-work-order/${row.original.id}`
//           )
//         ),
//     },
//     {
//       label: "Edit Customer Responsible for payment",
//       permission: 297,
//       onClick: () =>
//         navigate(
//           getNavigationUrl(
//             `/dashboards/calibration-process/inward-entry-lab/edit-customer/${row.original.id}`
//           )
//         ),
//     },
//     {
//       label: "Edit Billing Detail",
//       permission: 407,
//       onClick: () =>
//         navigate(
//           getNavigationUrl(
//             `/dashboards/calibration-process/inward-entry-lab/edit-billing/${row.original.id}`
//           )
//         ),
//     },
//     {
//       label: "Fill Feedback form",

//       onClick: () =>
//         navigate(
//           getNavigationUrl(
//             `/dashboards/calibration-process/inward-entry-lab/edit-billing/${row.original.id}`
//           )
//         ),
//     },



//   ];

//   // Filter actions based on permission (if defined)
//   const filteredActions = actions.filter(
//     (action) =>
//       !action.permission || permissions.includes(action.permission)
//   );

//   return (
//     <>
//       <div className="flex justify-center space-x-1.5">
//         <Menu as="div" className="relative inline-block text-left">
//           <MenuButton as={Button} isIcon className="size-8 rounded-full">
//             <EllipsisHorizontalIcon className="size-4.5" />
//           </MenuButton>

//           <Transition
//             as={Fragment}
//             enter="transition ease-out"
//             enterFrom="opacity-0 translate-y-2"
//             enterTo="opacity-100 translate-y-0"
//             leave="transition ease-in"
//             leaveFrom="opacity-100 translate-y-0"
//             leaveTo="opacity-0 translate-y-2"
//           >
//             <MenuItems
//               anchor={{ placement: 'bottom-end', gutter: 12, flip: false }}
//               className="absolute z-[10000] w-56 rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 dark:border-dark-500 dark:bg-dark-750 dark:shadow-none overflow-y-auto max-h-[400px]"
//             >
//               {filteredActions.map((action) => (
//                 <MenuItem key={action.label}>
//                   {({ focus }) => (
//                     <button
//                       onClick={action.onClick}
//                       className={clsx(
//                         "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors",
//                         focus
//                           ? "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
//                           : ""
//                       )}
//                     >
//                       <PencilIcon className="size-4.5 stroke-1" />
//                       <span>{action.label}</span>
//                     </button>
//                   )}
//                 </MenuItem>
//               ))}
//             </MenuItems>
//           </Transition>
//         </Menu>
//       </div>

//       <ConfirmModal
//         show={deleteModalOpen}
//         onClose={closeModal}
//         messages={confirmMessages}
//         onOk={handleDeleteRows}
//         confirmLoading={confirmDeleteLoading}
//         state={state}
//       />
//     </>
//   );
// }

// RowActions.propTypes = {
//   row: PropTypes.object,
//   table: PropTypes.object,
// };




//--------------------- new code without dropdown---------------------

import clsx from "clsx";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import axios from "utils/axios";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";



const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this Inward Entry? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Inward Entry operation deleted",
  },
};

export function RowActions({ row, table }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  // Convert localStorage string to array of numbers
  const permissions =
    localStorage.getItem("userPermissions")?.split(",").map(Number) || [];

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteRows = useCallback(async () => {
    const id = row.original.id;
    const params = new URLSearchParams(location.search);
    const caliblocation =
      params.get("caliblocation") || row.original.caliblocation || "Lab";
    const calibacc =
      params.get("calibacc") || row.original.calibacc || "Nabl";

    setConfirmDeleteLoading(true);

    try {
      await axios.delete(
        `/calibrationoperations/calibration-method-destroy/${id}?caliblocation=${encodeURIComponent(
          caliblocation
        )}&calibacc=${encodeURIComponent(calibacc)}`
      );
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success("Calibration operation deleted ✅", {
        duration: 1000,
        icon: "🗑️",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete calibration operation ❌", {
        duration: 2000,
      });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table, location.search]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  const getNavigationUrl = (path) => {
    const params = new URLSearchParams(location.search);
    const caliblocation =
      params.get("caliblocation") || row.original.caliblocation || "Lab";
    const calibacc =
      params.get("calibacc") || row.original.calibacc || "Nabl";
    return `${path}?caliblocation=${encodeURIComponent(
      caliblocation
    )}&calibacc=${encodeURIComponent(calibacc)}`;
  };

  // Actions list with permission property
  const actions = [
    ...(row.original.status === -1
      ? [
          {
            label: "Add Inward Item",
           // color: "bg-orange-500 hover:bg-orange-600 text-white",
           color:
      "bg-gradient-to-r from-emerald-400 to-green-600 hover:from-emerald-500 hover:to-green-700 text-white",
   
           permission: 98,
            onClick: () =>
              navigate(
                getNavigationUrl(
                  `/dashboards/calibration-process/inward-entry-lab/add-inward-item/${row.original.id}`
                )
              ),
          },
        ]
      : []),
    // ...(row.original.status === 4 || row.original.status === 5 || row.original.status === 11
    //   ? [
    //       {
    //         label: "Edit CRF Entry Detail",
    //         // color: "bg-orange-400 hover:bg-orange-700 text-white",
    //          color:
    //   "bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 text-white",
    //         onClick: () =>
    //           navigate(
    //             getNavigationUrl(
    //               `/dashboards/calibration-process/inward-entry-lab/edit-inward-entry/${row.original.id}`
    //             )
    //           ),
    //       },
    //     ]
    //   : []),
   
          {
            label: "Edit CRF Entry Detail",
            // color: "bg-orange-400 hover:bg-orange-700 text-white",
             color:
      "bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 text-white",
            onClick: () =>
              navigate(
                getNavigationUrl(
                  `/dashboards/calibration-process/inward-entry-lab/edit-inward-entry/${row.original.id}`
                )
              ),
          },
        
      
    ...(row.original.status === 0
      ? [
          {
            label: "Review Inward",
           // color: "bg-orange-500 hover:bg-orange-600 text-white",
           color:
      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white",
            permission: 99,
            onClick: () =>
              navigate(
                getNavigationUrl(
                  `/dashboards/calibration-process/inward-entry-lab/review-inward/${row.original.id}`
                )
              ),
          },
        ]
      : []),
    ...(row.original.status === 1
      ? [
          {
            label: "Technical Acceptance",
           // color: "bg-orange-400 hover:bg-orange-600 text-white",
          //color:"bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg",
           color:
      "bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600 text-white",
            permission: 100,
            onClick: () =>
              navigate(
                getNavigationUrl(
                  `/dashboards/calibration-process/inward-entry-lab/technical-acceptance/${row.original.id}`
                )
              ),
          },
        ]
      : []),
    // ...(row.original.status === 2
    //   ? [
    //       {
    //         label: "Edit Bd Person",
    //         // color: "bg-green-600 hover:bg-green-700 text-white",
    //         //color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg",
    //         color:
    //   "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white",

    //         permission: 101,
    //         onClick: () =>
    //           navigate(
    //             getNavigationUrl(
    //               `/dashboards/calibration-process/inward-entry-lab/edit-bd-person/${row.original.id}`
    //             )
    //           ),
    //       },
    //     ]
    //   : []),
    ...(row.original.status === 4
      ? [
          {
            label: "Perform Calibration",
            // color: "bg-green-600 hover:bg-green-700 text-white",
                        // color: "bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg",
                          color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",

            permission: 97,
            onClick: () =>
              navigate(
                getNavigationUrl(
                  `/dashboards/calibration-process/inward-entry-lab/perform-calibration/${row.original.id}`
                )
              ),
          },
        ]
      : []),
    {
      label: "Edit Bd Person",
       //color: "bg-orange-400 hover:bg-orange-700 text-white",
       //color: "bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg",
       color:
      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white",

      permission: 406,
      onClick: () =>
        navigate(
          getNavigationUrl(
            `/dashboards/calibration-process/inward-entry-lab/edit-bd-person/${row.original.id}`
          )
        ),
    },
    ...(row.original.status === 2
      ? [
          {
            label: "Transfer In lab",
            // color: "bg-orange-400 hover:bg-orange-700 text-white",
            color:
      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white",
            onClick: () =>
              navigate(
                getNavigationUrl(
                  `/dashboards/calibration-process/inward-entry-lab/sample-transfer-in-lab/${row.original.id}`
                )
              ),
          },
        ]
      : []),
    {
      label: "SRF View",
      // color: "bg-orange-400 hover:bg-orange-700 text-white",
      color:
      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white",
      permission: 372,
      onClick: () =>
        navigate(
          getNavigationUrl(
            `/dashboards/calibration-process/inward-entry-lab/srf-view/${row.original.id}`
          )
        ),
    },
    {
      label: "CRF View",
      //   color:
      // "bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 text-white",
      color:
      "bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white",
      permission: 373,
      onClick: () =>
        navigate(
          getNavigationUrl(
            `/dashboards/calibration-process/inward-entry-lab/crf-view/${row.original.id}`
          )
        ),
    },
    {
      label: "Edit Work Order detail",
      // color: "bg-green-600 hover:bg-green-700 text-white",
      // color:
      // "bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 text-white",
      color:
      "bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white",
      onClick: () =>
        navigate(
          getNavigationUrl(
            `/dashboards/calibration-process/inward-entry-lab/edit-work-order/${row.original.id}`
          )
        ),
    },
    {
      label: "Edit Customer Responsible for payment",
        // color: "bg-green-600 hover:bg-green-700 text-white",
         color:
      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white",
      permission: 297,
      onClick: () =>
        navigate(
          getNavigationUrl(
            `/dashboards/calibration-process/inward-entry-lab/edit-customer/${row.original.id}`
          )
        ),
    },
    {
      label: "Edit Billing Detail",
      // color: "bg-orange-400 hover:bg-orange-700 text-white",
       color:
      "bg-gradient-to-r from-yellow-300 to-lime-400 hover:from-yellow-400 hover:to-lime-500 text-gray-900 font-semibold",
      permission: 407,
      onClick: () =>
        navigate(
          getNavigationUrl(
            `/dashboards/calibration-process/inward-entry-lab/edit-billing/${row.original.id}`
          )
        ),
    },
    {
      label: "Fill Feedback form",
         //color: "bg-green-600 hover:bg-green-700 text-white",
         color:
      "bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 text-white",
      onClick: () =>
        navigate(
          getNavigationUrl(
            `/dashboards/calibration-process/inward-entry-lab/edit-billing/${row.original.id}`
          )
        ),
        
    },
  ];

  // Filter actions based on permission (if defined)
  const filteredActions = actions.filter(
    (action) =>
      !action.permission || permissions.includes(action.permission)
  );

  return (
    <>
      <div className="flex flex-wrap justify-left gap-2">
        {filteredActions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            className={clsx(
            "h-6 space-x-1.5 rounded-md px-1 text-xs font-medium outline-none transition-colors",
            action.color
            )}
         
          >
            {/* <PencilIcon className="size-4 stroke-1" /> */}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );

}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};




