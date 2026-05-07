import { useEffect, useState } from "react";
import { Button } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import { useParams, useSearchParams, useNavigate } from "react-router";

export default function EditBillingDetails() {
  const { id } = useParams(); // ✅ inward_id from route
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ query params
  const caliblocation = searchParams.get("caliblocation") || "";
  const calibacc = searchParams.get("calibacc") || "";

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/people/get-all-customers");
        if (res.data.status === "true" && res.data.data) {
          const activeCustomers = res.data.data.filter(
            (cust) => cust.status === 1 && cust.id != null
          );
          setCustomers(activeCustomers);
        } else {
          toast.error("Failed to load customers.");
        }
      } catch {
        toast.error("Error fetching customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      toast.error("Please select a customer.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        inward_id: id, 
        customerid: selectedCustomer,
      };

      const res = await axios.post(
        "/calibrationprocess/customer-responsibale-for-payment",
        payload
      );

      if (res.data.status === "true") {
        toast.success("Customer responsible for payment updated successfully!");
        setTimeout(() => {
          navigate(
            `/dashboards/calibration-process/inward-entry-lab?caliblocation=${encodeURIComponent(
              caliblocation
            )}&calibacc=${encodeURIComponent(calibacc)}`
          );
        }, 1000);
      } else {
        toast.error(res.data.message || "Failed to submit.");
      }
    } catch (err) {
      toast.error("Error submitting form.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Customer Responsible for Payment">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Customer Responsible for Payment
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              navigate(
                `/dashboards/calibration-process/inward-entry-lab?caliblocation=${encodeURIComponent(
                  caliblocation
                )}&calibacc=${encodeURIComponent(calibacc)}`
              )
            }
          >
            Back to Inward Entry List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <select
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.pnumber})
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" color="primary" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}
