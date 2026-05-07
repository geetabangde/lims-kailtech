import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import { toast } from "sonner";

const CloneItem = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Get URL parameters
    const searchParams = new URLSearchParams(window.location.search);
    const caliblocation = searchParams.get("caliblocation") || "Lab";
    const calibacc = searchParams.get("calibacc") || "Nabl";

    const [searchCriteria, setSearchCriteria] = useState({
        type: '',
        customer: '',
        startDate: '',
        endDate: ''
    });

    // Mock data for instrument list
    const [instrumentList, setInstrumentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleBackToPerformCalibration = () => {
        navigate(`/dashboards/calibration-process/inward-entry-lab/perform-calibration/${id}?caliblocation=${caliblocation}&calibacc=${calibacc}`);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            // Mock data based on search criteria
            const mockData = [
                { 
                    srNo: 1, 
                    brnNo: 'BRN001', 
                    lrnNo: 'LRN001', 
                    name: 'Analogue Vacuum Gauge', 
                    idNo: 'ID001', 
                    serial: 'SER001', 
                    make: 'ABC Corp', 
                    modelNo: 'AVG123' 
                },
                { 
                    srNo: 2, 
                    brnNo: 'BRN002', 
                    lrnNo: 'LRN002', 
                    name: 'Digital Pressure Gauge', 
                    idNo: 'ID002', 
                    serial: 'SER002', 
                    make: 'XYZ Inc', 
                    modelNo: 'DPG456' 
                },
                { 
                    srNo: 3, 
                    brnNo: 'BRN003', 
                    lrnNo: 'LRN003', 
                    name: 'Temperature Sensor', 
                    idNo: 'ID003', 
                    serial: 'SER003', 
                    make: 'Test Labs', 
                    modelNo: 'TS789' 
                }
            ];
            
            setInstrumentList(mockData);
            setIsLoading(false);
            toast.success("Search completed successfully!");
        }, 1000);
    };

    const handleClone = (instrument) => {
        // Implement clone logic here
        toast.success(`Instrument ${instrument.name} cloned successfully!`);
        // Navigate back after cloning
        setTimeout(() => {
            handleBackToPerformCalibration();
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Page title="Clone Item">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-800">Search Instrument</h1>
                    <Button
                        variant="outline"
                        onClick={handleBackToPerformCalibration}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        &lt;&lt; Back to Perform Calibration
                    </Button>
                </div>

                <div className="p-4">
                    <form onSubmit={handleSearch} className="mb-6">
                        {/* First Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    name="type"
                                    value={searchCriteria.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Analogue Vacuum Gauge">Analogue Vacuum Gauge(Negative Pressure (0 to -0...)</option>
                                    <option value="Digital Pressure">Digital Pressure Gauge</option>
                                    <option value="Temperature">Temperature Sensor</option>
                                    <option value="Electrical">Electrical Multimeter</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                <select
                                    name="customer"
                                    value={searchCriteria.customer}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Customer</option>
                                    <option value="DILIP BUILDCON LIMITED">DILIP BUILDCON LIMITED(9826729981)</option>
                                    <option value="ABC Corp">ABC Corp</option>
                                    <option value="XYZ Inc">XYZ Inc</option>
                                    <option value="Test Labs">Test Labs</option>
                                </select>
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={searchCriteria.startDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={searchCriteria.endDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-800">Instrument List</h2>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-secondary hover:bg-cyan-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
                            >
                                {isLoading ? "Searching..." : "Search"}
                            </Button>
                        </div>
                    </form>

                    {/* Instrument List Table */}
                    <div className="overflow-x-auto">
                        {instrumentList.length > 0 ? (
                            <table className="w-full text-sm border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-yellow-300">
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left">Sr. No</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left">BRN No</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left">LRN No</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left">Name</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left">Id No</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left">Serial</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left bg-yellow-400">Make</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left bg-yellow-400">Model No</th>
                                        <th className="p-3 font-medium text-gray-800 border border-gray-300 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instrumentList.map((instrument) => (
                                        <tr key={instrument.srNo} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 border border-gray-300">{instrument.srNo}</td>
                                            <td className="p-3 border border-gray-300">{instrument.brnNo}</td>
                                            <td className="p-3 border border-gray-300">{instrument.lrnNo}</td>
                                            <td className="p-3 border border-gray-300">{instrument.name}</td>
                                            <td className="p-3 border border-gray-300">{instrument.idNo}</td>
                                            <td className="p-3 border border-gray-300">{instrument.serial}</td>
                                            <td className="p-3 border border-gray-300">{instrument.make}</td>
                                            <td className="p-3 border border-gray-300">{instrument.modelNo}</td>
                                            <td className="p-3 border border-gray-300">
                                                <Button
                                                    onClick={() => handleClone(instrument)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                >
                                                    Clone
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No instruments found. Please search to see results.</p>
                            </div>
                        )}
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                            <span className="ml-3 text-gray-600">Searching instruments...</span>
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
};

export default CloneItem;