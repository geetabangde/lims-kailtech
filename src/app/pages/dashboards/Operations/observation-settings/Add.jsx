import { useNavigate } from "react-router";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import { useState } from "react";
import axios from "utils/axios";
import { toast } from "sonner";

export default function AddUnitType() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "This is a required field";
    if (!formData.description.trim())
      newErrors.description = "This is a required field";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const authToken = localStorage.getItem("authToken"); // ✅ Use stored token

      const payload = {
        name: formData.name,
        description: formData.description,
      };

      const response = await axios.post(
        "/observationsetting/add-observation",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // ✅ Updated key check — API returns `status: true`
      if (response.data.status) {
        toast.success(response.data.message || "Observation added successfully ✅", { duration: 1500 });
        navigate("/dashboards/Operations/observation-settings");
      } else {
        toast.error(response.data.message || "Failed to add observation ❌");
      }
    } catch (err) {
      console.error("Error adding observation:", err);
      toast.error(err?.response?.data?.message || "API request failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Observation">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Observation</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/Operations/observation-settings")}
          >
            Back
          </Button>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Observation Name"
              placeholder="Enter observation name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Description"
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description}
              </p>
            )}
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
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}
