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

export default function LinkTrf() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [trfData, setTrfData] = useState([]);
  const [selectedTrf, setSelectedTrf] = useState(null);

  // Fetch TRF Data
  useEffect(() => {
    const fetchTrfData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/sales/get-link-trf/${id}`);
        if (res.data.status) {
          const mappedData = (res.data.data || []).map(item => ({
            value: item.value || item.id, // Fallback to id if value is missing
            label: item.label || `${item.id} ${item.date || ''}` // Fallback for label
          }));
          setTrfData(mappedData);
        } else {
          toast.error(res.data.message || "Failed to fetch TRF data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading TRF data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrfData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if selectedTrf is null, undefined or empty string
    if (selectedTrf === null || selectedTrf === undefined || selectedTrf === "") {
      toast.error("Please select a TRF");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await axios.post("/sales/link-trf", {
        quotationid: id,
        trfid: selectedTrf
      });

      if (res.data.status) {
        toast.success(res.data.message || "Quotation linked to TRF successfully");
        navigate("/dashboards/sales/testing-quotations", { state: { refetch: true } });
      } else {
        toast.error(res.data.message || "Failed to link TRF");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error linking TRF");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Page title="Link TRF To Quotation">
      <Card className="w-full overflow-hidden shadow-sm" skin="bordered">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-5 py-3 dark:border-dark-700 dark:bg-dark-900/20">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Link Trf To Quotation
          </h3>
          <Button
            color="info"
            variant="filled"
            size="sm"
            onClick={() => navigate("/dashboards/sales/testing-quotations")}
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
                Inward Entry
              </label>
              <div className="flex-1">
                <Select
                  name="trfid"
                  options={trfData}
                  value={selectedTrf}
                  onChange={(val) => {
                    console.log("Selected TRF Value:", val);
                    setSelectedTrf(val);
                  }}
                  isDisabled={loading || trfData.length === 0}
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
                disabled={loading || submitLoading || trfData.length === 0}
              >
                {submitLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Link Quotation to TRF</span>
                )}
              </Button>
            </div>
            {trfData.length === 0 && !loading && (
              <div className="mt-3 text-right text-xs text-amber-600">
                No available TRF found for this customer.
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
