import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditCurrency() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [currency, setCurrency] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchEditCurrency = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/master/currency-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          setCurrency({
            name: result.data.name || "",
            description: result.data.description || "",
          });
        } else {
          toast.error(result.message || "Failed to load currency.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEditCurrency();
  }, [id]);

  // Handle input changes with error clearing
  const handleInputChange = (field, value) => {
    setCurrency({ ...currency, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Custom validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!currency.name.trim()) {
      newErrors.name = "This is required field";
    }
    
    if (!currency.description.trim()) {
      newErrors.description = "This is required field";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Update currency
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const form = new FormData();
      form.append("name", currency.name);
      form.append("description", currency.description);

      const response = await axios.post(`/master/currency-update/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Currency updated successfully ✅", {
          duration: 1000,
          icon: "✅",
        });

        navigate("/dashboards/master-data/currencies");
      } else {
        toast.error(result.message || "Failed to update currency ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Currency">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Currency
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/master-data/currencies")}
          >
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Currency Name"
              value={currency.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              // removed required attribute
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Currency Description / Symbol"
              value={currency.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              // removed required attribute
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
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
              "Update"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}