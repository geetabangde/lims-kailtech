// Import Dependencies
import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "react-hot-toast";
import { Printer, ChevronLeft, ClipboardList } from "lucide-react";

// Local Imports
import { 
  Card, 
  Button, 
  Table, THead, TBody, Tr, Th, Td 
} from "components/ui";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function PrintGatePass() {
  const [searchParams] = useSearchParams();
  const gatepassNo = searchParams.get("hakuna");

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [items, setItems] = useState([]);

  const fetchData = useCallback(async () => {
    if (!gatepassNo) return;
    try {
      setLoading(true);
      const response = await axios.get("inventory/get-gatepass-data", {
        params: { hakuna: gatepassNo }
      });
      if (response.data.status) {
        setRecord(response.data.record);
        setItems(response.data.items || []);
      } else {
        toast.error(response.data.message || "Failed to fetch gatepass data");
      }
    } catch (err) {
      console.error("Error fetching gatepass data:", err);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [gatepassNo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Page title="Gate Pass"><div className="p-10 text-center text-gray-500">Loading gate pass data...</div></Page>;
  }

  if (!record) {
    return <Page title="Gate Pass"><div className="p-10 text-center text-red-500">Gate Pass record not found</div></Page>;
  }

  const totalQty = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0);

  return (
    <Page title={`Gate Pass ${gatepassNo}`}>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            .print-area {
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              background: white !important;
            }
            body {
              background: white !important;
            }
          }
        `}
      </style>

      <div className="transition-content w-full pb-5 space-y-6">
        {/* Actions Card (Hidden on Print) */}
        <Card className="p-4 no-print border-none shadow-soft dark:bg-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                component={Link}
                to="/dashboards/inventory/issue-return"
                color="secondary"
                variant="soft"
                size="sm"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back to List
              </Button>
              <Button
                component={Link}
                to={`/dashboards/inventory/issue-return/view-checklist?hakuna=${gatepassNo}`}
                color="info"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4" /> View Checklist
              </Button>
            </div>
            <Button
              onClick={handlePrint}
              color="success"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print Gate Pass
            </Button>
          </div>
        </Card>

        {/* Gate Pass Document */}
        <Card className="print-area p-8 md:p-12 border-none shadow-soft dark:bg-dark-700 min-h-[1100px] flex flex-col">
          {/* Company Header */}
          <div className="flex justify-between items-start border-b-2 border-primary-500 pb-6 mb-8">
            <div className="w-1/3">
              <div className="h-24 w-48 bg-gray-100 rounded flex items-center justify-center font-black text-gray-300 uppercase tracking-tighter">
                LOGO
              </div>
            </div>
            <div className="w-1/3 text-center">
              <h1 className="text-3xl font-black text-primary-600 uppercase leading-none">Kailtech</h1>
              <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">Test & Research Centre</p>
            </div>
            <div className="w-1/3 text-right text-[10px] font-bold text-gray-600 dark:text-dark-300 space-y-0.5 uppercase">
              <p>NABL Accredited</p>
              <p>BIS Recognized</p>
              <p>ISO 9001:2015 Certified Lab</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-[10px] text-gray-500 max-w-lg mx-auto leading-relaxed italic">
              Plot No. 12, Sector-3, Industrial Area, Pithampur, Dist. Dhar (M.P.) 454775<br/>
              Phone: +91-7292-401122, Email: lab@kailtech.com, Web: www.kailtech.com
            </p>
          </div>

          <div className="flex justify-between items-end mb-10">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-800 dark:text-dark-100 uppercase underline decoration-primary-500 underline-offset-8">
                Returnable Challan
              </h2>
            </div>
            <div className="text-right text-sm space-y-1 font-bold">
              <div className="flex justify-end gap-2">
                <span className="text-gray-400">NO:</span>
                <span className="text-primary-600 font-mono tracking-tighter">{gatepassNo}</span>
              </div>
              <div className="flex justify-end gap-2">
                <span className="text-gray-400">DATE:</span>
                <span>{record.gatepassdate_formatted}</span>
              </div>
              <div className="flex justify-end gap-2">
                <span className="text-gray-400">BASIS:</span>
                <span className="uppercase text-indigo-600">{record.basis}</span>
              </div>
            </div>
          </div>

          {/* Customer & Recipient Section */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="p-4 border-l-4 border-primary-500 bg-gray-50 dark:bg-dark-800/50 rounded-r-xl">
              <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Customer Details</p>
              <h3 className="font-black text-gray-800 dark:text-dark-100 uppercase">{record.customer_name}</h3>
              <p className="text-xs text-gray-600 dark:text-dark-300 mt-1 italic">{record.customer_address_text}</p>
            </div>
            <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-r-xl">
              <p className="text-[10px] text-indigo-400 uppercase font-black mb-1">Attention / Issue To</p>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase">
                Kind Attn: <span className="font-black">{record.customer_contact_name || "---"}</span>
              </p>
              <div className="mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-800">
                <p className="text-[10px] text-indigo-400 uppercase font-bold">Material Issued To:</p>
                <p className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase">
                  {record.issuedtoname} <span className="text-[10px] font-mono">({record.issuedtcode})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="grow">
            <Table border compact>
              <THead>
                <Tr className="bg-gray-100 dark:bg-dark-800 uppercase text-[10px] font-black tracking-widest">
                  <Th className="w-12 text-center">Sr</Th>
                  <Th className="w-32">ID Number</Th>
                  <Th className="w-40">Serial Number</Th>
                  <Th>Name Of The Item And Spares</Th>
                  <Th className="w-24 text-center">Quantity</Th>
                </Tr>
              </THead>
              <TBody>
                {items.map((item, index) => (
                  <Tr key={index} className="text-xs font-medium border-b border-gray-100 dark:border-dark-600">
                    <Td className="text-center text-gray-400 font-bold">{index + 1}</Td>
                    <Td className="font-mono text-primary-500 font-bold">{item.idno}</Td>
                    <Td className="font-mono">{item.serialno}</Td>
                    <Td className="uppercase font-bold text-gray-700 dark:text-dark-200">{item.name}</Td>
                    <Td className="text-center font-black">{item.qty}</Td>
                  </Tr>
                ))}
                {/* Filler Rows to push footer down if needed */}
                {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
                   <Tr key={`filler-${i}`} className="h-10 opacity-0"><Td colSpan="5"></Td></Tr>
                ))}
              </TBody>
              <tfoot>
                <Tr className="bg-gray-50 dark:bg-dark-800/50 font-black text-sm border-t-2 border-gray-200 dark:border-dark-500">
                  <Td colSpan="4" className="text-right uppercase p-4 tracking-widest">Total Quantity</Td>
                  <Td className="text-center p-4 text-primary-600 underline decoration-double">{totalQty}</Td>
                </Tr>
              </tfoot>
            </Table>

            <div className="mt-8 p-4 bg-yellow-50/30 dark:bg-yellow-900/5 rounded-xl border border-yellow-100/50 dark:border-yellow-900/20 italic text-xs text-gray-600 dark:text-dark-300">
              <span className="font-black uppercase text-[10px] mr-2 text-yellow-600 not-italic tracking-tighter">Remark:</span>
              {record.remark || "N/A"}
            </div>
          </div>

          {/* Document Footer */}
          <div className="mt-12 pt-8 border-t-2 border-gray-100 dark:border-dark-600 flex justify-between items-end">
            <div className="space-y-1 text-[10px] font-bold text-gray-400 dark:text-dark-400 uppercase">
              <p>Approximate Return: <span className="text-indigo-500">{record.expectedreturn_formatted}</span></p>
              <p>This is a computer generated document.</p>
            </div>
            
            <div className="text-right min-w-[250px]">
              <div className="p-4 border border-dashed border-gray-300 dark:border-dark-500 rounded-2xl bg-gray-50/50 dark:bg-dark-800/50">
                <p className="text-[10px] font-black uppercase text-gray-800 dark:text-dark-100 mb-6">Gate Pass Generated by</p>
                <div className="space-y-1 text-xs">
                  <p className="font-bold uppercase italic text-primary-500 leading-tight">{record.issuedbycode}</p>
                  <p className="text-[9px] text-gray-400">Date: {record.added_on_formatted}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}
