import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditTaxSlab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    percentage: "",
  });

  useEffect(() => {
    const fetchTaxSlab = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`master/get-taxslab-byid/${id}`);
        const result = response.data;
        console.log(result);

        if (result.status === "true" && Array.isArray(result.data) && result.data.length > 0) {
          const taxSlab = result.data[0];
          setFormData({
            name: taxSlab.name || "",
            description: taxSlab.description || "",
            percentage: taxSlab.percentage || "",
          });
        } else {
          toast.error(result.message || "Failed to load tax slab.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaxSlab();
  }, [id]);

  // Handle input changes with error clearing
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
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
    
    if (!formData.name.trim()) {
      newErrors.name = "This is required field";
    }
    
    if (!formData.percentage.toString().trim()) {
      newErrors.percentage = "This is required field";
    } else if (isNaN(formData.percentage) || formData.percentage < 0) {
      newErrors.percentage = "Please enter a valid percentage";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "This is required field";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("percentage", formData.percentage);

      const response = await axios.post(`master/update-taxslab/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Tax slab updated successfully ✅", {
          duration: 1000,
          icon: "✅",
        });

        navigate("/dashboards/master-data/tax-slabs");
      } else {
        toast.error(result.message || "Failed to update tax slab ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Tax Slab">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Tax Slab
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/master-data/tax-slabs")}
          >
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Tax Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              // removed required attribute
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Percentage"
              type="number"
              value={formData.percentage}
              onChange={(e) => handleInputChange('percentage', e.target.value)}
              // removed required attribute
            />
            {errors.percentage && (
              <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>
            )}
          </div>

          <div>
            <Input
              label="Description"
              value={formData.description}
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