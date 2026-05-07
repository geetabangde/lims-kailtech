// Import Dependencies
import { useNavigate } from "react-router";
import { Page } from "components/shared/Page";
import { Button, Input } from "components/ui";
import axios from "utils/axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function AddCalibrationMethods() {
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  useEffect(() => {
    if (!permissions.includes(89)) {
      navigate("/dashboards");
    }
  }, [navigate, permissions]);

  const [loading, setLoading] = useState(false);

  const [method, setMethod] = useState({
    name: "",
    description: "",
  });

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMethod((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", method.name);
      form.append("description", method.description);

      await axios.post(
        "/calibrationoperations/calibration-method-add",
        form
      );

      toast.success("Calibration method created successfully ✅", {
        duration: 1200,
        icon: "✅",
      });

      navigate("/dashboards/calibration-operations/calibration-methods");
    } catch (err) {
      console.error("Error creating method:", err);
      toast.error(
        err?.response?.data?.message || "Failed to create calibration method ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Calibration Method">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Calibration Method / SOP</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              navigate("/dashboards/calibration-operations/calibration-methods")
            }
          >
            Back
          </Button>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Calibration Name"
            name="name"
            placeholder="Enter Name"
            value={method.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Calibration Description / SOP Ref"
            name="description"
            placeholder="Enter Description or SOP Reference"
            value={method.description}
            onChange={handleChange}
            required
          />

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
