import  { useState } from 'react';
import {Button,THead,Table, TBody,Th,Tr, Td} from "components/ui"
import { useNavigate } from 'react-router';

// PHP: if(!in_array(69, $permissions)) header("location:index.php");
function usePermissions() {
  const p = localStorage.getItem("userPermissions");
  try {
    return JSON.parse(p) || [];
  } catch {
    return p?.split(",").map(Number) || [];
  }
}

const MasterReturnView = () => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  
  // All hooks must be called before any conditional returns
  const [currentPage, setCurrentPage] = useState(1);

  // PHP: if(!in_array(69, $permissions)) header("location:index.php");
  if (!permissions.includes(69)) {
    return (
      <div className="flex h-60 items-center justify-center rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Access Denied - Permission 69 required
        </p>
      </div>
    );
  }
  
  // Sample data - you can replace this with your actual data
  const data = [
    {
      id: 1,
      name: 'Load Cell (200kN) KTRC-CAL-EQ-FORC-04',
      returnBy: 'Hemant Ojha'
    },
    // Add more entries here as needed
  ].sort((a, b) => b.id - a.id);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const totalEntries = data.length;
  const showingStart = startIndex + 1;
  const showingEnd = Math.min(endIndex, totalEntries);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">View Master Return</h1>
        <Button
         variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/master-data")}
        >
          &lt;&lt; Back
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table className="w-full">
          <THead>
            <Tr className="bg-gray-50 border-b border-gray-200">
              <Th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</Th>
              <Th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</Th>
              <Th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Return By</Th>
              <Th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {currentData.map((item) => (
              <Tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <Td className="px-6 py-4 text-sm text-gray-700">{item.id}</Td>
                <Td className="px-6 py-4 text-sm text-gray-700">{item.name}</Td>
                <Td className="px-6 py-4 text-sm text-gray-700">{item.returnBy}</Td>
                <Td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button 
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    onClick ={()=>
                      navigate("/dashboards/master-data/master-calibration-return/fill-master-validity")
                    }
                    >
                      Fill Master Validity
                    </Button>
                    <Button className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
                      Returned Without Calibration
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>

        {/* Pagination Footer */}
        <div className="bg-white px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {showingStart} to {showingEnd} of {totalEntries} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </Button>
            <Button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
              {currentPage}
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterReturnView;