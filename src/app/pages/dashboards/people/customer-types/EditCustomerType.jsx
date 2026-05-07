import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditModes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState({ modeName: "", description: "" });

  useEffect(() => {
    const fetchModes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/people/get-customer-type-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && Array.isArray(result.Data) && result.Data.length > 0) {
          const item = result.Data[0]; // ✅ API returns an array, use index 0
          setMode({
            modeName: item.name || "",
            description: item.description || "",
          });
        } else {
          toast.error(result.message || "Failed to load customer type.");
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

    try {
      const form = new FormData();
      form.append("name", mode.modeName);
      form.append("description", mode.description);

      const response = await axios.post(`/people/customer-type-update/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Customer type updated successfully ✅", {
          duration: 1000,
          icon: "✅",
        });

        navigate("/dashboards/people/customer-types");
      } else {
        toast.error(result.message || "Failed to update customer type ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Customer">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Customer Type
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/people/customer-types")}
          >
            Back to Customer Types
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Type Name"
            value={mode.modeName}
            onChange={(e) => setMode({ ...mode, modeName: e.target.value })}
            required
          />
          <Input
            label="Customer Description"
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
