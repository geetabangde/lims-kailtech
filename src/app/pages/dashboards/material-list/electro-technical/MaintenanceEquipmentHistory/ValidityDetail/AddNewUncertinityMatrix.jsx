import { useState } from "react";
import { Button, Card, Input } from "../../../../../../../components/ui";
import { useNavigate } from "react-router";
import ReactSelect from "react-select";

const MasterMatrixForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    unityType: "Pressure",
    mode: "",
    unit: "Hectopascal(hPa)",
    instrumentRangeMin: "",
    instrumentRangeMax: "",
    calibratedRangeMin: "",
    calibratedRangeMax: "",
    leastCount: "",
    stability: "",
    remarks: "",
    uniformity: "",
    percentageOfRange: "",
    percentageOfMeasurement: "",
    absoluteValue: "",
    point: "",
    cmc: "",
    uncertinityTerm: "",
    cmcUnit: "",
    drift: "",
    desity: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // React Select custom styles
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

  // Options for all dropdowns
  const unityTypeOptions = [
    { value: "Pressure", label: "Pressure" },
    { value: "Temperature", label: "Temperature" },
    { value: "Humidity", label: "Humidity" },
    { value: "Voltage", label: "Voltage" },
    { value: "Current", label: "Current" },
    { value: "Resistance", label: "Resistance" },
    { value: "Frequency", label: "Frequency" },
    { value: "Mass", label: "Mass" },
    { value: "Length", label: "Length" },
    { value: "Time", label: "Time" },
  ];

  const modeOptions = [
    { value: "Not Specified", label: "Not Specified" },
    { value: "AC", label: "AC" },
    { value: "DC", label: "DC" },
    { value: "Peak", label: "Peak" },
    { value: "RMS", label: "RMS" },
    { value: "Average", label: "Average" },
    { value: "Differential", label: "Differential" },
    { value: "Absolute", label: "Absolute" },
  ];

  const unitOptions = [
    { value: "Hectopascal(hPa)", label: "Hectopascal(hPa)" },
    { value: "Pascal(Pa)", label: "Pascal(Pa)" },
    { value: "Bar", label: "Bar" },
    { value: "mbar", label: "mbar" },
    { value: "kPa", label: "kPa" },
    { value: "MPa", label: "MPa" },
    { value: "psi", label: "psi" },
    { value: "atm", label: "atm" },
    { value: "mmHg", label: "mmHg" },
    { value: "inHg", label: "inHg" },
  ];

  const uncertinityTermOptions = [
    { value: "Hectopascal(hPa)", label: "Hectopascal(hPa)" },
    { value: "Pascal(Pa)", label: "Pascal(Pa)" },
    { value: "Bar", label: "Bar" },
    { value: "mbar", label: "mbar" },
    { value: "%", label: "%" },
    { value: "ppm", label: "ppm" },
    { value: "μV", label: "μV" },
    { value: "mV", label: "mV" },
  ];

  const cmcUnitOptions = [
    { value: "inc(hPa)", label: "inc(hPa)" },
    { value: "Pascal(Pa)", label: "Pascal(Pa)" },
    { value: "mbar", label: "mbar" },
    { value: "%FS", label: "%FS" },
    { value: "ppm", label: "ppm" },
    { value: "μPa", label: "μPa" },
    { value: "μbar", label: "μbar" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add master uncertinity Matrix Form
          </h1>
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs"
            color="primary"
            onClick={() =>
              navigate(
                "/dashboards/material-list/electro-technical/maintenance-equipment-history/validity-detail",
              )
            }
          >
            ← Back to Master Detail Entry List
          </Button>
        </div>

        {/* Main Form Card */}
        <Card className="rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {/* Unity Type */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Unity Type/ parameter
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={unityTypeOptions}
                  value={
                    formData.unityType
                      ? { value: formData.unityType, label: formData.unityType }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange("unityType", option ? option.value : "")
                  }
                  placeholder="Select Unity Type"
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
                  options={modeOptions}
                  value={
                    formData.mode
                      ? { value: formData.mode, label: formData.mode }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange("mode", option ? option.value : "")
                  }
                  placeholder="Select Mode"
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* Unit */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Unit
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={unitOptions}
                  value={
                    formData.unit
                      ? { value: formData.unit, label: formData.unit }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange("unit", option ? option.value : "")
                  }
                  placeholder="Select Unit"
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
                  className="flex-1 rounded border border-cyan-400 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                  value={formData.point}
                  onChange={(e) => handleInputChange("point", e.target.value)}
                />
              </div>
            </div>

            {/* CMC */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Cmc
              </label>
              <div className="col-span-9">
                <Input
                  type="text"
                  className="flex-1 rounded border border-cyan-400 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                  value={formData.cmc}
                  onChange={(e) => handleInputChange("cmc", e.target.value)}
                />
              </div>
            </div>

            {/* Uncertinity Term */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                uncertinity Term
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={uncertinityTermOptions}
                  value={
                    formData.uncertinityTerm
                      ? {
                          value: formData.uncertinityTerm,
                          label: formData.uncertinityTerm,
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange(
                      "uncertinityTerm",
                      option ? option.value : "",
                    )
                  }
                  placeholder="Select Uncertainty Term"
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* CMC Unit */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                CMC Unit
              </label>
              <div className="col-span-9">
                <ReactSelect
                  options={cmcUnitOptions}
                  value={
                    formData.cmcUnit
                      ? { value: formData.cmcUnit, label: formData.cmcUnit }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange("cmcUnit", option ? option.value : "")
                  }
                  placeholder="Select CMC Unit"
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
                  className="w-full rounded border border-cyan-400 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                  value={formData.drift}
                  onChange={(e) => handleInputChange("drift", e.target.value)}
                />
              </div>
            </div>

            {/* Desity */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-right font-medium text-gray-700">
                Desity
              </label>
              <div className="col-span-9">
                <Input
                  type="text"
                  className="w-full rounded border border-cyan-400 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                  value={formData.desity}
                  onChange={(e) => handleInputChange("desity", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button className="rounded bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600">
              Save Master Matrix
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MasterMatrixForm;
