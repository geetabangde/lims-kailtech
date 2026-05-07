import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditVertical() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [vertical, setVertical] = useState({ name: "", code: "" });
  
  const [errors, setErrors] = useState({
    name: "",
    code: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    code: false,
  });

  useEffect(() => {
    const fetchVertical = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`inventory/category-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          const taxSlab = result.data;
          setVertical({
            name: taxSlab.name || "",
            code: taxSlab.code || "",
          });
        } else {
          toast.error(result.message || "Failed to load vertical.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong while loading vertical.");
      } finally {
        setLoading(false);
      }
    };

    fetchVertical();
  }, [id]);

  // Handle input change
  const handleChange = (field, value) => {
    setVertical({ ...vertical, [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle field blur to show validation
  const handleBlur = (field, value) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate field on blur
    validateField(field, value);
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
    if (!vertical.name.trim()) {
      newErrors.name = "This field is required";
      isValid = false;
    }

    // Validate code
    if (!vertical.code.trim()) {
      newErrors.code = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      code: true,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", vertical.name);
      form.append("code", vertical.code);

      const response = await axios.post(`inventory/category-update/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Category updated successfully ✅", {
          duration: 1000,
          icon: "✅",
        });
        navigate("/dashboards/inventory/categories");
      } else {
        toast.error(result.message || "Failed to update vertical ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating vertical.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Categories">
      <div className="p-6">
        {/* Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Categories
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/inventory/categories")}
          >
            Back to List
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Category Name"
              value={vertical.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={(e) => handleBlur("name", e.target.value)}
              className={errors.name && touched.name ? "border-red-500" : ""}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Code"
              value={vertical.code}
              onChange={(e) => handleChange("code", e.target.value)}
              onBlur={(e) => handleBlur("code", e.target.value)}
              className={errors.code && touched.code ? "border-red-500" : ""}
            />
            {errors.code && touched.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
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