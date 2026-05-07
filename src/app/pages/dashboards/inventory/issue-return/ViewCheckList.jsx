// Import Dependencies
import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "react-hot-toast";

// Local Imports
import { 
  Card, 
  Button
} from "components/ui";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function ViewCheckList() {
  const [searchParams] = useSearchParams();
  const gatepassNo = searchParams.get("hakuna");

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [masterChecklist, setMasterChecklist] = useState([]);
  const [generalChecklist, setGeneralChecklist] = useState([]);

  const fetchData = useCallback(async () => {
    if (!gatepassNo) return;
    try {
      setLoading(true);
      const response = await axios.get("inventory/get-checklist-data", {
        params: { hakuna: gatepassNo }
      });
      if (response.data.status) {
        setRecord(response.data.record);
        setMasterChecklist(response.data.masterChecklist || []);
        setGeneralChecklist(response.data.generalChecklist || []);
      } else {
        toast.error(response.data.message || "Failed to fetch checklist data");
      }
    } catch (err) {
      console.error("Error fetching checklist data:", err);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [gatepassNo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Page title="Check List"><div className="p-10 text-center text-gray-500">Loading checklist data...</div></Page>;
  }

  if (!record) {
    return <Page title="Check List"><div className="p-10 text-center text-red-500">Checklist record not found</div></Page>;
  }

  return (
    <Page title={`Checklist ${gatepassNo}`}>
      <div className="transition-content w-full pb-5 space-y-6">
        <Card className="p-4 sm:p-5 border-none shadow-soft dark:bg-dark-700">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-dark-500 mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-dark-100">
              Checklist {gatepassNo}
            </h3>
            <Button
              component={Link}
              to="/dashboards/inventory/issue-return"
              color="info"
              variant="outline"
              size="sm"
            >
              {"<< Issued Item List"}
            </Button>
          </div>

          <div className="space-y-8 overflow-x-auto">
            {/* Header Document Table */}
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
                    Check List For Site Testing / Calibration
                  </th>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500 w-[15%]">QF. No.</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500 italic">KTRC/QF/0704/07</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Issue No.</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500">01</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Issue Date</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500">01/06/2019</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Revision No.</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500 text-red-600 font-bold">01</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Revision Date</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500 text-red-600 font-bold">20/08/2021</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-50 dark:bg-dark-800 dark:border-dark-500">Page</th>
                  <td className="border border-gray-300 p-2 dark:border-dark-500 font-bold italic">1 of 1</td>
                </tr>
              </tbody>
            </table>

            {/* Site Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-dark-800/50 rounded-lg text-sm border border-gray-200 dark:border-dark-600 uppercase font-bold">
              <div>Date: <span className="text-primary-500">{record.gatepassdate_formatted}</span></div>
              <div className="md:col-span-2">Site Name: <span className="text-primary-500">{record.customer_name}</span></div>
              <div className="md:col-span-3">Site Address: <span className="text-primary-500">{record.customer_address_text}</span></div>
            </div>

            {/* Master Equipment Checklist Section */}
            {masterChecklist.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-black uppercase text-gray-700 dark:text-dark-200 border-l-4 border-primary-500 pl-3">
                  Master Equipment Checklist
                </h4>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-500">
                  <table className="w-full border-collapse text-[10px] text-left leading-tight">
                    <thead className="bg-gray-100 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-500">
                      <tr>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center w-8">Sr</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 w-32">Master Equipment</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 w-24">Discipline</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 w-32">Artifact Verification</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 w-20 text-center">General Check</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center w-12">Unit</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center">Check Point</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center bg-blue-50/50 dark:bg-blue-900/10">Before Moving</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center bg-green-50/50 dark:bg-green-900/10">After Moving</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center">Deviation</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center">Acceptance</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500 text-center font-bold">Result</th>
                        <th className="p-2 border-r border-gray-200 dark:border-dark-500">Remarks</th>
                        <th className="p-2">Return Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterChecklist.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-dark-600 last:border-0 hover:bg-gray-50/50 dark:hover:bg-dark-800/30">
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center font-bold text-gray-400">{index + 1}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 font-bold">{item.name} <div className="text-[9px] text-primary-500 font-mono">({item.idno})</div></td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600">{item.discipline_name}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 italic text-gray-600 dark:text-dark-300">{item.equip_for_verif_name}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center">{item.generalcheck}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center">{item.unit_name}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center">{item.checkpoint}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center bg-blue-50/30 dark:bg-blue-900/5 font-bold">{item.checkpointbeforemoving}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center bg-green-50/30 dark:bg-green-900/5 font-bold">{item.checkpointaftermoving}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center">{item.error}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center italic">{item.acceptancelimit}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 text-center font-black text-blue-600">{item.result}</td>
                          <td className="p-2 border-r border-gray-100 dark:border-dark-600 italic">{item.remark}</td>
                          <td className="p-2">
                            {item.issuestatus === "1" ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-green-600 uppercase text-[9px]">{item.returnby_name}</span>
                                <span className="text-[8px] text-gray-500">{item.returnon_formatted}</span>
                                <div className="text-[9px] italic mt-1 bg-yellow-50 dark:bg-yellow-900/20 p-1 rounded border border-yellow-100 dark:border-yellow-900/40">{item.returnremark}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Pending Return</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* General Accessories Checklist Section */}
            {generalChecklist.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-black uppercase text-gray-700 dark:text-dark-200 border-l-4 border-indigo-500 pl-3">
                  General Accessories Checklist
                </h4>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-500">
                  <table className="w-full border-collapse text-[10px] text-left leading-tight">
                    <thead className="bg-gray-100 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-500">
                      <tr>
                        <th className="p-3 border-r border-gray-200 dark:border-dark-500 text-center w-10">Sr</th>
                        <th className="p-3 border-r border-gray-200 dark:border-dark-500">Master Equipment</th>
                        <th className="p-3 border-r border-gray-200 dark:border-dark-500">Accessories Name</th>
                        <th className="p-3 border-r border-gray-200 dark:border-dark-500 text-center w-16">Qty</th>
                        <th className="p-3 border-r border-gray-200 dark:border-dark-500 w-32">Issue Condition</th>
                        <th className="p-3 border-r border-gray-200 dark:border-dark-500">Issue Remarks</th>
                        <th className="p-3 border-r border-gray-200 dark:border-dark-500 w-32 bg-indigo-50/50 dark:bg-indigo-900/10 font-bold">Return Condition</th>
                        <th className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 font-bold">Return Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generalChecklist.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-dark-600 last:border-0 hover:bg-gray-50/50 dark:hover:bg-dark-800/30">
                          <td className="p-3 border-r border-gray-100 dark:border-dark-600 text-center font-bold text-gray-400">{index + 1}</td>
                          <td className="p-3 border-r border-gray-100 dark:border-dark-600 font-bold">{item.name} <div className="text-[9px] text-primary-500 font-mono">({item.idno})</div></td>
                          <td className="p-3 border-r border-gray-100 dark:border-dark-600 font-medium text-gray-700 dark:text-dark-200 uppercase">{item.accessoriesname}</td>
                          <td className="p-3 border-r border-gray-100 dark:border-dark-600 text-center font-bold">{item.quantity}</td>
                          <td className="p-3 border-r border-gray-100 dark:border-dark-600 italic">{item.condition}</td>
                          <td className="p-3 border-r border-gray-100 dark:border-dark-600 text-gray-500">{item.remark}</td>
                          <td className="p-3 border-r border-gray-100 dark:border-dark-600 bg-indigo-50/20 dark:bg-indigo-900/5 font-black text-indigo-700 dark:text-indigo-400 uppercase italic">{item.returncondition}</td>
                          <td className="p-3 bg-indigo-50/20 dark:bg-indigo-900/5 italic text-indigo-700 dark:text-indigo-400">{item.returnremark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Signature Section */}
            <div className="flex justify-end pt-12">
              <div className="w-64 p-6 border border-dashed border-gray-300 dark:border-dark-500 rounded-2xl bg-gray-50/50 dark:bg-dark-800/50 text-center">
                <div className="h-16 flex items-center justify-center italic text-gray-300 font-serif text-3xl select-none opacity-50">
                  Signature
                </div>
                <div className="border-t border-gray-200 dark:border-dark-600 mt-4 pt-2">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-dark-100">Checked By</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}
