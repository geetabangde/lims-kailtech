// Import Dependencies
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "react-hot-toast";

// Local Imports
import { 
  Card, 
  Button, 
  Table, THead, TBody, Tr, Th, Td 
} from "components/ui";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function EditDumpApprove() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dumpId = searchParams.get("hakuna");
  const status = searchParams.get("matata");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dumpData, setDumpData] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchData = useCallback(async () => {
    if (!dumpId) return;
    try {
      setLoading(true);
      const response = await axios.get("inventory/get-dump-approve-data", {
        params: { hakuna: dumpId }
      });
      if (response.data.status) {
        setDumpData(response.data.dumpData);
        setInstrument(response.data.instrument);
        setHistory(response.data.history || []);
      } else {
        toast.error(response.data.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching dump approve data:", err);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [dumpId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        id: dumpId,
        mminstid: dumpData?.mminstid,
        mlid: dumpData?.materiallocation_id,
        typeofuse: dumpData?.typeofuse,
        dumpqty: dumpData?.dumpqty,
        status: status,
      };
      
      const response = await axios.post("inventory/update-dump-approve", payload);
      if (response.data.status) {
        toast.success(response.data.message || "Action successful");
        navigate("/dashboards/inventory/dump-instrument");
      } else {
        toast.error(response.data.message || "Action failed");
      }
    } catch {
      toast.error("An error occurred during submission");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Page title="Dump Approval"><div className="p-10 text-center">Loading...</div></Page>;
  }

  if (!instrument) {
    return <Page title="Dump Approval"><div className="p-10 text-center text-red-500">Instrument data not found</div></Page>;
  }

  return (
    <Page title="Dump Approval">
      <div className="transition-content w-full pb-5 space-y-6">
        <Card className="p-4 sm:p-5 border-none shadow-soft dark:bg-dark-700">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-dark-500">
            <h3 className="text-lg font-bold text-gray-800 dark:text-dark-100 uppercase">
              Instrument History
            </h3>
            <Button
              component={Link}
              to="/dashboards/inventory/dump-instrument"
              color="warning"
              variant="outline"
              size="sm"
            >
              {"<< Back To List"}
            </Button>
          </div>

          <div className="mt-6 space-y-8 overflow-x-auto">
            {/* Document Header Table */}
            <table className="w-full border-collapse border border-gray-300 dark:border-dark-500 text-xs">
              <tbody>
                <tr>
                  <td rowSpan="6" className="border border-gray-300 p-4 text-center w-1/5 bg-gray-50 dark:bg-dark-800 dark:border-dark-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400 uppercase">LOGO</div>
                      <div className="font-bold text-[10px] leading-tight">KAILTECH TEST & RESEARCH CENTRE</div>
                    </div>
                  </td>
                  <th rowSpan="6" className="border border-gray-300 p-4 text-center text-xl font-black uppercase dark:border-dark-500">
                    Instrument History
                  </th>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500 w-[15%]">QF. No.</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500">LIMS/QF/0604/01</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Issue No.</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500">01</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Issue Date</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500">01/01/2020</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Revision No.</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500">00</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Revision Date</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500">--</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500 font-bold">Page</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500 font-bold italic text-blue-600">1 of 1</td>
                </tr>
              </tbody>
            </table>

            {/* Department Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200 dark:border-dark-500 font-bold text-sm uppercase">
              <div>DEPARTMENT: <span className="text-primary-500">{instrument.department_name}</span></div>
              <div className="text-right">EQPT ID: <span className="text-primary-500">{instrument.idno}</span></div>
            </div>

            {/* Instrument Details Table */}
            <table className="w-full border-collapse border border-gray-300 dark:border-dark-500 text-sm">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-dark-500">
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 w-1/4 border-r border-gray-200 dark:border-dark-500">Name of instrument :</th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500">{instrument.name}</td>
                  <th rowSpan="3" className="p-3 text-left bg-gray-50 dark:bg-dark-800 w-1/4 border-r border-gray-200 dark:border-dark-500">Range :</th>
                  <td rowSpan="3" className="p-3">{instrument.instrange}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-500">
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">Make :</th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500">{instrument.make}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-500">
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">Model :</th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500">{instrument.model}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-500">
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">S.No. :</th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500">{instrument.serialno}</td>
                  <th rowSpan="3" className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">L.C. :</th>
                  <td rowSpan="3" className="p-3">{instrument.leastcount}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-500">
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">Date of installation :</th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500">{instrument.purchasedate_formatted}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-500">
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">Location of Equipment :</th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500">{instrument.location_name}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-500">
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">
                    Name & Address of service provider :
                    <br/><span className="text-[10px] text-gray-500 italic mt-2 block font-normal">Name of service engineer :</span>
                  </th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500">{instrument.manufacturer}</td>
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">Accuracy :</th>
                  <td className="p-3"></td>
                </tr>
                <tr>
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">SOP / WI Reference :</th>
                  <td className="p-3 border-r border-gray-200 dark:border-dark-500"></td>
                  <th className="p-3 text-left bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-500">Equipment Conforms Specified Requirement</th>
                  <td className="p-3 font-bold text-green-600 italic">Yes</td>
                </tr>
              </tbody>
            </table>

            {/* Service Codes */}
            <div className="w-1/2">
              <Table compact border>
                <THead>
                  <Tr>
                    <Th className="bg-gray-100 dark:bg-dark-800 w-16 text-center">CODE</Th>
                    <Th className="bg-gray-100 dark:bg-dark-800">TYPE OF SERVICE</Th>
                  </Tr>
                </THead>
                <TBody>
                  <Tr><Td className="text-center">1</Td><Td>Maintenance</Td></Tr>
                  <Tr><Td className="text-center">2</Td><Td>Calibration</Td></Tr>
                  <Tr><Td className="text-center">3</Td><Td>Repair/Modification</Td></Tr>
                  <Tr><Td className="text-center">4</Td><Td>Out of order</Td></Tr>
                </TBody>
              </Table>
            </div>

            {/* Validity History Table */}
            <Table border>
              <THead>
                <Tr className="text-[10px] uppercase leading-tight bg-gray-50 dark:bg-dark-800">
                  <Th className="w-10">CODE</Th>
                  <Th className="w-24">IMPLEMENT DATE</Th>
                  <Th className="w-24">NEXT DUE DATE</Th>
                  <Th>RESULT OF CALIBRATION &#123;Cert No.&#125;</Th>
                  <Th>ADJUSTMENTS (YES/NO)</Th>
                  <Th>MEETS ACCEPTANCE CRITERIA</Th>
                  <Th>SIGNED BY</Th>
                  <Th>REMARKS</Th>
                </Tr>
              </THead>
              <TBody>
                {history.length > 0 ? history.map((item, index) => (
                  <Tr key={index} className="text-xs">
                    <Td className="text-center">2</Td>
                    <Td>{item.startdate_formatted}</Td>
                    <Td>{item.enddate_formatted}</Td>
                    <Td className="font-mono text-[10px]">{item.certificateno}</Td>
                    <Td>
                      {item.adjusment}
                      {item.adjustmentremark && <div className="text-[10px] text-gray-500 mt-1 italic">{item.adjustmentremark}</div>}
                    </Td>
                    <Td className="text-center font-bold text-blue-600">{item.meetacceptance}</Td>
                    <Td>{item.added_by_name}</Td>
                    <Td className="italic">{item.remark}</Td>
                  </Tr>
                )) : (
                  <Tr>
                    <Td colSpan="8" className="text-center py-8 text-gray-400 italic">No history records found</Td>
                  </Tr>
                )}
              </TBody>
            </Table>

            {/* Approval Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-10 border-t border-gray-100 dark:border-dark-500 gap-6">
              <div className="flex-1 text-sm italic text-gray-500 dark:text-dark-300">
                Generated automatically on {new Date().toLocaleDateString()}
              </div>
              <div className="w-64 p-4 border border-dashed border-gray-300 dark:border-dark-500 rounded-lg text-sm bg-gray-50 dark:bg-dark-800/50">
                <div className="font-bold border-b pb-1 mb-2 uppercase text-xs">Approved by DTM</div>
                <div className="space-y-2">
                  <div>Name: <span className="text-gray-400">________________</span></div>
                  <div>Sign: <span className="text-gray-400 font-mono tracking-tighter">~~~~~~~~~~~~~~~~</span></div>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <div className="pt-10 flex justify-center">
              <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <Button
                  type="submit"
                  color={status === "1" ? "success" : "error"}
                  variant="solid"
                  size="lg"
                  loading={submitting}
                  className="w-full font-black uppercase tracking-widest py-6"
                >
                  {status === "1" ? "Confirm Approval" : "Confirm Rejection"}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}
