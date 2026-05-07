
export const dinStatusOptions = [
  { value: -2, label: "Pending For Checklist", color: "warning" },
  { value: -1, label: "Pending For Approval", color: "info" },
  { value: 0, label: "Pending For Dispatch", color: "primary" },
  { value: 1, label: "Dispatched", color: "success" },
  { value: 99, label: "Din Rejected", color: "error" },
];

export const basisOptions = [
  { value: "Returnable", label: "Returnable" },
  { value: "Non-Returnable", label: "Non-Returnable" },
];
