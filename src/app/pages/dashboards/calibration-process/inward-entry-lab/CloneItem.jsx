import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import { toast } from "sonner";
import axios from "utils/axios";
import ReactSelect from "react-select";

const CloneItem = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Inward ID from route
    
      const { id: inwardId, itemId: instId } = useParams();

    const searchParams = new URLSearchParams(window.location.search);
    const caliblocation = searchParams.get("caliblocation") || "Lab";
    const calibacc = searchParams.get("calibacc") || "Nabl";
  
    const [searchCriteria, setSearchCriteria] = useState({
        type: "",
        customer: "",
        startDate: "",
        endDate: "",
       
    });

    const [instrumentOptions, setInstrumentOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [instrumentList, setInstrumentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🔹 Fetch instrument list
   useEffect(() => {
    const fetchInstruments = async () => {
        try {
            const res = await axios.get(
                `material/get-instruments-list?location=${caliblocation}`
            );
            if (res.data?.success === true) {   // <-- yaha change
                setInstrumentOptions(res.data.data || []);
                console.log("Fetched instruments:", res.data.data);
            }
        } catch (error) {
            console.error("Error fetching instruments:", error);
        }
    };
    fetchInstruments();
}, []);


    // 🔹 Fetch customer list
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axios.get("people/get-customer-type-list");
                if (res.data?.status === "true") {
                    setCustomerOptions(res.data.Data || []);
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };
        fetchCustomers();
    }, []);

    const handleBackToPerformCalibration = () => {
        navigate(
            `/dashboards/calibration-process/inward-entry-lab/perform-calibration/${id}?caliblocation=${caliblocation}&calibacc=${calibacc}`
        );
    };

    // 🔹 Search API
    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                instid: searchCriteria.type,
                customer: searchCriteria.customer,
                startdate: searchCriteria.startDate,
                enddate: searchCriteria.endDate
            };
            console.log("📤 Sending payload:", payload);

            const res = await axios.post(
                "calibrationprocess/filter-Inward-Items-forclone",
                payload
            );

            //   console.log("📥 Response:", res.data);

            if (res.data?.status === "true" && Array.isArray(res.data.data)) {
                setInstrumentList(res.data.data);
                toast.success("Search completed successfully!");
            } else {
                setInstrumentList([]);
                toast.error("No instruments found.");
            }
        } catch (error) {
            console.error("Error searching instruments:", error);
            toast.error("Search failed!");
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Clone API
    const handleClone = async (instrument) => {
        try {
            const payload = {
                inwardid:inwardId, 
                instid:instId, 
                refinwardid: instrument.inwardid, 
                refinstid: instrument.id 
            };

            console.log("📤 Clone Payload:", payload);

            const res = await axios.post("calibrationprocess/clone-crf", payload);

            console.log("📥 Clone Response:", res.data);

            if (res.data?.status === "true") {
                toast.success(`Instrument ${instrument.name} cloned successfully!`);
                setTimeout(() => {
                    handleBackToPerformCalibration();
                }, 1500);
            } else {
                toast.error("Clone failed. Please try again.");
            }
        } catch (error) {
            console.error("Error cloning instrument:", error);
            toast.error("Clone failed!");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Page title="Clone Item">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Search Instrument
                    </h1>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>

                                <ReactSelect
                                    name="type"
                                    options={instrumentOptions.map((item) => ({
                                        value: item.id,
                                        label: `${item.id} - ${item.name}`,
                                    }))}
                                    value={
                                        instrumentOptions
                                            .map((item) => ({
                                                value: item.id,
                                                label: `${item.id} - ${item.name}`,
                                            }))
                                            .find((opt) => opt.value === searchCriteria.type) || null
                                    }
                                    onChange={(selected) =>
                                        handleChange({
                                            target: { name: "type", value: selected ? selected.value : "" },
                                        })
                                    }
                                    placeholder="Select"
                                />
                                    {/* <ReactSelect
                                      className="w-full"
                                      name="instrument"
                                      isDisabled={loading}
                                      placeholder="Select Instrument"
                                      options={instrumentList.map((inst) => ({
                                        value: inst.id,
                                        label: `${inst.id} - ${inst.name}`, // 👈 id - name
                                      }))}
                                      value={
                                        instrumentList
                                          .filter((inst) => inst.id === selectedInstrument)
                                          .map((inst) => ({
                                            value: inst.id,
                                            label: `${inst.id} - ${inst.name}`,
                                          }))[0] || null
                                      }
                                      onChange={(selected) =>
                                        setSelectedInstrument(selected ? selected.value : null)
                                      }
                                    /> */}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer
                                </label>
                                <ReactSelect
                                    name="customer"
                                    options={customerOptions.map((cust) => ({
                                        value: cust.id,
                                        label: cust.name,
                                    }))}
                                    value={
                                        customerOptions
                                            .map((cust) => ({ value: cust.id, label: cust.name }))
                                            .find((opt) => opt.value === searchCriteria.customer) || null
                                    }
                                    onChange={(selected) =>
                                        handleChange({
                                            target: { name: "customer", value: selected ? selected.value : "" },
                                        })
                                    }
                                    placeholder="Select Customer"
                                />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={searchCriteria.startDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
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
                            <h2 className="text-lg font-medium text-gray-800">
                                Instrument List
                            </h2>
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
                                        <th className="p-3 border border-gray-300 text-left">
                                            Sr. No
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left">
                                            BRN No
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left">
                                            LRN No
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left">
                                            Name
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left">
                                            Id No
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left">
                                            Serial
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left bg-yellow-400">
                                            Make
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left bg-yellow-400">
                                            Model No
                                        </th>
                                        <th className="p-3 border border-gray-300 text-left">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instrumentList.map((instrument, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3 border">{index + 1}</td>
                                            <td className="p-3 border">{instrument.bookingrefno}</td>
                                            <td className="p-3 border">{instrument.lrn}</td>
                                            <td className="p-3 border">{instrument.name}</td>
                                            <td className="p-3 border">{instrument.idno}</td>
                                            <td className="p-3 border">{instrument.serialno}</td>
                                            <td className="p-3 border">{instrument.make}</td>
                                            <td className="p-3 border">{instrument.model}</td>
                                            <td className="p-3 border">
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
                            !isLoading && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No instruments found. Please search to see results.</p>
                                </div>
                            )
                        )}
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                            <span className="ml-3 text-gray-600">
                                Searching instruments...
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
};

export default CloneItem;
