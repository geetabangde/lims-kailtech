import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditManagePolicy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({ 
    name: "", 
    policy_number: "",
    description: ""
  });

  // Error and touched states
  const [errors, setErrors] = useState({
    name: "",
    policy_number: "",
    description: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    policy_number: false,
    description: false,
  });

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setFetching(true);
        const response = await axios.get(`/hrm/get-policy-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          setFormData({
            name: result.data.name || "",
            policy_number: result.data.policy_number || "",
            description: result.data.description || "",
          });
        } else {
          toast.error(result.message || "Failed to load policy data.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong while loading policy data.");
      } finally {
        setFetching(false);
      }
    };

    fetchPolicy();
  }, [id]);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

    if (!formData.name.trim()) {
      newErrors.name = "This field is required";
      isValid = false;
    }

    if (!formData.policy_number.trim()) {
      newErrors.policy_number = "This field is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      policy_number: true,
      description: true,
    });

    return isValid;
  };

  // Update policy
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("policy_number", formData.policy_number);
      form.append("description", formData.description);

      const response = await axios.post(`/hrm/update-policy/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Policy updated successfully ✅", {
          duration: 2000,
          icon: "✅",
        });

        navigate("/dashboards/hrm/manage-policies");
      } else {
        toast.error(result.message || "Failed to update policy ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating policy.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Page title="Edit Policy">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Edit Policy">
      <div className="p-6">
        {/* Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Policy
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/hrm/manage-policies")}
          >
           Back to List
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <Input
              label="Policy Name"
              name="name"
              placeholder="Enter policy name"
              value={formData.name}
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
              label="Policy Number"
              name="policy_number"
              placeholder="Enter policy number"
              value={formData.policy_number}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.policy_number && touched.policy_number ? "border-red-500" : ""}
            />
            {errors.policy_number && touched.policy_number && (
              <p className="text-red-500 text-sm mt-1">{errors.policy_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter policy description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.description && touched.description ? "border-red-500" : "border-gray-300"
              }`}
            ></textarea>
            {errors.description && touched.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" color="primary" disabled={loading} className="w-full sm:w-auto">
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
                "Update Policy"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
}
