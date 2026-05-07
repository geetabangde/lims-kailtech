import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "utils/axios";
import { toast } from "sonner";
import { Button, Input, Select } from "components/ui";
import { Page } from "components/shared/Page";
import ReactSelect from "react-select";

export default function AddLab() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    users: [],
    qaapprove: [],
    ulrgenerate: [],
    uploadreport: [],
    envrecord: [],
    recordEnviornment: "",
    masters: [],
    vertical: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userOptions, setUserOptions] = useState([]);
  const [masterOptions, setMasterOptions] = useState([]); // ✅ New state for masters
  const [verticalOptions, setVerticalOptions] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [userRes, masterRes, verticalRes] = await Promise.all([
          axios.get("/hrm/get-users-name"),
          axios.get("/material/get-master-list"), 
          axios.get("/master/vertical-list")
        ]);

        const userOptionsFormatted = (userRes.data.data || []).map(u => ({
          label: u.name,
          value: u.id
        }));

        const masterOptionsFormatted = (masterRes.data.data || []).map(m => ({
          label: m.name,
          value: m.id
        }));

        const verticalOptionsFormatted = (verticalRes.data.data || []).map(v => ({
          label: v.name,
          value: v.id
        }));

        setUserOptions(userOptionsFormatted);
        setMasterOptions(masterOptionsFormatted); // ✅ Set master options
        setVerticalOptions(verticalOptionsFormatted);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Something went wrong while loading form data.");
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (selectedOptions, name) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData((prev) => ({ ...prev, [name]: selectedValues }));
  };

  // Custom validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "This is required field";
    }
    
    if (!formData.vertical) {
      newErrors.vertical = "This is required field";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        vertical: parseInt(formData.vertical),
      };

      const response = await axios.post("/master/create-lab", payload);

      console.log(payload);

      if (response.data.status === "true") {
        toast.success("Lab created successfully ✅");
        navigate("/dashboards/master-data/manage-labs");
      } else {
        toast.error(response.data.message || "Failed to create lab ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const recordEnvOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" }
  ];

  return (
    <Page title="Add Manage Labs">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Manage Labs</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/master-data/manage-labs")}
          >
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Lab Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Multi-selects for users using userOptions */}
          {[
            { name: "users", label: "Allotted Users" },
            { name: "qaapprove", label: "QA Approve" },
            { name: "ulrgenerate", label: "Generate ULR" },
            { name: "uploadreport", label: "Upload Report" },
            { name: "envrecord", label: "Environmental Record" }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <ReactSelect
                isMulti
                name={field.name}
                options={userOptions}
                value={userOptions.filter(opt => formData[field.name].includes(opt.value))}
                onChange={(selected) => handleSelectChange(selected, field.name)}
              />
            </div>
          ))}

          {/* ✅ Allotted Master - Now using masterOptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allotted Master</label>
            <ReactSelect
              isMulti
              name="masters"
              options={masterOptions}
              value={masterOptions.filter(opt => formData.masters.includes(opt.value))}
              onChange={(selected) => handleSelectChange(selected, "masters")}
            />
          </div>

          {/* Record Environmental Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Record Environmental Condition
            </label>
            <ReactSelect
              name="recordEnviornment"
              options={recordEnvOptions}
              value={recordEnvOptions.find(opt => opt.value === formData.recordEnviornment) || null}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  recordEnviornment: selected ? selected.value : ""
                }))
              }
              isClearable
              placeholder="Select..."
            />
          </div>

          {/* Vertical Select with validation */}
          <div>
            <Select
              name="vertical"
              label="Vertical"
              data={verticalOptions}
              onChange={handleChange}
            />
            {errors.vertical && (
              <p className="text-red-500 text-sm mt-1">{errors.vertical}</p>
            )}
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