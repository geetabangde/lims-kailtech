import { useState } from "react";
import { Input, Button } from "components/ui";
import { Page } from "components/shared/Page";
import { toast } from "sonner";
import axios from "utils/axios";

export default function CustomerFeedbackForm() {
  const [form, setForm] = useState({
    date: "05/08/2025",
    recommend: "Yes",
    why: "",
    suggestions: "",
    customerName: "BIO LINE INDIA",
    contactPerson: "",
    department: "",
    designation: "",
    signature: "",
  });

  const [ratings, setRatings] = useState({
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 5,
    q6: 5,
  });

  const [loading, setLoading] = useState(false);

  const handleRatingChange = (question, value) => {
    setRatings((prev) => ({ ...prev, [question]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, ratings };
      console.log("Sending JSON:", payload);

      const res = await axios.post("/calibrationprocess/submit-feedback", payload);
      const result = res.data;

      if (result.status === "true") {
        toast.success("Feedback submitted successfully ✅");
        setTimeout(() => {
          window.location.href = "/dashboards/calibration-process/inward-entry-lab";
        }, 1000);
      } else {
        toast.error(result.message || "Failed to submit feedback ❌");
      }
    } catch (err) {
      console.error("Submit feedback error:", err);
      toast.error("Something went wrong while submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Customer Feedback Form">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Customer Feedback Form
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            onClick={() =>
              (window.location.href = "/dashboards/calibration-process/inward-entry-lab")
            }
          >
            <span>&lt; Back to Inward Entry List</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Please answer the questions below taking the following number values where 1-Poor, 2-Average, 3-Good, 4-Very Good, 5-Excellent
            </p>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
        

          
          </div>

          <table className="w-full border border-gray-300 dark:border-gray-600 text-center mb-4">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-sm">Sr. No.</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-sm">Attribute</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-sm">1</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-sm">2</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-sm">3</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-sm">4</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-sm">5</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Behavior of Staff",
                "Response to technical & General query through letter/phone/E-Mail",
                "Commitment and timely delivery of calibration certificate/test Report",
                "Quality of certificate/test report and its presentation",
                "Reliability of calibration/Test results",
                "Overall quality of services provided by us",
              ].map((label, idx) => {
                const qKey = `q${idx + 1}`;
                return (
                  <tr key={qKey}>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{idx + 1}</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-left">{label}</td>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <td key={num} className="border border-gray-300 dark:border-gray-600 p-2">
                        <input
                          type="radio"
                          name={qKey}
                          value={num}
                          checked={ratings[qKey] === num}
                          onChange={() => handleRatingChange(qKey, num)}
                          className="focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Would you like to recommend us to others please give your remark?
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recommend"
                  value="Yes"
                  checked={form.recommend === "Yes"}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recommend"
                  value="No"
                  checked={form.recommend === "No"}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500"
                />
                No
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Why?
            </label>
            <textarea
              name="why"
              value={form.why}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Suggestions/Comments for improvement
            </label>
            <textarea
              name="suggestions"
              value={form.suggestions}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Name and Address
              </label>
              <Input
                name="customerName"
                value={form.customerName}
                onChange={handleInputChange}
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact person
              </label>
              <Input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleInputChange}
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <Input
                name="department"
                value={form.department}
                onChange={handleInputChange}
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Designation
              </label>
              <Input
                name="designation"
                value={form.designation}
                onChange={handleInputChange}
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Signature with Stamp
            </label>
            <Input
              name="signature"
              value={form.signature}
              onChange={handleInputChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>

          <Button
            type="submit"
            color="primary"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}