import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditCalibrationMethods() {
  const { id } = useParams();
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  useEffect(() => {
    if (!permissions.includes(88)) {
      navigate("/dashboards");
    }
  }, [navigate, permissions]);

  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState({ modeName: "", description: "" });

  useEffect(() => {
    const fetchModes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/calibrationoperations/calibration-method-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          setMode({
            modeName: result.data.name || "",
            description: result.data.description || "",
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

  // ✅ Update mode
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // 
  try {
      const form = new FormData();
      form.append("name", mode.modeName);
      form.append("description",mode.description);

      const response = await axios.post(`/calibrationoperations/calibration-method-update/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Unit type updated successfully ✅", {
          duration: 1000,
          icon: "✅",
        });

        navigate("/dashboards/calibration-operations/calibration-methods");
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
    <Page title="Edit Mode">
      <div className="p-6">
                {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Calibration Methods 
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/calibration-operations/calibration-methods")}
          >
            Back to Calibration Methods 
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mode Name"
            value={mode.modeName}
            onChange={(e) => setMode({ ...mode, modeName: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={mode.description}
            onChange={(e) => setMode({ ...mode, description: e.target.value })}
          />
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
