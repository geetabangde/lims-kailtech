import { useEffect, useState } from "react";
import { Button } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function ReviewInwardEntry() {
  const navigate = useNavigate();
  const pathParts = window.location.pathname.split("/");
  const inwardId = pathParts[pathParts.length - 1];

  const searchParams = new URLSearchParams(window.location.search);
  const caliblocation = searchParams.get("caliblocation") || "Lab";
  const calibacc = searchParams.get("calibacc") || "Nabl";

  const [formData, setFormData] = useState({
    inward_id: inwardId,
    caliblocation,
    calibacc,
    witness: "Not Required",
    packingofsample: "Unsealed",
    iqc: "Yes",
    timeschedule: "",
    payment: "No",
    subcontracting: "No",
    sampleaccepted: "NO",
    reviewremark: "", // Added to fix undefined error in textarea
  });

  const [readonlyData, setReadonlyData] = useState({
    inwarddate: "",
    id: "",
    customername: "",
    workorderno: "",
    modeofreciept: "",
    reportname: "",
    reportaddress: "",
    billingname: "",
    billingaddress: "",
    gstno: "",
    sampleentryby: "",
    ponumber: "",
    
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInwardData = async () => {
      try {
        const res = await axios.get(`/calibrationprocess/get-inward-entry_byid/${inwardId}`);
        const data = res.data;

        if (data.status === "true" || data.status === true) {
          const r = data.data;
          setReadonlyData({
            inwarddate: r.inwarddate || "",
            ponumber: r.ponumber || "",
            bookingref: r.id || "",
            customername: r.customername || "",
            workorderno: r.workorderno || "",
            modeofreciept: r.modeOfReceipt_name || "",
            reportname: r.reportname_name || "",
            reportaddress: r.reportaddress_name || "",
            billingname: r.billingname_name || "",
            billingaddress: r.billingaddress_name || "",
            gstno: r.gstno || "",
            sampleentryby: r.sample_entryby  || "",
          });
        } else {
          toast.error("Failed to fetch inward entry");
        }
      } catch {
        toast.error("Error fetching inward entry");
      }
    };

    fetchInwardData();
  }, [inwardId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/calibrationprocess/review-inward-entry", formData);

      if (res.data.status === "true") {
        const successMessage = "Review submitted successfully!🎉";
        toast.success(successMessage);
        setTimeout(() => {
          
          navigate(
            `/dashboards/calibration-process/inward-entry-lab?caliblocation=${encodeURIComponent(
              caliblocation
            )}&calibacc=${encodeURIComponent(calibacc)}`
          );

        }, 1000);
      } else {
        toast.error(res.data.message || "Submission failed ❌");
      }
    } catch {
      toast.error("Error during submission ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Review Inward Entry">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Inward Entry Form
          </h2>
          <Button
          variant="outline"
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          onClick={() =>
            navigate(
              `/dashboards/calibration-process/inward-entry-lab?caliblocation=${encodeURIComponent(
                caliblocation
              )}&calibacc=${encodeURIComponent(calibacc)}`
            )
          }
        >
          Back to Inward Entry List
        </Button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden Inputs */}
          <input type="hidden" name="inward_id" value={formData.inward_id} />
          <input type="hidden" name="caliblocation" value={formData.caliblocation} />
          <input type="hidden" name="calibacc" value={formData.calibacc} />

          {/* Read-Only Info */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.inwarddate || "-"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Booking Reference no
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.bookingref || "-"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Customer name
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.customername || "-"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Work order no
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.ponumber || "-"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mode Of Receipt
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.modeofreciept || "-"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Report in whose name
          
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.reportname || "-"} {readonlyData.reportaddress || "-"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Billing in whose name
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.billingname || "-"} {readonlyData.billingaddress || "-"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              GST No
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.gstno || "N/A"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Sample Entry By
            </label>
            <p className="col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {readonlyData.sampleentryby || "N/A"}
            </p>
          </div>

          {/* Witness */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Witness (Required/Not Required)
            </label>
            <div className="col-span-2 space-x-4">
              <label>
                <input
                  type="radio"
                  name="witness"
                  value="Required"
                  checked={formData.witness === "Required"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                Required
              </label>
              <label>
                <input
                  type="radio"
                  name="witness"
                  value="Not Required"
                  checked={formData.witness === "Not Required"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                Not Required
              </label>
            </div>
          </div>

          {/* Packing Of Sample */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Packing Of Sample (Sealed/Unsealed)
            </label>
            <div className="col-span-2 space-x-4">
              <label>
                <input
                  type="radio"
                  name="packingofsample"
                  value="Sealed"
                  checked={formData.packingofsample === "Sealed"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                Sealed
              </label>
              <label>
                <input
                  type="radio"
                  name="packingofsample"
                  value="Unsealed"
                  checked={formData.packingofsample === "Unsealed"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                Unsealed
              </label>
            </div>
          </div>

          {/* Time Schedule */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Schedule
            </label>
            <div className="col-span-2">
              <select
                name="timeschedule"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                value={formData.timeschedule}
                onChange={handleChange}
                required
              >
                <option value=">Not Clear">Not Clear</option>
                <option value="Clear">Clear</option>
              </select>
            </div>
          </div>

          {/* Payment Received */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Received (Received/No)
            </label>
            <div className="col-span-2 space-x-4">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Received"
                  checked={formData.payment === "Received"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                Received
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="No"
                  checked={formData.payment === "No"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                No
              </label>
            </div>
          </div>

          {/* Subcontracting */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Sub Contracting
            </label>
            <div className="col-span-2 space-x-4">
              <label>
                <input
                  type="radio"
                  name="subcontracting"
                  value="Yes"
                  checked={formData.subcontracting === "Yes"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="subcontracting"
                  value="No"
                  checked={formData.subcontracting === "No"}
                  onChange={handleChange}
                  className="focus:ring-blue-500"
                />
                No
              </label>
            </div>
          </div>

          {/* Sample Accepted */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Sample Accepted
            </label>
            <div className="col-span-2">
              <select
                name="sampleaccepted"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                value={formData.sampleaccepted}
                onChange={handleChange}
                required
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          {/* IQC */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              IQC
            </label>
            <div className="col-span-2">
              <select
                name="iqc"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                value={formData.iqc}
                onChange={handleChange}
                required
              >
               
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Remarks
            </label>
            <div className="col-span-2">
              <textarea
                name="reviewremark"
                value={formData.reviewremark}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                placeholder="Enter any remarks..."
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 float-right"
          >
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
                Submitting...
              </div>
            ) : (
              "Review Inward Entry"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}