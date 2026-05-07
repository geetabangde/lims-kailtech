import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function EditBdPerson() {
  const navigate = useNavigate();
  // ✅ Get ID manually from URL path
  const pathParts = window.location.pathname.split("/");
  const id = pathParts[pathParts.length - 1];

  const [bdList, setBdList] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedBd, setSelectedBd] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Get query params manually
  const searchParams = new URLSearchParams(window.location.search);
  const caliblocationParam = searchParams.get("caliblocation");
  const calibaccParam = searchParams.get("calibacc");
  const caliblocation =
    !caliblocationParam || caliblocationParam === "undefined"
      ? "Lab"
      : caliblocationParam;
  const calibacc =
    !calibaccParam || calibaccParam === "undefined"
      ? "Nabl"
      : calibaccParam;

 useEffect(() => {
  const fetchBdList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/calibrationprocess/edit-bdPerson?inward_id=${id}&caliblocation=${caliblocation}&calibacc=${calibacc}`
      );
      const result = res.data;
      console.log("API response:", result);

      if (result.status === "true" && result.reviewers) {
        setBdList(result.reviewers || []);

        // ✅ Set customer name
        if (result.customer && result.customer.length > 0) {
          setCustomerName(result.customer[0].name || "");
        } else {
          setCustomerName("");
        }

        // ✅ Set selected BD ONLY if exists
        if (
          result.bd !== null &&
          result.bd !== "" &&
          typeof result.bd !== "undefined"
        ) {
          setSelectedBd(result.bd.toString());
        } else {
          setSelectedBd("");
        }

      } else {
        toast.error(result.message || "Failed to load BD Person list.");
      }
    } catch (err) {
      console.error("Fetch BD error:", err);
      toast.error("Something went wrong while loading BD Person list.");
    } finally {
      setLoading(false);
    }
  };

  fetchBdList();
}, [id, caliblocation, calibacc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBd) {
      toast.error("Please select a BD Person");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        inward_id: id,
        bd: selectedBd,
        caliblocation: caliblocation,
        calibacc: calibacc,
      };

      console.log("Sending JSON:", payload);

      const res = await axios.post(`/calibrationprocess/update-bd`, payload);
      const result = res.data;

      if (result.status === "true") {
        toast.success("BD person updated successfully ✅");
        setTimeout(() => {
          navigate(
            `/dashboards/calibration-process/inward-entry-lab?caliblocation=${encodeURIComponent(
              caliblocationParam
            )}&calibacc=${encodeURIComponent(calibaccParam)}`
          );
        }, 1000);

       
      } 
    else {
        toast.error(result.message || "Failed to update BD Person ❌");
      }
    } catch (err) {
      console.error("Save BD error:", err);
      toast.error("Something went wrong while updating BD Person.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit BD Person">
      <div className="p-6">
        {/* ✅ Header with back button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Link BD Person
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              navigate(
                `/dashboards/calibration-process/inward-entry-lab?caliblocation=${encodeURIComponent(
                  caliblocationParam
                )}&calibacc=${encodeURIComponent(calibaccParam)}`
              )
            }
          >
            Back to Inward Entry List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <Input value={customerName} readOnly />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select BD Person
            </label>
            <select
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
              value={selectedBd}
              onChange={(e) => setSelectedBd(e.target.value)}
              required
            >
              <option value="">Select BD Person</option>
              {bdList.map((bd) => (
                <option key={bd.id} value={bd.id}>
                  {bd.firstname} {bd.lastname}
                </option>
              ))}
            </select>
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
                Linking...
              </div>
            ) : (
              "Link trf"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}
