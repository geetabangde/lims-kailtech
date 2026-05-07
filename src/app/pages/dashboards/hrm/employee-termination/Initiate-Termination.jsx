// Import Dependencies
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Card, Button, Input, ReactSelect as Select } from "components/ui";
import axios from "utils/axios";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function InitiateTermination() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);

  // Options State
  const [options, setOptions] = useState({
    employees: [],
    customers: [],
    raisedByList: [],
  });

  const [formData, setFormData] = useState({
    empid: "",
    raisedby: "",
    raisedbyid: "",
    reason: "",
    detail: "",
    type: "Termination",
  });

  // Fetch initial options
  const fetchOptions = useCallback(async () => {
    try {
      setFetchingOptions(true);
      const [empRes, custRes] = await Promise.all([
        axios.get("/hrm/active-employee-list"),
        axios.get("/sales/active-customers-list"), // Assuming this exists for customers
      ]);

      setOptions({
        employees: empRes.data.status ? empRes.data.data.map(e => ({ value: e.id, label: `${e.firstname} ${e.lastname} (${e.empid})` })) : [],
        customers: custRes.data.status ? custRes.data.data.map(c => ({ value: c.id, label: c.customer_name })) : [],
        raisedByList: [],
      });
    } catch (err) {
      console.error("Error fetching options:", err);
      toast.error("Failed to load options");
    } finally {
      setFetchingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Handle dynamic dropdown for Raised By ID
  useEffect(() => {
    if (formData.raisedby === "Employee") {
      setOptions(prev => ({ ...prev, raisedByList: prev.employees }));
    } else if (formData.raisedby === "Customer") {
      setOptions(prev => ({ ...prev, raisedByList: prev.customers }));
    } else {
      setOptions(prev => ({ ...prev, raisedByList: [] }));
    }
  }, [formData.raisedby, options.employees, options.customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Reset raisedbyid if raisedby changes
    if (name === "raisedby") {
      setFormData(prev => ({ ...prev, raisedbyid: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/hrm/insert-termination-complaint", formData);
      if (response.data.status) {
        toast.success("Termination process initiated successfully ✅");
        navigate("/dashboards/hrm/employee-termination");
      } else {
        toast.error(response.data.message || "Failed to initiate process ❌");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred ❌");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingOptions) {
    return <div className="p-10 text-center text-gray-500">Loading options...</div>;
  }

  return (
    <Page title="Initiate Termination">
      <div className="mx-auto w-full max-w-3xl pb-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-dark-800"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-50">
              Initiate Termination
            </h1>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Target Employee */}
              <Select
                label="Target Employee"
                name="empid"
                options={options.employees}
                value={formData.empid}
                onChange={(val) => handleSelectChange("empid", val)}
                placeholder="Select employee to terminate"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Raised By Category */}
                <Select
                  label="Complaint Raised By (Type)"
                  name="raisedby"
                  options={[
                    { value: "Employee", label: "Employee" },
                    { value: "Customer", label: "Customer" },
                  ]}
                  value={formData.raisedby}
                  onChange={(val) => handleSelectChange("raisedby", val)}
                  placeholder="Select type"
                  required
                />

                {/* Specific Person */}
                <Select
                  label="Raised By (Person/Entity)"
                  name="raisedbyid"
                  options={options.raisedByList}
                  value={formData.raisedbyid}
                  onChange={(val) => handleSelectChange("raisedbyid", val)}
                  placeholder="Select source"
                  isDisabled={!formData.raisedby}
                  required
                />
              </div>

              {/* Reason */}
              <Input
                label="Reason for Termination"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="E.g. Disciplinary issues, Performance"
                required
              />

              {/* Detail */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-dark-200">
                  Full Description / Evidence Details
                </label>
                <textarea
                  name="detail"
                  rows={4}
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="Provide detailed context for the complaint..."
                  className="w-full rounded-md border-gray-300 shadow-xs focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? "Saving..." : "Save Complaint"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Page>
  );
}
