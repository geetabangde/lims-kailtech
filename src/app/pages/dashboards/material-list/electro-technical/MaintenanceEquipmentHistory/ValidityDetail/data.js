// import { ArrowPathIcon, CheckBadgeIcon, ClockIcon, TruckIcon, XCircleIcon } from "@heroicons/react/24/outline";

// export const orderStatusOptions = [
//     {
//         value: 'shipping',
//         label: 'Shipping',
//         color: 'info',
//         icon: TruckIcon
//     },
//     {
//         value: 'pending',
//         label: 'Pending',
//         color: 'warning',
//         icon: ClockIcon
//     },
//     {
//         value: 'completed',
//         label: 'Completed',
//         color: 'success',
//         icon: CheckBadgeIcon
//     },
//     {
//         value: 'processing',
//         label: 'Processing',
//         color: 'primary',
//         icon: ArrowPathIcon
//     },
//     {
//         value: 'cancelled',
//         label: 'Cancelled',
//         color: 'error',
//         icon: XCircleIcon
//     }
// ]

//  const validityDetailsList = [
//   {
//     unit_type: "Velocity",
//     mode: "Auto",
//     unit: "m/s",
//     instrument_range: "0 to 45",
//     calibrated_range: "0 to 38",
//     least_count: "0.1",
//     stability: "0",
//     uniformity: "0",
//     accuracy: "99%",
//   },
//   {
//     unit_type: "Pressure",
//     mode: "Manual",
//     unit: "Pa",
//     instrument_range: "0 to 100",
//     calibrated_range: "10 to 90",
//     least_count: "0.5",
//     stability: "0.2",
//     uniformity: "0.3",
//     accuracy: "98%",
//   },
//   {
//     unit_type: "Temperature",
//     mode: "Auto",
//     unit: "°C",
//     instrument_range: "-20 to 120",
//     calibrated_range: "-10 to 110",
//     least_count: "0.1",
//     stability: "0.1",
//     uniformity: "0.1",
//     accuracy: "97%",
//   }
// ];
//  const UnceratintyDetailsList = [
//   {
//     unit_type: "Velocity",
//     mode: "Auto",
//     unit: "m/s",
//    point: "10",
//    cmc: "0.5",
//    drift:"0.2",


//   },
//   {
//     unit_type: "Pressure",
//     mode: "Manual",
//     unit: "Pa",
//     point: "101",
//    cmc: "0.51",
//    drift:"0.21",
//   },
//   {
//     unit_type: "Temperature",
//     mode: "Auto",
//     unit: "°C",
//     point: "11",
//    cmc: "0.9",
//    drift:"0.4",
//   }
// ];

// export default {validityDetailsList, UnceratintyDetailsList};
import { ArrowPathIcon, CheckBadgeIcon, ClockIcon, TruckIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const orderStatusOptions = [
  {
    value: 'shipping',
    label: 'Shipping',
    color: 'info',
    icon: TruckIcon
  },
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning',
    icon: ClockIcon
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'processing',
    label: 'Processing',
    color: 'primary',
    icon: ArrowPathIcon
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    color: 'error',
    icon: XCircleIcon
  }
];

export const validityDetailsList = [
  {
    unit_type: "Velocity",
    mode: "Auto",
    unit: "m/s",
    instrument_range: "0 to 45",
    calibrated_range: "0 to 38",
    least_count: "0.1",
    stability: "0",
    uniformity: "0",
    accuracy: "99%",
  },
  {
    unit_type: "Pressure",
    mode: "Manual",
    unit: "Pa",
    instrument_range: "0 to 100",
    calibrated_range: "10 to 90",
    least_count: "0.5",
    stability: "0.2",
    uniformity: "0.3",
    accuracy: "98%",
  },
  {
    unit_type: "Temperature",
    mode: "Auto",
    unit: "°C",
    instrument_range: "-20 to 120",
    calibrated_range: "-10 to 110",
    least_count: "0.1",
    stability: "0.1",
    uniformity: "0.1",
    accuracy: "97%",
  }
];

export const uncertinityDetailsList = [
  {
    unit_type: "Velocity",
    mode: "Auto",
    unit: "m/s",
    point: "10",
    cmc: "0.5",
    drift: "0.2",
  },
  {
    unit_type: "Pressure",
    mode: "Manual",
    unit: "Pa",
    point: "101",
    cmc: "0.51",
    drift: "0.21",
  },
  {
    unit_type: "Temperature",
    mode: "Auto",
    unit: "°C",
    point: "11",
    cmc: "0.9",
    drift: "0.4",
  }
];