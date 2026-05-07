import { useNavigate } from "react-router";
import { Button, Input, Select } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios"; // Interceptor should attach token
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function AddGateEntry() {
  const navigate = useNavigate();

  // ✅ State for form, loading, and errors
  const [formData, setFormData] = useState({
    purpose: "",
    description: "",
    quantity: "",
    source: "",
  });
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPurposes, setFetchingPurposes] = useState(true);
  const [errors, setErrors] = useState({});

  // ✅ Fetch purposes
  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        setFetchingPurposes(true);
        const response = await axios.get("/gateentry/get-gate-purpose-list");
        if (response.data.status && Array.isArray(response.data.data)) {
          setPurposes(
            response.data.data.map((p) => ({ value: p.id, label: p.name }))
          );
        }
      } catch (err) {
        console.error("Error fetching gate purposes:", err);
      } finally {
        setFetchingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  // ✅ Input handler with error clearing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Custom validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.purpose) {
      newErrors.purpose = "This is required field";
    }
    
    if (!formData.description) {
      newErrors.description = "This is required field";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const form = new FormData();
      form.append("purpose", formData.purpose);
      form.append("description", formData.description);
      form.append("quantity", formData.quantity);
      form.append("source", formData.source);

      await axios.post("/gateentry/gate-entry-create", form); // token attached via interceptor

      toast.success("Gate entry created successfully ✅", {
        duration: 1000,
        icon: "✅",
      });

      navigate("/dashboards/gate-entry");
    } catch (err) {
      console.error("Error creating gate entry:", err);
      toast.error(err?.response?.data?.message || "Failed to create gate entry ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Gate Entry">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Add Gate Entry
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/gate-entry")}
          >
            Back to Gate Entries
          </Button>
        </div>

        {/* ✅ Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <Select
              label="Purpose"
              name="purpose"
              placeholder={fetchingPurposes ? "Loading..." : "Select Purpose"}
              options={purposes}
              value={formData.purpose}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, purpose: val }))
              }
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Describe Items</label>
              <textarea
                name="description"
                placeholder="Describe Items"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-hidden dark:border-dark-500 dark:bg-dark-900"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          <div>
            <Input
              label="Source"
              name="source"
              placeholder="Source"
              value={formData.source}
              onChange={handleChange}
            />
          </div>

          <div>
            <Input
              label="Quantity"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 space-y-4">
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
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
}