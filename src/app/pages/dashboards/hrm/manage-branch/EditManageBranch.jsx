
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditManageBranch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState({ name: "", location: "" });

  // Error and touched states
  const [errors, setErrors] = useState({
    name: "",
    location: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    location: false,
  });

  useEffect(() => {
    const fetchModes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/hrm/get-branch-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          setMode({
            name: result.data.name || "",
            location: result.data.location || "",
          });
        } else {
          toast.error(result.message || "Failed to load unit type.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchModes();
  }, [id]);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMode((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle field blur to show validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let error = "";
    
    if (!value.trim()) {
      error = "This field is required";
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error === "";
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate name
    if (!mode.name.trim()) {
      newErrors.name = "This field is required";
      isValid = false;
    }

    // Validate location
    if (!mode.location.trim()) {
      newErrors.location = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      location: true,
    });

    return isValid;
  };

  // Update mode
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const form = new FormData();
      form.append("name", mode.name);
      form.append("location", mode.location);

      const response = await axios.post(`/hrm/update-branch/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Unit type updated successfully ✅", {
          duration: 1000,
          icon: "✅",
        });

        navigate("/dashboards/hrm/manage-branch");
      } else {
        toast.error(result.message || "Failed to update unit type ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Manage Branch">
      <div className="p-6">
        {/* Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Manage Branch
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/hrm/manage-branch")}
          >
           Back to List
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Name"
              name="name"
              placeholder="Enter name"
              value={mode.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? "border-red-500" : ""}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Location"
              name="location"
              placeholder="Enter location"
              value={mode.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.location && touched.location ? "border-red-500" : ""}
            />
            {errors.location && touched.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
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