import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Page } from "components/shared/Page";
import { Button, Input, Select, Textarea } from "components/ui";
import axios from "utils/axios";
import { toast } from "sonner";

export default function AddSpecificPurpose() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    ctype: "1",
    parta: "1",
    partb: "1",
    remnant: "",
    description: "",
  });

  // ✅ Handles <Select /> component changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handles <Input /> and <Textarea /> changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Load dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [choicesRes, customerRes] = await Promise.all([
          axios.get("/get-choices"),
          axios.get("/people/get-customer-type-list"),
        ]);

        setChoices(
          (choicesRes.data?.data || []).map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }))
        );

        setCustomerTypes(
          (customerRes.data?.Data || []).map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }))
        );
      } catch (err) {
        console.error("Error loading select data:", err.response || err);
        toast.error("Failed to load dropdown data ❌");
      }
    };

    fetchData();
  }, []);

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("ctype", formData.ctype);
      form.append("parta", formData.parta);
      form.append("partb", formData.partb);
      form.append("remnant", formData.remnant);
      form.append("description", formData.description);
      console.log(FormData);

      const res = await axios.post("/people/add-specific-purpose", form);

      toast.success(res.data?.message || "Specific purpose added ✅");
      navigate("/dashboards/people/specific-purposes");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Specific Purpose">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Add Specific Purpose
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/people/specific-purposes")}
          >
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            label="Specific Purpose Name"
            placeholder="Enter purpose name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Select
            name="ctype"
            label="Customer Type"
            value={formData.ctype}
            data={customerTypes}
            onChange={handleSelectChange}
            required
          />

          <Select
            name="parta"
            label="Is Part A Required?"
            value={formData.parta}
            data={choices}
            onChange={handleSelectChange}
            required
          />

          <Select
            name="partb"
            label="Is Part B Required?"
            value={formData.partb}
            data={choices}
            onChange={handleSelectChange}
            required
          />

          <Input
            name="remnant"
            label="Remnant Period (In Days)"
            placeholder="e.g. 21"
            type="number"
            value={formData.remnant}
            onChange={handleChange}
            required
          />

          <Textarea
            name="description"
            label="Specific Purpose Description"
            placeholder="Enter description"
            value={formData.description}
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
