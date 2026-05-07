// Static customer names
const customerNames = [
  "John Smith",
  "Emily Johnson",
  "Michael Brown",
  "Sarah Davis",
  "David Wilson",
  "Lisa Miller",
  "James Taylor",
  "Jennifer Garcia",
  "Robert Martinez",
  "Mary Rodriguez",
  "Christopher Lee",
  "Patricia White",
  "Daniel Harris",
  "Linda Clark",
  "Matthew Lewis"
];

// Function to generate random due dates
const generateDueDate = () => {
  const today = new Date();
  const daysToAdd = Math.floor(Math.random() * 30) + 1; // Random 1-30 days from today
  const dueDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
  return dueDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
};

// Function to add static data to API response
export const addStaticDataToRecords = (apiData) => {
  return apiData.map((item, index) => ({
    ...item,
    customerName: customerNames[index % customerNames.length] || `Customer ${index + 1}`,
    dueDate: generateDueDate(index)
  }));
};

// Alternative with fixed due dates (if you want consistent dates)
export const addStaticDataWithFixedDates = (apiData) => {
  return apiData.map((item, index) => ({
    ...item,
    customerName: customerNames[index % customerNames.length] || `Customer ${index + 1}`,
    dueDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};