import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function AddTechnicalAcceptance() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const inward_id = Number(pathParts[pathParts.length - 1]);

  const queryParams = new URLSearchParams(location.search);
  const caliblocation = queryParams.get("caliblocation") ;
  const calibacc = queryParams.get("calibacc");

  const [formData, setFormData] = useState({
    specification: "Clear",
    specificationdesc: "",
    methods: "Clear",
    methodsdesc: "",
    declaration: "Clear",
    declarationdesc: "",
    statementofconfirmity: "Clear",
    statementofconfirmitydesc: "",
    sampleaccepted: "Yes",
    sampleaccepteddesc: "",
    DUCCalibration: "Yes",
    resourcesavailable: "Yes",
    discussedcustomer: "Yes",
    specificrequirement: "No",
    Accessories: "Yes",
    remark: "",
    calibacc,
    caliblocation,
  });

  const [loading, setLoading] = useState(false);
  const [sampleEntryBy, setSampleEntryBy] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInwardEntry = async () => {
      try {
        const res = await axios.get(`/calibrationprocess/get-inward-entry_byid/${inward_id}`);
        if (res.data?.status && res.data.data?.sample_entryby) {
          setSampleEntryBy(res.data.data.sample_entryby);
        }
      } catch (err) {
        console.error("Error fetching inward entry:", err);
      }
    };
    fetchInwardEntry();
  }, [inward_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.remark) newErrors.remark = "Remark is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill remark field ❌");
      return;
    }

    setLoading(true);

    const payload = {
      inward_id,
      specification: formData.specification,
      specificationdesc: formData.specificationdesc,
      methods: formData.methods,
      methodsdesc: formData.methodsdesc,
      declaration: formData.declaration,
      declarationdesc: formData.declarationdesc,
      statementofconfirmity: formData.statementofconfirmity,
      statementofconfirmitydesc: formData.statementofconfirmitydesc,
      sampleaccepted: formData.sampleaccepted,
      sampleaccepteddesc: formData.sampleaccepteddesc,
      DUCCalibration: formData.DUCCalibration,
      resourcesavailable: formData.resourcesavailable,
      discussedcustomer: formData.discussedcustomer,
      specificrequirement: formData.specificrequirement,
      Accessories: formData.Accessories,
      remark: formData.remark,
      caliblocation: formData.caliblocation,
      calibacc: formData.calibacc,
    };

    try {
      await axios.post("/calibrationprocess/technical-acceptance", payload);
      toast.success("Technical Acceptance saved ", { duration: 1000 });
     
      navigate(
        `/dashboards/calibration-process/inward-entry-lab?caliblocation=${encodeURIComponent(
          caliblocation
        )}&calibacc=${encodeURIComponent(calibacc)}`
      );

    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(err?.response?.data?.message || "Failed to save ❌");
    } finally {
      setLoading(false);
    }
  };

  const renderSelectWithDesc = (label, name, options) => (
    <div className="grid grid-cols-3 gap-4">
      <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="col-span-2 grid grid-cols-2 gap-2">
        <div>
          <select
            name={name}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={formData[name]}
            onChange={handleChange}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Input
            name={`${name}desc`}
            placeholder="Enter description (optional)"
            value={formData[`${name}desc`]}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="grid grid-cols-3 gap-4">
      <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="col-span-2">
        <select
          name={name}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={formData[name]}
          onChange={handleChange}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <Page title="Technical Acceptance">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Technical Acceptance</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
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
          {renderSelectWithDesc(
            "Specification / Under NABL or Non-NABL",
            "specification",
            [
              { value: "Clear", label: "Clear" },
              { value: "Not Clear", label: "Not Clear" },
            ],
          )}
          {renderSelectWithDesc("Methods of Calibration", "methods", [
            { value: "Clear", label: "Clear" },
            { value: "Not Clear", label: "Not Clear" },
          ])}
          {renderSelectWithDesc("Declaration if required", "declaration", [
            { value: "Clear", label: "Clear" },
            { value: "Not Clear", label: "Not Clear" },
          ])}
          {renderSelectWithDesc(
            "Statement of Conformity",
            "statementofconfirmity",
            [
              { value: "Clear", label: "Clear" },
              { value: "Not Clear", label: "Not Clear" },
            ],
          )}
          {renderSelectWithDesc("Sample Accepted", "sampleaccepted", [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ])}
          {renderSelect(
            "Is the condition of DUC ok for Calibration?",
            "DUCCalibration",
            [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          )}
          {renderSelect(
            "Is the capability & resources available?",
            "resourcesavailable",
            [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          )}
          {renderSelect(
            "Is all terms & conditions discussed with customer?",
            "discussedcustomer",
            [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          )}
          {renderSelect(
            "Is there any specific requirement?",
            "specificrequirement",
            [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          )}
          {renderSelect("Accessories, if any?", "Accessories", [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ])}

          {/* Remarks */}
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Remarks *
            </label>
            <div className="col-span-2">
              <Input
                name="remark"
                placeholder="Enter remarks"
                value={formData.remark}
                onChange={handleChange}
              />
              {errors.remark && <span className="text-red-500 text-sm">{errors.remark}</span>}
            </div>
          </div>

          {/* Sample Entry By Display */}
          {sampleEntryBy && (
            <div className="mb-4 space-y-2 rounded border bg-gray-100 p-3 dark:bg-gray-700">
              <div>
                <strong>SAMPLE ENTRY BY: </strong>
                {sampleEntryBy}
              </div>
              <div>
                <strong>REVIEWED BY: </strong>
                {sampleEntryBy}
              </div>
            </div>
          )}

          <Button type="submit" color="primary" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
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