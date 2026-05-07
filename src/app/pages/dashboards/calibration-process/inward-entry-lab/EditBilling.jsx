import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditBillingDetails() {
  const { id: inward_id } = useParams(); // dynamic inward id from route
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = location.search; // query params preserve

  const [customers, setCustomers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/people/get-all-customers");
        if (res.data.status === "true" && res.data.data) {
          setCustomers(res.data.data);
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

  // Fetch addresses when customer changes
  useEffect(() => {
    if (!selectedCustomer) {
      setAddresses([]);
      setSelectedCustomerData(null);
      return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/people/get-customers-address/${selectedCustomer}`);
        if (res.data.status === "true" && res.data.data) {
          setAddresses(res.data.data);
        } else {
          toast.error("Failed to load customer addresses.");
        }
      } catch  {
        toast.error("Error fetching addresses.");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();

    const customerData = customers.find(c => String(c.id) === selectedCustomer);
    setSelectedCustomerData(customerData || null);
  }, [selectedCustomer, customers]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!selectedCustomer) newErrors.customer = "Please select a customer.";
    if (!selectedAddress) newErrors.address = "Please select an address.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        inward_id,
        billingname: selectedCustomer,
        billingaddress: selectedAddress,
        gstno: selectedCustomerData?.gstno || "",
      };

      const res = await axios.post("/calibrationprocess/edit-billing-details", payload);
      const result = res.data;

      if (result.status === "true") {
        toast.success("Billing details updated successfully ✅");
        setTimeout(() => {
          navigate(`/dashboards/calibration-process/inward-entry-lab${searchParams}`);
        }, 1000);
      } else {
        toast.error(result.message || "Failed to update billing details.");
      }
    } catch  {
      toast.error("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Billing Details">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Billing Details
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              navigate(`/dashboards/calibration-process/inward-entry-lab${searchParams}`)
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
              onChange={(e) => {
                setSelectedCustomer(e.target.value);
                setSelectedAddress("");
                setErrors({});
              }}
            >
              <option value="">Select Customer</option>
              {customers.filter(c => c.id != null).map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.pnumber})
                </option>
              ))}
            </select>
            {errors.customer && (
              <span className="text-red-500 text-sm">{errors.customer}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Address
            </label>
            <select
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
              value={selectedAddress}
              onChange={(e) => {
                setSelectedAddress(e.target.value);
                setErrors({});
              }}
            >
              <option value="">Select Address</option>
              {addresses.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} - {a.address}
                </option>
              ))}
            </select>
            {errors.address && (
              <span className="text-red-500 text-sm">{errors.address}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer GST Number
            </label>
            <Input
              value={selectedCustomerData?.gstno || "No GST Available"}
              readOnly
              style={{
                backgroundColor: selectedCustomer ? "#f0f0f0" : "#dcdcdc",
              }}
            />
          </div>

          <Button type="submit" color="primary" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
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
              "Update Billing Details"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}
