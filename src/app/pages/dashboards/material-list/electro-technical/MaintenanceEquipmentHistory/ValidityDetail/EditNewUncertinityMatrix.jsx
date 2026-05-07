import { useState, useEffect } from "react";
import { Button, Card, Input } from "../../../../../../../components/ui";
import { useNavigate, useLocation } from "react-router";
import axios from "utils/axios";
import toast, { Toaster } from "react-hot-toast";
import ReactSelect from "react-select";


const EditNewUncertaintyMatrix = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [urlParams, setUrlParams] = useState({
    fid: "",
    cid: "",
    labId: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dropdown data states
  const [unitTypes, setUnitTypes] = useState([]);
  const [modes, setModes] = useState([]);
  const [units, setUnits] = useState([]);
  const [uncertaintyTerms] = useState([
    { id: 1, name: "Absolute", value: "absolute" },
    { id: 2, name: "Percentage", value: "percentage" },
    { id: 3, name: "Relative", value: "relative" },
  ]);
  const [cmcUnits, setCmcUnits] = useState([]);

  const [formData, setFormData] = useState({
    unityType: "",
    mode: "",
    unit: "",
    point: "",
    cmc: "",
    uncertaintyTerm: "",
    cmcUnit: "",
    drift: "",
    density: "",
  });

  // Extract URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fid = params.get("fid") || "";
    const cid = params.get("cid") || "";
    const labId = params.get("labId") || "";
    const id = params.get("id") || "";

    setUrlParams({ fid, cid, labId, id });
  }, [location.search]);

  // Fetch all dropdown data on component mount
  useEffect(() => {
    if (urlParams.fid && urlParams.cid) {
      fetchAllDropdownData();
    }
  }, [urlParams.fid, urlParams.cid]);

  // Fetch all dropdown data
  const fetchAllDropdownData = async () => {
    try {
      // Fetch all APIs in parallel
      const [unitTypesRes, modesRes, unitsRes] = await Promise.all([
        axios.get("/master/unit-type-list"),
        axios.get("/master/mode-list"),
        axios.get("/master/units-list"),
      ]);

      // Set unit types
      if (unitTypesRes.data.status && unitTypesRes.data.data) {
        setUnitTypes(unitTypesRes.data.data);
      }

      // Set modes
      if (modesRes.data.status && modesRes.data.data) {
        setModes(modesRes.data.data);
      }

      // Set units (name + description for display) and CMC units (only description)
      if (unitsRes.data.status && unitsRes.data.data) {
        setUnits(unitsRes.data.data);
        setCmcUnits(unitsRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      toast.error("Failed to load dropdown data");
    }
  };

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      if (!urlParams.id || !urlParams.fid || !urlParams.cid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `/material/get-masteruncertinity-byid`,
          {
            params: {
              fid: urlParams.fid,
              cid: urlParams.cid,
              id: urlParams.id,
            },
          },
        );

        if (response.data && response.data.status) {
          const data = response.data.data;
          setFormData({
            unityType: data.unittype || "",
            mode: data.mode || "",
            unit: data.unit?.toString() || "",
            point: data.point || "",
            cmc: data.cmc || "",
            uncertaintyTerm: data.uncertaintyTerm || "",
            cmcUnit: data.cmcunit?.toString() || "",
            drift: data.drift || "",
            density: data.density || "",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [urlParams.id, urlParams.fid, urlParams.cid]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderColor: state.isFocused ? "#0891b2" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgb(6 182 212 / 0.5)" : "none",
      "&:hover": { borderColor: "#0891b2" },
      backgroundColor: "white",
      borderRadius: "0.375rem",
    }),
    menu: (base) => ({ ...base, borderRadius: "0.375rem", zIndex: 9999 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#0891b2"
        : state.isFocused
          ? "#e0f2fe"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:active": { backgroundColor: "#06b6d4" },
    }),
  };

  const handleSave = async () => {
    // Validation
    if (!formData.unityType) {
      toast.error("Please select Unity Type/Parameter");
      return;
    }

    // if (!formData.mode) {
    //   toast.error('Please select Mode');
    //   return;
    // }

    if (!formData.unit) {
      toast.error("Please select Unit");
      return;
    }

    if (!formData.point) {
      toast.error("Please enter Point");
      return;
    }

    if (!formData.cmc) {
      toast.error("Please enter CMC");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        id: parseInt(urlParams.id),
        unittype: formData.unityType,
        mode: formData.mode,
        unit: parseInt(formData.unit),
        point: parseFloat(formData.point) || 0,
        cmc: parseFloat(formData.cmc) || 0,
        uncertaintyTerm: formData.uncertaintyTerm,
        cmcunit: parseInt(formData.cmcUnit),
        drift: parseFloat(formData.drift) || 0,
        density: parseFloat(formData.density) || 0,
        masterid: parseInt(urlParams.fid),
        certificateid: parseInt(urlParams.cid),
      };

      const response = await axios.post(
        `/material/update-masterUncertainty-matrix`,
        payload,
      );

      if (response.data?.status) {
        toast.success(response.data?.message || "Matrix has been updated");
        setTimeout(() => {
          handleBackNavigation();
        }, 1500);
      } else {
        toast.error(response.data?.message || "Failed to update record");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error(err.response?.data?.message || "Failed to update record");
    } finally {
      setSaving(false);
    }
  };

  const handleBackNavigation = () => {
    const params = new URLSearchParams();
    if (urlParams.fid) params.append("fid", urlParams.fid);
    if (urlParams.cid) params.append("cid", urlParams.cid);
    if (urlParams.labId) params.append("labId", urlParams.labId);

    navigate(
      `/dashboards/material-list/electro-technical/maintenance-equipment-history/validity-detail?${params.toString()}`,
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-600">
        <svg
          className="mr-2 h-6 w-6 animate-spin text-blue-600"
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
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Master Uncertainty Matrix Form
          </h1>
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs"
            color="primary"
            onClick={handleBackNavigation}
          >
            ← Back to Master Detail Entry List
          </Button>
        </div>

        <Card className="rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-5">
            {/* Unity Type */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Unity Type/ parameter
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={unitTypes.map((type) => ({
                    value: type.name,
                    label: type.name,
                  }))}
                  value={
                    formData.unityType
                      ? { value: formData.unityType, label: formData.unityType }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange("unityType", option ? option.value : "")
                  }
                  placeholder="Select Unity Type"
                  isDisabled={saving}
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* Mode */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Mode
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={modes.map((mode) => ({
                    value: mode.name,
                    label: mode.name,
                  }))}
                  value={
                    formData.mode
                      ? { value: formData.mode, label: formData.mode }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange("mode", option ? option.value : "")
                  }
                  placeholder="Select Mode"
                  isDisabled={saving}
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* Unit - Now showing name + description */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Unit
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={units.map((unit) => ({
                    value: unit.id,
                    label: `${unit.name} ${unit.description ? `(${unit.description})` : ""}`,
                  }))}
                  value={
                    formData.unit
                      ? {
                          value: formData.unit,
                          label:
                            units.find(
                              (u) => String(u.id) === String(formData.unit),
                            )?.name || formData.unit,
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange(
                      "unit",
                      option ? String(option.value) : "",
                    )
                  }
                  placeholder="Select Unit"
                  isDisabled={saving}
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* Point */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Point
              </label>
              <div className="col-span-9">
                <Input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  value={formData.point}
                  onChange={(e) => handleInputChange("point", e.target.value)}
                  placeholder="Enter point"
                  disabled={saving}
                />
              </div>
            </div>

            {/* CMC */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                CMC
              </label>
              <div className="col-span-9">
                <Input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  value={formData.cmc}
                  onChange={(e) => handleInputChange("cmc", e.target.value)}
                  placeholder="Enter CMC"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Uncertainty Term */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Uncertainty Term
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={uncertaintyTerms.map((term) => ({
                    value: term.value,
                    label: term.name,
                  }))}
                  value={
                    formData.uncertaintyTerm
                      ? {
                          value: formData.uncertaintyTerm,
                          label:
                            uncertaintyTerms.find(
                              (t) => t.value === formData.uncertaintyTerm,
                            )?.name || formData.uncertaintyTerm,
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange(
                      "uncertaintyTerm",
                      option ? option.value : "",
                    )
                  }
                  placeholder="Select Uncertainty Term"
                  isDisabled={saving}
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* CMC Unit - Now showing only description */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                CMC Unit
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={cmcUnits.map((unit) => ({
                    value: unit.id,
                    label: unit.description || unit.name,
                  }))}
                  value={
                    formData.cmcUnit
                      ? {
                          value: formData.cmcUnit,
                          label:
                            cmcUnits.find(
                              (u) => String(u.id) === String(formData.cmcUnit),
                            )?.description ||
                            cmcUnits.find(
                              (u) => String(u.id) === String(formData.cmcUnit),
                            )?.name ||
                            formData.cmcUnit,
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange(
                      "cmcUnit",
                      option ? String(option.value) : "",
                    )
                  }
                  placeholder="Select CMC Unit"
                  isDisabled={saving}
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* Drift */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Drift
              </label>
              <div className="col-span-9">
                <Input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  value={formData.drift}
                  onChange={(e) => handleInputChange("drift", e.target.value)}
                  placeholder="Enter drift"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Density */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Density
              </label>
              <div className="col-span-9">
                <Input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  value={formData.density}
                  onChange={(e) => handleInputChange("density", e.target.value)}
                  placeholder="Enter density"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button
              className="rounded bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Master Matrix"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditNewUncertaintyMatrix;
