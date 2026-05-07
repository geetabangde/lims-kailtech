import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "utils/axios";
import { toast } from "sonner";
import { Button, Input, Select } from "components/ui";
import { Page } from "components/shared/Page";
import ReactSelect from "react-select";

export default function AddInstrument() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sop: [],
    standard: [],
    typeofsupport: [],
    typeofmaster: [],
    description: "",
    discipline: "",
    groups: "",
    remark: "",
    range: "",
    leastcount: "",
    unittype: "",
    mode: "",
    supportmaster: "",
    supportrange: "",
    supportleastcount: "",
    supportunittype: "",
    supportmode: "",
    scopematrixvalidation: "",
    digitincmc: "2",
    biomedical: "No",
    showvisualtest: "No",
    showelectricalsafety: "No",
    showbasicsafety: "No",
    showperformancetest: "No",
    setpoint: "UUC",
    uuc: "1",
    master: "1",
    setpointheading: "Set Point",
    parameterheading: "",
    uucheading: "Observation On UUC",
    masterheading: "Standard Reading",
    errorheading: "Error",
    remarkheading: "Remark",
    setpointtoshow: "Yes",
    parametertoshow: "Yes",
    uuctoshow: "Yes",
    mastertoshow: "Yes",
    errortoshow: "Yes",
    remarktoshow: "Yes",
    specificationtoshow: "Yes",
    specificationheading: "",
    tempsite: "",
    tempvariablesite: "",
    humisite: "",
    humivariablesite: "",
    templab: "",
    tempvariablelab: "",
    humilab: "",
    humivariablelab: "",
    mastersincertificate: "Yes",
    uncertaintyincertificate: "Yes",
    allottolab: "",
    suffix: [],
    uncertaintytable: [],
    vertical: "1",
  });

  const [priceLists, setPriceLists] = useState([
    {
      packagename: "",
      packagedesc: "",
      accreditation: "",
      location: "",
      currency: null,
      rate: "",
      daysrequired: "",
      matrices: [],
    },
  ]);

  const [sopOptions, setSopOptions] = useState([]);
  const [standardOptions, setStandardOptions] = useState([]);
  const [subcategoryOne, setSubcategoryOne] = useState([]);
  const [subcategoryTwo, setSubcategoryTwo] = useState([]);
  const [formateOptions, setFormateOptions] = useState([]);
  const [labOptions, setLabOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [unitTypeOptions, setUnitTypeOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [modeOptions, setModeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Required fields list
  const requiredFields = {
    name: "Instrument Name",
    sop: "Calibration Method / SOP",
    description: "Description",
    discipline: "Discipline",
    groups: "Group",
    tempsite: "Temperature Range for Site",
    humisite: "Humidity Range for Site",
    templab: "Temperature Range for Lab",
    humilab: "Humidity Range for Lab"
  };

  // Required fields for price list
  const requiredPriceFields = {
    packagename: "Package Name",
    packagedesc: "Package Description",
    daysrequired: "Days Required",
    rate: "Rate"
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [
          sopRes,
          standardRes,
          subcategoryoneRes,
          subcategorytwoRes,
          formatelist,
          lablist,
          currencylist,
          unitTypeRes,
          unitRes,
          modeRes,
        ] = await Promise.all([
          axios.get("/calibrationoperations/calibration-method-list"),
          axios.get("/calibrationoperations/calibration-standard-list"),
          axios.get("/inventory/subcategory-list"),
          axios.get("/inventory/subcategory-list"),
          axios.get("/get-formate"),
          axios.get("/master/list-lab"),
          axios.get("/master/currency-list"),
          axios.get("/master/unit-type-list"),
          axios.get("/master/units-list"),
          axios.get("/master/mode-list"),
        ]);
        const safeArray = (data) => (Array.isArray(data) ? data : []);

        setSopOptions(safeArray(sopRes.data.data).map((item) => ({ label: item.name, value: item.id.toString() })));
        setStandardOptions(safeArray(standardRes.data.data).map((item) => ({ label: item.name, value: item.id.toString() })));
        setSubcategoryOne(safeArray(subcategoryoneRes.data.data).map((item) => ({ label: item.name, value: item.id.toString() })));
        setSubcategoryTwo(safeArray(subcategorytwoRes.data.data).map((item) => ({ label: item.name, value: item.id.toString() })));
        setFormateOptions(safeArray(formatelist.data.data).map((item) => ({ label: item.name, value: item.description.toString() })));
        setLabOptions(safeArray(lablist.data.data).map((item) => ({ label: item.name, value: item.id.toString() })));
        setCurrencyOptions(safeArray(currencylist.data.data).map((item) => ({ label: `${item.name} (${item.description})`, value: item.id.toString() })));
        setUnitTypeOptions(unitTypeRes.data.data?.map((item) => ({ label: item.name, value: item.name })) || []);
        setUnitOptions(unitRes.data.data?.map((item) => ({ label: item.name, value: item.id.toString() })) || []);
        setModeOptions(modeRes.data.data?.map((item) => ({ label: item.name, value: item.name })) || []);
      } catch (err) {
        toast.error("Error loading dropdown data");
        console.error("Dropdown Fetch Error:", err);
      }
    };

    fetchDropdowns();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleMultiSelectChange = (selectedOptions, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));

    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSingleSelectChange = (selectedOption, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: selectedOption?.value || "",
    }));

    // Clear error when user makes selection
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: false
      }));
    }
  };

  const handlePriceListChange = (index, e) => {
    const { name, value } = e.target;
    setPriceLists((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });

    // Clear price list errors
    if (errors[`price_${index}_${name}`]) {
      setErrors(prev => ({
        ...prev,
        [`price_${index}_${name}`]: false
      }));
    }
  };

  const handlePriceCurrencyChange = (selected, index) => {
    setPriceLists((prev) => {
      const updated = [...prev];
      updated[index].currency = selected;
      return updated;
    });
  };

  const handleMatrixChange = (priceIndex, matrixIndex, e) => {
    const { name, value } = e.target;
    setPriceLists((prev) => {
      const updated = [...prev];
      updated[priceIndex].matrices[matrixIndex][name] = value;
      return updated;
    });
  };

  const addMatrix = useCallback((priceIndex) => {
    setPriceLists((prev) => {
      // Create a new array to avoid mutating state directly
      const updated = [...prev];
      const selectedPrice = { ...updated[priceIndex] };
      const newMatrices = [...(selectedPrice.matrices || [])];

      // Check if the last matrix is identical to a new empty matrix
      const newMatrix = {
        unittype: "",
        unit: "",
        mode: "",
        instrangemin: "",
        instrangemax: "",
        tolerance: "",
        tolerancetype: "",
      };

      // Prevent adding if the last matrix is identical (debounce-like behavior)
      if (
        newMatrices.length > 0 &&
        JSON.stringify(newMatrices[newMatrices.length - 1]) === JSON.stringify(newMatrix)
      ) {
        // console.warn("Duplicate matrix addition prevented");
        return prev; // Return previous state to prevent duplicate addition
      }

      newMatrices.push(newMatrix);
      selectedPrice.matrices = newMatrices;
      updated[priceIndex] = selectedPrice;

      return updated;
    });
  }, []);

  const removeMatrix = (priceIndex, matrixIndex) => {
    setPriceLists((prev) => {
      const updated = [...prev];
      updated[priceIndex].matrices = updated[priceIndex].matrices.filter((_, i) => i !== matrixIndex);
      return updated;
    });
  };

  const addPriceList = () => {
    setPriceLists((prev) => [
      ...prev,
      {
        packagename: "",
        packagedesc: "",
        accreditation: "",
        location: "",
        currency: null,
        rate: "",
        daysrequired: "",
        matrices: [],
      },
    ]);
  };

  const removePriceList = (index) => {
    setPriceLists((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    // Check main form required fields
    Object.keys(requiredFields).forEach(field => {
      if (field === 'sop') {
        // For sop array, check if it has at least one item
        if (!formData[field] || formData[field].length === 0) {
          newErrors[field] = true;
        }
      } else {
        // For other fields, check if empty or whitespace only
        if (!formData[field] || formData[field].toString().trim() === '') {
          newErrors[field] = true;
        }
      }
    });

    // Check price list required fields
    priceLists.forEach((price, index) => {
      Object.keys(requiredPriceFields).forEach(field => {
        if (!price[field] || price[field].toString().trim() === '') {
          newErrors[`price_${index}_${field}`] = true;
        }
      });
    });

    setErrors(newErrors);

    // If there are errors, focus on the first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      let element;

      if (firstErrorField.startsWith('price_')) {
        // Handle price list field errors
        const fieldParts = firstErrorField.split('_');
        const fieldName = fieldParts[2];
        element = document.querySelector(`input[name="${fieldName}"]`);
      } else {
        element = document.querySelector(`[name="${firstErrorField}"]`);
      }

      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        suffix: Array.isArray(formData.suffix)
          ? formData.suffix[0] || ""
          : formData.suffix || "",
        uncertaintytable: Array.isArray(formData.uncertaintytable)
          ? formData.uncertaintytable[0] || ""
          : formData.uncertaintytable || "",
        packagename: [],
        packagedesc: [],
        pricematrix: [],
        accreditationpricelist: [],
        locationpricelist: [],
        daysrequiredpricelist: [],
        ratepricelist: [],
        currencypricelist: [],
      };

      priceLists.forEach((price, priceIndex) => {
        payload.pricematrix.push(priceIndex);
        payload.packagename.push(price.packagename);
        payload.packagedesc.push(price.packagedesc);
        payload.accreditationpricelist.push(price.accreditation);
        payload.locationpricelist.push(price.location);
        payload.daysrequiredpricelist.push(price.daysrequired);
        payload.ratepricelist.push(price.rate);
        payload.currencypricelist.push(price.currency?.value || "");

        price.matrices.forEach((matrix, matrixIndex) => {
          const prefix = `${priceIndex}`;

          payload[`matrixno${prefix}`] = payload[`matrixno${prefix}`] || [];
          payload[`unittype${prefix}`] = payload[`unittype${prefix}`] || [];
          payload[`unit${prefix}`] = payload[`unit${prefix}`] || [];
          payload[`mode${prefix}`] = payload[`mode${prefix}`] || [];
          payload[`instrangemin${prefix}`] = payload[`instrangemin${prefix}`] || [];
          payload[`instrangemax${prefix}`] = payload[`instrangemax${prefix}`] || [];
          payload[`tolerance${prefix}`] = payload[`tolerance${prefix}`] || [];
          payload[`tolerancetype${prefix}`] = payload[`tolerancetype${prefix}`] || [];

          payload[`matrixno${prefix}`].push(matrixIndex + 1);
          payload[`unittype${prefix}`].push(matrix.unittype);
          payload[`unit${prefix}`].push(matrix.unit);
          payload[`mode${prefix}`].push(matrix.mode);
          payload[`instrangemin${prefix}`].push(matrix.instrangemin);
          payload[`instrangemax${prefix}`].push(matrix.instrangemax);
          payload[`tolerance${prefix}`].push(matrix.tolerance);
          payload[`tolerancetype${prefix}`].push(matrix.tolerancetype);
        });
      });

      console.log(" FINAL JSON Payload:", payload);

      await axios.post(
        "/calibrationoperations/add-new-instrument",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Instrument added successfully");
      navigate("/dashboards/calibration-operations/instrument-list");
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Error adding instrument");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Instrument">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Instrument</h2>
          <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate("/dashboards/calibration-operations/instrument-list")}
          >
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Main Form Fields */}
          <div>
            <Input
              label="Instrument Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500 bg-red-50" : ""}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
              Calibration Method / SOP <span className="text-red-500">*</span>
            </label>
            <ReactSelect
              isMulti
              name="sop"
              options={sopOptions}
              value={sopOptions.filter((opt) => formData.sop.includes(opt.value))}
              onChange={(selected) => handleMultiSelectChange(selected, "sop")}
              placeholder="Select Calibration Methods"
              className={errors.sop ? "react-select-error" : ""}
            />
            {errors.sop && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Calibration Standard</label>
            <ReactSelect
              isMulti
              name="standard"
              options={standardOptions}
              value={standardOptions.filter((opt) => formData.standard.includes(opt.value))}
              onChange={(selected) => handleMultiSelectChange(selected, "standard")}
              placeholder="Select Calibration Standards"
            />
          </div>

          <div>
            <Input
              label="Instrument Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? "border-red-500 bg-red-50" : ""}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <input type="hidden" name="vertical" value={formData.vertical} />

          <div>
            <Input
              label="Discipline"
              name="discipline"
              value={formData.discipline}
              onChange={handleInputChange}
              className={errors.discipline ? "border-red-500 bg-red-50" : ""}
            />
            {errors.discipline && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <Input
              label="Group"
              name="groups"
              value={formData.groups}
              onChange={handleInputChange}
              className={errors.groups ? "border-red-500 bg-red-50" : ""}
            />
            {errors.groups && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <Input
              label="Remark"
              name="remark"
              value={formData.remark}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <h1 className="text-lg font-semibold">Validation</h1>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Range Validation</label>
            <Select
              name="range"
              value={formData.range}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Leastcount Validation</label>
            <Select
              name="leastcount"
              value={formData.leastcount}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Unittype</label>
            <Select
              name="unittype"
              value={formData.unittype}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Mode</label>
            <Select
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Support Required</label>
            <Select
              name="supportmaster"
              value={formData.supportmaster}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Type Of Support</label>
            <ReactSelect
              isMulti
              name="typeofsupport"
              options={subcategoryOne}
              value={subcategoryOne.filter((opt) => formData.typeofsupport.includes(opt.value))}
              onChange={(selected) => handleMultiSelectChange(selected, "typeofsupport")}
              placeholder="Select Type Of Support"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Range Validation For Support</label>
            <Select
              name="supportrange"
              value={formData.supportrange}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Leastcount Validation For Support</label>
            <Select
              name="supportleastcount"
              value={formData.supportleastcount}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Unittype For Support</label>
            <Select
              name="supportunittype"
              value={formData.supportunittype}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Mode For Support</label>
            <Select
              name="supportmode"
              value={formData.supportmode}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Type Of Master Required</label>
            <ReactSelect
              isMulti
              name="typeofmaster"
              options={subcategoryTwo}
              value={subcategoryTwo.filter((opt) => formData.typeofmaster.includes(opt.value))}
              onChange={(selected) => handleMultiSelectChange(selected, "typeofmaster")}
              placeholder="Select Type Of Master"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Scope Matrix Validation</label>
            <Select
              name="scopematrixvalidation"
              value={formData.scopematrixvalidation}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <Input
            label="No Of Digit in CMC"
            name="digitincmc"
            type="number"
            value={formData.digitincmc}
            onChange={handleInputChange}
          />
          <div className="col-span-1 md:col-span-2">
            <h1 className="text-lg font-semibold">Biomedical Details</h1>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Bio Medical Format</label>
            <Select
              name="biomedical"
              value={formData.biomedical}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Show Visual Test On Certificate</label>
            <Select
              name="showvisualtest"
              value={formData.showvisualtest}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Show Electrical Safety Test on Certificate</label>
            <Select
              name="showelectricalsafety"
              value={formData.showelectricalsafety}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Show Basic Safety Test on Certificate</label>
            <Select
              name="showbasicsafety"
              value={formData.showbasicsafety}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Show Performance Test on Certificate</label>
            <Select
              name="showperformancetest"
              value={formData.showperformancetest}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h1 className="text-lg font-semibold">For Custom Formats Only</h1>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Setpoint</label>
            <Select
              name="setpoint"
              value={formData.setpoint}
              onChange={handleInputChange}
            >
              <option value="UUC">UUC</option>
              <option value="Master">Master</option>
              <option value="Separate">Separate</option>
            </Select>
          </div>
          <Input
            label="UUC Repeatable"
            name="uuc"
            type="number"
            value={formData.uuc}
            onChange={handleInputChange}
          />
          <Input
            label="Master Repeatable"
            name="master"
            type="number"
            value={formData.master}
            onChange={handleInputChange}
          />
          <Input
            label="Set Point Heading"
            name="setpointheading"
            value={formData.setpointheading}
            onChange={handleInputChange}
          />
          <Input
            label="Parameter Heading"
            name="parameterheading"
            value={formData.parameterheading}
            onChange={handleInputChange}
          />
          <Input
            label="UUC Heading"
            name="uucheading"
            value={formData.uucheading}
            onChange={handleInputChange}
          />
          <Input
            label="Master Heading"
            name="masterheading"
            value={formData.masterheading}
            onChange={handleInputChange}
          />
          <Input
            label="Error Heading"
            name="errorheading"
            value={formData.errorheading}
            onChange={handleInputChange}
          />
          <Input
            label="Remark Heading"
            name="remarkheading"
            value={formData.remarkheading}
            onChange={handleInputChange}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Setpoint To Show On Certificate</label>
            <Select
              name="setpointtoshow"
              value={formData.setpointtoshow}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Parameter To Show On Certificate</label>
            <Select
              name="parametertoshow"
              value={formData.parametertoshow}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">UUC To Show On Certificate</label>
            <Select
              name="uuctoshow"
              value={formData.uuctoshow}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Master To Show On Certificate</label>
            <Select
              name="mastertoshow"
              value={formData.mastertoshow}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Error To Show On Certificate</label>
            <Select
              name="errortoshow"
              value={formData.errortoshow}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Remark To Show On Certificate</label>
            <Select
              name="remarktoshow"
              value={formData.remarktoshow}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Specification To Show On Certificate</label>
            <Select
              name="specificationtoshow"
              value={formData.specificationtoshow}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>

          <div>
            <Input
              label="Temperature Range for Site"
              name="tempsite"
              type="number"
              value={formData.tempsite}
              onChange={handleInputChange}
              className={errors.tempsite ? "border-red-500 bg-red-50" : ""}
            />
            {errors.tempsite && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>    <Input
            label="Temperature Variable Site"
            name="tempvariablesite"
            type="number"
            value={formData.tempvariablesite}
            onChange={handleInputChange}
            className={errors.tempsite ? "border-red-500 bg-red-50" : ""}
          />
            {errors.tempsite && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}</div>

          <div>
            <Input
              label="Humidity Range for Site"
              name="humisite"
              type="number"
              value={formData.humisite}
              onChange={handleInputChange}
              className={errors.humisite ? "border-red-500 bg-red-50" : ""}
            />
            {errors.humisite && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>    <Input
            label="Humidity Variable Site"
            name="humivariablesite"
            type="number"
            value={formData.humivariablesite}
            onChange={handleInputChange}
            className={errors.tempsite ? "border-red-500 bg-red-50" : ""}
          />
            {errors.humisite && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <Input
              label="Temperature Range for Lab"
              name="templab"
              type="number"
              value={formData.templab}
              onChange={handleInputChange}
              className={errors.templab ? "border-red-500 bg-red-50" : ""}
            />
            {errors.templab && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>
          <div>

            <Input
              label="Temperature Variable Lab"
              type="number"
              name="tempvariablelab"
              value={formData.tempvariablelab}
              onChange={handleInputChange}
              className={errors.tempsite ? "border-red-500 bg-red-50" : ""}
            />
            {errors.templab && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>




          <div>
            <Input
              label="Humidity Range for Lab"
              name="humilab"
              type="number"
              value={formData.humilab}
              onChange={handleInputChange}
              className={errors.humilab ? "border-red-500 bg-red-50" : ""}
            />
            {errors.humilab && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div> <Input
            label="Humidity Variable Lab"
            name="humivariablelab"
            type="number"
            value={formData.humivariablelab}
            onChange={handleInputChange}
            className={errors.humilab ? "border-red-500 bg-red-50" : ""}
          />
            {errors.humilab && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>


          <Input
            label="Specification Heading"
            name="specificationheading"
            value={formData.specificationheading}
            onChange={handleInputChange}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Show Masters In Certificate</label>
            <Select
              name="mastersincertificate"
              value={formData.mastersincertificate}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Show Uncertainty In Certificate</label>
            <Select
              name="uncertaintyincertificate"
              value={formData.uncertaintyincertificate}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Lab to Calibrate</label>
            <ReactSelect
              name="allottolab"
              options={labOptions}
              value={labOptions.find((opt) => opt.value === formData.allottolab) || null}
              onChange={(selected) => handleSingleSelectChange(selected, "allottolab")}
              placeholder="Select Lab"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Format</label>
            <ReactSelect
              isMulti={false}
              name="suffix"
              options={formateOptions}
              value={formateOptions.find((opt) => opt.value === formData.suffix[0]) || null}
              onChange={(selected) => handleMultiSelectChange(selected ? [selected] : [], "suffix")}
              placeholder="Select Format"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Uncertainty Sheet</label>
            <ReactSelect
              isMulti
              name="uncertaintytable"
              options={formateOptions}
              value={formateOptions.filter((opt) => formData.uncertaintytable.includes(opt.value))}
              onChange={(selected) => handleMultiSelectChange(selected, "uncertaintytable")}
              placeholder="Select Uncertainty"
            />
          </div>

          {/* Price Lists and Matrices */}
          {priceLists.map((price, priceIndex) => (
            <div key={priceIndex} className="col-span-1 md:col-span-2 border border-gray-300 p-4 rounded bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Price List {priceIndex + 1}</h1>
                {priceLists.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removePriceList(priceIndex)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Remove Price List
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Input
                    label="Package Name"
                    name="packagename"
                    value={price.packagename}
                    onChange={(e) => handlePriceListChange(priceIndex, e)}
                    className={errors[`price_${priceIndex}_packagename`] ? "border-red-500 bg-red-50" : ""}
                  />
                  {errors[`price_${priceIndex}_packagename`] && (
                    <p className="text-red-600 text-sm mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <Input
                    label="Package Description"
                    name="packagedesc"
                    value={price.packagedesc}
                    onChange={(e) => handlePriceListChange(priceIndex, e)}
                    className={errors[`price_${priceIndex}_packagedesc`] ? "border-red-500 bg-red-50" : ""}
                  />
                  {errors[`price_${priceIndex}_packagedesc`] && (
                    <p className="text-red-600 text-sm mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Accreditation</label>
                  <Select
                    name="accreditation"
                    value={price.accreditation}
                    onChange={(e) => handlePriceListChange(priceIndex, e)}
                  >
                    {/* <option value="">Select</option> */}
                    <option value="Non Nabl">Non Nabl</option>
                    <option value="Nabl">Nabl</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Location</label>
                  <Select
                    name="location"
                    value={price.location}
                    onChange={(e) => handlePriceListChange(priceIndex, e)}
                  >
                    {/* <option value="">Select</option> */}
                    <option value="Site">Site</option>
                    <option value="Lab">Lab</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Select Currency</label>
                  <ReactSelect
                    name="currency"
                    value={price.currency}
                    options={currencyOptions}
                    onChange={(selected) => handlePriceCurrencyChange(selected, priceIndex)}
                    placeholder="Select Currency"
                  />
                </div>

                <div>
                  <Input
                    label="Rate"
                    name="rate"
                    value={price.rate}
                    type="number"
                    onChange={(e) => handlePriceListChange(priceIndex, e)}
                    className={errors[`price_${priceIndex}_rate`] ? "border-red-500 bg-red-50" : ""}
                  />
                  {errors[`price_${priceIndex}_rate`] && (
                    <p className="text-red-600 text-sm mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <Input
                    label="Days Required"
                    name="daysrequired"
                    type="number"
                    value={price.daysrequired}
                    onChange={(e) => handlePriceListChange(priceIndex, e)}
                    className={errors[`price_${priceIndex}_daysrequired`] ? "border-red-500 bg-red-50" : ""}
                  />
                  {errors[`price_${priceIndex}_daysrequired`] && (
                    <p className="text-red-600 text-sm mt-1">This field is required</p>
                  )}
                </div>
              </div>

              {/* Matrices */}
              <div className="mt-4">
                <h2 className="text-md font-semibold mb-2"></h2>

                {price.matrices.length === 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    No matrices added yet. Click below to add one.
                  </p>
                )}

                {price.matrices.map((matrix, matrixIndex) => (
                  <div
                    key={`matrix-${priceIndex}-${matrixIndex}`}
                    className="border border-gray-200 p-4 rounded mb-4 bg-white dark:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        Matrix {matrixIndex + 1}
                      </h3>
                      {price.matrices.length > 0 && (
                        <Button
                          type="button"
                          onClick={() => removeMatrix(priceIndex, matrixIndex)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove Matrix
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                          Unit Type/Parameter
                        </label>
                        <ReactSelect
                          name="unittype"
                          options={unitTypeOptions}
                          value={unitTypeOptions.find((opt) => opt.value === matrix.unittype) || null}
                          onChange={(selected) => handleMatrixChange(priceIndex, matrixIndex, { target: { name: 'unittype', value: selected?.value || '' } })}
                          placeholder="Select Unit Type"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                          Unit
                        </label>
                        <ReactSelect
                          name="unit"
                          options={unitOptions}
                          value={unitOptions.find((opt) => opt.value === matrix.unit) || null}
                          onChange={(selected) => handleMatrixChange(priceIndex, matrixIndex, { target: { name: 'unit', value: selected?.value || '' } })}
                          placeholder="Select Unit"
                        />
                      </div>

                      <Input
                        label="Instrument Range Min"
                        name="instrangemin"
                        type="number"
                        value={matrix.instrangemin}
                        onChange={(e) => handleMatrixChange(priceIndex, matrixIndex, e)}
                      />

                      <Input
                        label="Instrument Range Max"
                        name="instrangemax"
                        type="number"
                        value={matrix.instrangemax}
                        onChange={(e) => handleMatrixChange(priceIndex, matrixIndex, e)}
                      />


                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                          Mode
                        </label>
                        <ReactSelect
                          name="mode"
                          options={[{ label: "Not Specified", value: "" }, ...modeOptions]}
                          value={[{ label: "Not Specified", value: "" }, ...modeOptions].find((opt) => opt.value === matrix.mode) || null}
                          onChange={(selected) => handleMatrixChange(priceIndex, matrixIndex, { target: { name: 'mode', value: selected?.value || '' } })}
                          placeholder="Select Mode"
                        />
                      </div>

                      <Input
                        label="Tolerance (±)"
                        name="tolerance"
                        value={matrix.tolerance}
                        type="number"
                        onChange={(e) => handleMatrixChange(priceIndex, matrixIndex, e)}
                      />

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                          Tolerance Type
                        </label>
                        <ReactSelect
                          name="tolerancetype"
                          options={[
                            { label: "Not Specified", value: "" },
                            { label: "Fixed", value: "Fixed" },
                            { label: "%", value: "%" }
                          ]}
                          value={[
                            { label: "Not Specified", value: "" },
                            { label: "Fixed", value: "Fixed" },
                            { label: "%", value: "%" }
                          ].find((opt) => opt.value === matrix.tolerancetype) || null}
                          onChange={(selected) => handleMatrixChange(priceIndex, matrixIndex, { target: { name: 'tolerancetype', value: selected?.value || '' } })}
                          placeholder="Select Tolerance Type"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => addMatrix(priceIndex)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  + Add Matrix
                </Button>
              </div>
            </div>
          ))}

          <div className="col-span-1 md:col-span-2">
            <Button
              type="button"
              onClick={addPriceList}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              + Add Price List
            </Button>
          </div>

          <div className="col-span-1 md:col-span-2">
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
          </div>
        </form>
      </div>
    </Page>
  );
}