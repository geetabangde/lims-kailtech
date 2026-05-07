import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";
import { 
  Card, 
  Button,
  ReactSelect as Select
} from "components/ui";
import { Page } from "components/shared/Page";
import { Loader2, ChevronsLeft } from "lucide-react";

export default function LinkCrf() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [crfData, setCrfData] = useState([]);
  const [selectedCrf, setSelectedCrf] = useState(null);

  // Fetch CRF Data
  useEffect(() => {
    const fetchCrfData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/sales/link-crf-data/${id}`);
        if (res.data.status) {
          setCrfData(res.data.data || []);
        } else {
          toast.error(res.data.message || "Failed to fetch CRF data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading CRF data");
      } finally {
        setLoading(false);
      }
    };

    fetchCrfData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCrf) {
      toast.error("Please select a CRF");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await axios.post("/sales/link-crf", {
        quotationid: id,
        trfid: selectedCrf
      });

      if (res.data.status) {
        toast.success(res.data.message || "Quotation linked to CRF successfully");
        navigate("/dashboards/sales/calibration-quotations", { state: { refetch: true } });
      } else {
        toast.error(res.data.message || "Failed to link CRF");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error linking CRF");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Page title="Link CRF To Quotation">
      <Card className="w-full overflow-hidden shadow-sm" skin="bordered">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-5 py-3 dark:border-dark-700 dark:bg-dark-900/20">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Link Crf To Quotation
          </h3>
          <Button
            color="info"
            variant="filled"
            size="sm"
            onClick={() => navigate("/dashboards/sales/calibration-quotations")}
            className="flex items-center gap-1.5 px-4 font-normal text-white"
          >
            <ChevronsLeft className="h-4 w-4" />
            Back to Quotation List
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="min-w-[120px] text-sm font-semibold text-gray-700 dark:text-dark-300">
                CRF
              </label>
              <div className="flex-1">
                <Select
                  name="crf"
                  options={crfData}
                  value={selectedCrf}
                  onChange={(val) => {
                    // val could be the value or the whole object depending on Select.jsx behavior
                    const value = val && typeof val === 'object' ? val.value : val;
                    console.log("Selected CRF Value (Extracted):", value);
                    setSelectedCrf(value);
                  }}
                  isDisabled={loading || crfData.length === 0}
                  placeholder="Select"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50/30 px-6 py-4 dark:bg-dark-900/20">
            <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
              <Button
                type="submit"
                color="success"
                variant="filled"
                className="px-6 py-2 shadow-sm transition-all active:scale-95"
                disabled={loading || submitLoading || crfData.length === 0}
              >
                {submitLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Link Quotation to CRF</span>
                )}
              </Button>
            </div>
            {crfData.length === 0 && !loading && (
              <div className="mt-3 text-right text-xs text-amber-600">
                No available CRF found for this customer.
              </div>
            )}
          </div>
        </form>
      </Card>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-dark-900/50">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      )}
    </Page>
  );
}
