import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import Select from "react-select";

export default function EditTestParameter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mintemp: "",
    maxtemp: "",
    minhumidity: "",
    maxhumidity: "",
    time: "",
    mindurationdays: "",
    mindurationhours: "",
    maxdurationdays: "",
    maxdurationhours: "",
    reminderdays: "",
    reminderhours: "",
    department: "",
    nabl: "",
    products: [],
    instruments: [],
    measurements: [],
    results: [],
    cycle: "",
    visible: "",
    resultype: "",
    resultunit: "",
    decimal: "",
    minnabl: "",
    maxnabl: "",
    minqai: "",
    maxqai: "",
    remark: "",
    formula: "",
  });

  const [parameterElements, setParameterElements] = useState([]);
  const [parameterConsumables, setParameterConsumables] = useState([]);
  const [showElementModal, setShowElementModal] = useState(false);
  const [showConsumableModal, setShowConsumableModal] = useState(false);

  const [newElement, setNewElement] = useState({ element: "", priority: "" });
  const [newConsumable, setNewConsumable] = useState({
    consumable: "",
    quantity: "",
    priority: "",
  });

  // Dropdown data states
  const [dropdowns, setDropdowns] = useState({
    products: [],
    instruments: [],
    measurements: [],
    results: [],
    resultTypes: [],
    labs: [],
    units: [],
    consumables: [],
    choices: [
      { id: 1, name: "Yes" },
      { id: 2, name: "No" },
    ],
  });

  // Helper function to parse string IDs to arrays
  const parseStringToArray = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str.map(item => parseInt(item)).filter(item => !isNaN(item));

    // Handle comma-separated string
    if (typeof str === 'string') {
      return str.split(',').map(item => {
        const num = parseInt(item.trim());
        return isNaN(num) ? null : num;
      }).filter(item => item !== null);
    }

    return [];
  };

  const fetchLinkedData = useCallback(async () => {
    if (!id) return;

    // Fetch Elements
    try {
      const elementsRes = await axios.get(`/testing/get-perameter-list/${id}`);
      const processApiResponse = (resData) => {
        if (!resData) return [];
        if (Array.isArray(resData)) return resData;
        if (resData.data && Array.isArray(resData.data)) return resData.data;
        if (resData.data && typeof resData.data === 'object' && resData.data !== null) {
          return Object.values(resData.data);
        }
        const firstArray = Object.values(resData).find(v => Array.isArray(v));
        if (firstArray) return firstArray;
        return [];
      };
      setParameterElements(processApiResponse(elementsRes.data));
    } catch (err) {
      console.error("Error fetching elements:", err);
    }

    // Fetch Consumables
    try {
      const consumablesRes = await axios.get(`/testing/get-counsumable-list/` + id);
      console.log("Consumables API Response:", consumablesRes.data);

      let consumablesData = [];
      if (consumablesRes.data) {
        if (Array.isArray(consumablesRes.data.data)) {
          consumablesData = consumablesRes.data.data;
        } else if (Array.isArray(consumablesRes.data)) {
          consumablesData = consumablesRes.data;
        } else if (typeof consumablesRes.data === 'object') {
          // Try to find any array inside the object
          const firstArray = Object.values(consumablesRes.data).find(v => Array.isArray(v));
          if (firstArray) consumablesData = firstArray;
        }
      }

      setParameterConsumables(consumablesData);
    } catch (err) {
      console.error("Error fetching consumables:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLinkedData();
    }
  }, [id, fetchLinkedData]);

  const fetchMainData = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`/testing/get-perameter-byid`, {
        params: { id: id }
      });

      const result = response.data;

      if (result.status === true || result.status === "true") {
        const data = result.data;
        setFormData({
          name: data.name || "",
          description: data.description || "",
          mintemp: data.mintemp?.toString() || "",
          maxtemp: data.maxtemp?.toString() || "",
          minhumidity: data.minhumidity?.toString() || "",
          maxhumidity: data.maxhumidity?.toString() || "",
          time: data.time?.toString() || "",
          mindurationdays: data.mindurationdays?.toString() || "",
          mindurationhours: data.mindurationhours?.toString() || "",
          maxdurationdays: data.maxdurationdays?.toString() || "",
          maxdurationhours: data.maxdurationhours?.toString() || "",
          reminderdays: data.reminderdays?.toString() || "",
          reminderhours: data.reminderhours?.toString() || "",
          department: data.department?.toString() || "",
          nabl: data.nabl?.toString() || "",
          products: parseStringToArray(data.products),
          instruments: parseStringToArray(data.instruments),
          measurements: parseStringToArray(data.measurements),
          results: parseStringToArray(data.results),
          cycle: data.cycle?.toString() || "",
          visible: data.visible?.toString() || "",
          resultype: data.resultype?.toString() || "",
          resultunit: data.resultunit?.toString() || "",
          decimal: data.decimal?.toString() || "",
          minnabl: data.minnabl?.toString() || "",
          maxnabl: data.maxnabl?.toString() || "",
          minqai: data.minqai?.toString() || "",
          maxqai: data.maxqai?.toString() || "",
          remark: data.remark || "",
          formula: data.formula || "",
        });

        // Set nested data if available in main response
        if (data.parameter_elements) setParameterElements(data.parameter_elements);

        // Always try fetching linked data specifically to be sure
        fetchLinkedData();
      }
    } catch (err) {
      console.error("Error fetching parameter data:", err);
    } finally {
      setFetchLoading(false);
    }
  }, [id, fetchLinkedData]);

  // Fetch dropdown data and existing parameter data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setFetchLoading(true);

        // Fetch dropdown data
        const [
          productsRes,
          instrumentsRes,
          measurementsRes,
          resultsRes,
          resultTypesRes,
          labsRes,
          unitsRes,
          consumablesRes,
        ] = await Promise.all([
          axios.get("/testing/get-prodcut-list"),
          axios.get("/testing/get-instrument-categories"),
          axios.get("/testing/get-measurement"),
          axios.get("/testing/get-measurement-result"),
          axios.get("/testing/get-resulttypes"),
          axios.get("/master/list-lab"),
          axios.get("/master/units-list"),
          axios.get("/testing/get-counsumable-category"),
        ]);

        // Set dropdowns
        setDropdowns({
          products: productsRes.data?.data || [],
          instruments: instrumentsRes.data?.data || [],
          measurements: measurementsRes.data?.data || [],
          results: resultsRes.data?.data || [],
          resultTypes: resultTypesRes.data?.data || [],
          labs: labsRes.data?.data || [],
          units: unitsRes.data?.data || [],
          consumables: consumablesRes.data?.data || [],
          choices: [
            { id: 1, name: "Yes" },
            { id: 2, name: "No" },
          ],
        });

        // Fetch existing parameter data
        if (id) {
          await fetchMainData();
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load initial data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAllData();
  }, [id, fetchMainData]);

  const handleAddElement = async () => {
    if (!newElement.element || !newElement.priority) {
      toast.error("Please fill all fields for measurement element");
      return;
    }
    try {
      setSubmitLoading(true);

      const payload = {
        parameter: Number(id),
        element: Number(newElement.element),
        priority: Number(newElement.priority),
      };

      const res = await axios.post("/testing/add-perameter-element", payload);

      if (res.status === 200 || res.status === 201 || res.data?.status === true || res.data?.status === "true" || res.data?.success === true) {
        toast.success(res.data?.message || "Measurement element added successfully");
        setShowElementModal(false);
        setNewElement({ element: "", priority: "" });
        fetchLinkedData();
      } else {
        toast.error(res.data?.message || "Failed to add element");
      }
    } catch (err) {
      console.error("Error adding element:", err);
      toast.error(err?.response?.data?.message || "Error adding element");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRemoveElement = async (eid) => {
    if (!window.confirm("Are you sure you want to remove this measurement?")) return;
    try {
      setSubmitLoading(true);
      const res = await axios.delete(`/testing/delete-perameter-element/${eid}`);
      if (res.status === 200 || res.status === 201 || res.data?.status === true || res.data?.status === "true" || res.data?.success === true) {
        toast.success(res.data?.message || "Measurement element removed successfully");
        fetchLinkedData();
      } else {
        toast.error(res.data?.message || "Failed to remove measurement element");
      }
    } catch (err) {
      console.error("Error removing element:", err);
      toast.error(err?.response?.data?.message || "Error removing element");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddConsumable = async () => {
    if (!newConsumable.consumable || !newConsumable.quantity || !newConsumable.priority) {
      toast.error("Please fill all fields for consumable");
      return;
    }
    try {
      setSubmitLoading(true);

      const payload = {
        parameter: Number(id),
        consumable: Number(newConsumable.consumable),
        quantity: Number(newConsumable.quantity),
        priority: Number(newConsumable.priority),
      };

      const res = await axios.post("/testing/add-counsumable", payload);

      if (res.status === 200 || res.status === 201 || res.data?.status === true || res.data?.status === "true") {
        toast.success(res.data?.message || "Consumable added successfully");
        setShowConsumableModal(false);
        setNewConsumable({ consumable: "", quantity: "", priority: "" });
        fetchLinkedData();
      } else {
        toast.error(res.data?.message || "Failed to add consumable");
      }
    } catch (err) {
      console.error("Error adding consumable:", err);
      toast.error(err?.response?.data?.message || "Error adding consumable");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRemoveConsumable = async (cid) => {
    if (!window.confirm("Are you sure you want to remove this consumable?")) return;
    try {
      setSubmitLoading(true);
      const res = await axios.delete(`/testing/delete-counsumable/${cid}`);
      if (res.status === 200 || res.status === 201 || res.data?.status === true || res.data?.status === "true") {
        toast.success(res.data?.message || "Consumable removed");
        fetchLinkedData();
      } else {
        toast.error(res.data?.message || "Failed to remove consumable");
      }
    } catch (err) {
      console.error("Error removing consumable:", err);
      toast.error(err?.response?.data?.message || "Error removing consumable");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handler for react-select multi-select
  const handleReactSelectChange = (selectedOptions, fieldName) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map(option => option.value)
      : [];

    console.log(`${fieldName} selected:`, selectedValues);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: selectedValues,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Parameter name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.department) newErrors.department = "Lab is required";
    if (!formData.nabl) newErrors.nabl = "NABL selection is required";
    if (!formData.visible) newErrors.visible = "Visible selection is required";
    if (!formData.resultype) newErrors.resultype = "Result type is required";
    if (!formData.resultunit) newErrors.resultunit = "Result unit is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitLoading(true);

    try {
      const payload = {
        id: parseInt(id),
        name: formData.name,
        description: formData.description,
        mintemp: formData.mintemp ? Number(formData.mintemp) : 0,
        maxtemp: formData.maxtemp ? Number(formData.maxtemp) : 0,
        minhumidity: formData.minhumidity ? Number(formData.minhumidity) : 0,
        maxhumidity: formData.maxhumidity ? Number(formData.maxhumidity) : 0,
        time: formData.time ? Number(formData.time) : 0,
        mindurationdays: formData.mindurationdays ? Number(formData.mindurationdays) : 0,
        mindurationhours: formData.mindurationhours ? Number(formData.mindurationhours) : 0,
        maxdurationdays: formData.maxdurationdays ? Number(formData.maxdurationdays) : 0,
        maxdurationhours: formData.maxdurationhours ? Number(formData.maxdurationhours) : 0,
        reminderdays: formData.reminderdays ? Number(formData.reminderdays) : 0,
        reminderhours: formData.reminderhours ? Number(formData.reminderhours) : 0,
        department: Number(formData.department),
        nabl: Number(formData.nabl),
        products: formData.products,
        instruments: formData.instruments,
        measurements: formData.measurements,
        results: formData.results,
        cycle: formData.cycle ? Number(formData.cycle) : 0,
        visible: Number(formData.visible),
        resultype: Number(formData.resultype),
        resultunit: Number(formData.resultunit),
        decimal: formData.decimal ? Number(formData.decimal) : 0,
        minnabl: formData.minnabl ? Number(formData.minnabl) : 0,
        maxnabl: formData.maxnabl ? Number(formData.maxnabl) : 0,
        minqai: formData.minqai ? Number(formData.minqai) : 0,
        maxqai: formData.maxqai ? Number(formData.maxqai) : 0,
        remark: formData.remark,
        formula: formData.formula,
      };

      console.log("Update Payload:", payload);

      const res = await axios.post("/testing/update-perameter", payload);

      console.log("Update Response:", res.data);

      if (res.data?.status === true || res.data?.status === "true") {
        toast.success("Test parameter updated successfully ✅", {
          duration: 1000,
        });
        setTimeout(() => {
          navigate("/dashboards/testing/test-parameters");
        }, 1000);
      } else {
        toast.error(res.data?.message || "Failed to update test parameter ❌");
      }
    } catch (err) {
      console.error("Update Parameter Error:", err);
      toast.error(
        err?.response?.data?.message || "Something went wrong while updating parameter"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Convert dropdown data to react-select format
  const getSelectOptions = (items, type = "") => {
    if (!items || !Array.isArray(items)) return [];

    return items.map(item => {
      let label = item.name || item.label || `Item ${item.id}`;
      // Add SKU to label for consumables
      if (type === "consumable" && item.sku) {
        label = `${item.name} (${item.sku})`;
      }
      return {
        value: item.id,
        label: label
      };
    });
  };

  const getProductOptions = () => dropdowns.products.map(item => ({
    value: item.id,
    label: `${item.name}(${item.description || ""})`
  }));

  const getResultOptions = () => dropdowns.results.map(item => ({
    value: item.id,
    label: `${item.name} in ${item.unit_name || ""} (VR${item.id}) in ${item.unit_name || ""} (${item.description || ""})`
  }));

  const getElementOptions = () => dropdowns.measurements.map(item => ({
    value: item.id,
    label: `${item.name}-${item.description || ""}(VC${item.id})`
  }));
  // Get selected values for react-select
  const getSelectedOptions = (selectedIds, options) => {
    if (!selectedIds || !options) return [];

    // If it's an array (multi-select)
    if (Array.isArray(selectedIds)) {
      const selectedIdsNumbers = selectedIds.map(id => parseInt(id));
      return options.filter(option => selectedIdsNumbers.includes(option.value));
    }

    // If it's a single value (single-select)
    return options.filter(option => option.value === parseInt(selectedIds));
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderColor: state.isFocused
        ? '#3b82f6'
        : 'rgb(209 213 219)',
      boxShadow: state.isFocused ? '0 0 0 2px rgb(59 130 246 / 0.5)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
      },
      backgroundColor: 'white',
      borderRadius: '0.5rem',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#dbeafe',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1e40af',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#3b82f6',
      '&:hover': {
        backgroundColor: '#3b82f6',
        color: 'white',
      },
    }),
  };

  if (fetchLoading) {
    return (
      <Page title="Edit Test Parameter">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-300">Loading form data...</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Edit Test Parameter">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Test Parameter - ID: {id}
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/testing/test-parameters")}
          >
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Parameter Name"
                name="name"
                placeholder="Enter parameter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Input
                label="Description/Symbol"
                name="description"
                placeholder="Enter symbol"
                value={formData.description}
                onChange={handleChange}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Temperature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Min Temperature Required (°C)"
                name="mintemp"
                type="number"
                step="0.1"
                placeholder="Min temperature"
                value={formData.mintemp}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Max Temperature Required (°C)"
                name="maxtemp"
                type="number"
                step="0.1"
                placeholder="Max temperature"
                value={formData.maxtemp}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Humidity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Min Humidity Required (%)"
                name="minhumidity"
                type="number"
                placeholder="Min humidity"
                value={formData.minhumidity}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Max Humidity Required (%)"
                name="maxhumidity"
                type="number"
                placeholder="Max humidity"
                value={formData.maxhumidity}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Time Required */}
          <div>
            <Input
              label="Time Required (days)"
              name="time"
              type="number"
              placeholder="Time required in days"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          {/* Min Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Min Duration (Days)"
                name="mindurationdays"
                type="number"
                placeholder="Minimum duration in days"
                value={formData.mindurationdays}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Min Duration (Hours)"
                name="mindurationhours"
                type="number"
                max="24"
                placeholder="Minimum duration in hours"
                value={formData.mindurationhours}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Max Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Max Duration (Days)"
                name="maxdurationdays"
                type="number"
                placeholder="Maximum duration in days"
                value={formData.maxdurationdays}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Max Duration (Hours)"
                name="maxdurationhours"
                type="number"
                max="24"
                placeholder="Maximum duration in hours"
                value={formData.maxdurationhours}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Reminder Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Reminder Duration (Days)"
                name="reminderdays"
                type="number"
                placeholder="Reminder duration in days"
                value={formData.reminderdays}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Reminder Duration (Hours)"
                name="reminderhours"
                type="number"
                max="24"
                placeholder="Reminder duration in hours"
                value={formData.reminderhours}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Select Lab */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Lab <span className="text-red-500">*</span>
            </label>
            <Select
              name="department"
              options={getSelectOptions(dropdowns.labs)}
              value={getSelectedOptions(Number(formData.department), getSelectOptions(dropdowns.labs))[0] || null}
              onChange={(selected) => {
                setFormData(prev => ({ ...prev, department: selected ? selected.value.toString() : "" }));
                if (errors.department) setErrors(prev => ({ ...prev, department: "" }));
              }}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Search and select lab..."
              isSearchable
              isClearable
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department}</p>
            )}
          </div>

          {/* Covered Under NABL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Covered Under NABL? <span className="text-red-500">*</span>
            </label>
            <select
              name="nabl"
              value={formData.nabl}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {dropdowns.choices.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.name}
                </option>
              ))}
            </select>
            {errors.nabl && <p className="text-red-500 text-sm mt-1">{errors.nabl}</p>}
          </div>

          {/* Applicable Products */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Applicable Products
            </label>
            <Select
              isMulti
              name="products"
              options={getProductOptions()}
              value={getSelectedOptions(formData.products, getProductOptions())}
              onChange={(selected) => handleReactSelectChange(selected, 'products')}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select products..."
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formData.products.length} product(s)
            </p>
          </div>

          {/* Applicable Instruments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Applicable Instruments
            </label>
            <Select
              isMulti
              name="instruments"
              options={getSelectOptions(dropdowns.instruments)}
              value={getSelectedOptions(formData.instruments, getSelectOptions(dropdowns.instruments))}
              onChange={(selected) => handleReactSelectChange(selected, 'instruments')}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select instruments..."
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formData.instruments.length} instrument(s)
            </p>
          </div>

          {/* Variables (Not used in Calculation) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Variables (Not used in Calculation)
            </label>
            <Select
              isMulti
              name="measurements"
              options={getSelectOptions(dropdowns.measurements)}
              value={getSelectedOptions(formData.measurements, getSelectOptions(dropdowns.measurements))}
              onChange={(selected) => handleReactSelectChange(selected, 'measurements')}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select measurements..."
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formData.measurements.length} measurement(s)
            </p>
          </div>

          {/* Measurement Results */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Measurement Results
            </label>
            <Select
              isMulti
              name="results"
              options={getResultOptions()}
              value={getSelectedOptions(formData.results, getResultOptions())}
              onChange={(selected) => handleReactSelectChange(selected, 'results')}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select results..."
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formData.results.length} result(s)
            </p>
          </div>

          {/* Measurements Table (Dynamic) */}
          <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">Measurements</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowElementModal(true)}
              >
                + Add New Measurement
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-700">
                    <th className="px-4 py-2 border dark:border-dark-600">Element</th>
                    <th className="px-4 py-2 border dark:border-dark-600">Priority</th>
                    <th className="px-4 py-2 border dark:border-dark-600">Code</th>
                    <th className="px-4 py-2 border dark:border-dark-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {parameterElements.length > 0 ? (
                    parameterElements.map((el) => (
                      <tr key={el.id}>
                        <td className="px-4 py-2 border dark:border-dark-600">{el.measurement_name || el.name}</td>
                        <td className="px-4 py-2 border dark:border-dark-600">{el.priority}</td>
                        <td className="px-4 py-2 border dark:border-dark-600">VC{el.element}</td>
                        <td className="px-4 py-2 border dark:border-dark-600">
                          <button
                            type="button"
                            onClick={() => handleRemoveElement(el.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-gray-500 italic">
                        No measurements added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consumables Table (Dynamic) */}
          <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">Consumables</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowConsumableModal(true)}
              >
                + Add Consumable
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-700">
                    <th className="px-4 py-2 border dark:border-dark-600">Consumable</th>
                    <th className="px-4 py-2 border dark:border-dark-600">Quantity(in Unit)</th>
                    <th className="px-4 py-2 border dark:border-dark-600">Priority</th>
                    <th className="px-4 py-2 border dark:border-dark-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {parameterConsumables.length > 0 ? (
                    parameterConsumables.map((con) => (
                      <tr key={con.id}>
                        <td className="px-4 py-2 border dark:border-dark-600">{con.consumable_name}</td>
                        <td className="px-4 py-2 border dark:border-dark-600">
                          {con.quantity} {con.unit_description}
                        </td>
                        <td className="px-4 py-2 border dark:border-dark-600">{con.priority}</td>
                        <td className="px-4 py-2 border dark:border-dark-600">
                          <button
                            type="button"
                            onClick={() => handleRemoveConsumable(con.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-gray-500 italic">
                        No consumables added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculation Formula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calculation Formula
            </label>
            <textarea
              name="formula"
              value={formData.formula}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter calculation formula"
            />
          </div>

          {/* No. of Cycles */}
          <div>
            <Input
              label="No. of Cycles"
              name="cycle"
              type="number"
              placeholder="Number of cycles"
              value={formData.cycle}
              onChange={handleChange}
            />
          </div>

          {/* Visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Visible <span className="text-red-500">*</span>
            </label>
            <select
              name="visible"
              value={formData.visible}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {dropdowns.choices.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.name}
                </option>
              ))}
            </select>
            {errors.visible && <p className="text-red-500 text-sm mt-1">{errors.visible}</p>}
          </div>

          {/* Type of Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type of Result <span className="text-red-500">*</span>
            </label>
            <Select
              name="resultype"
              options={getSelectOptions(dropdowns.resultTypes)}
              value={getSelectedOptions(Number(formData.resultype), getSelectOptions(dropdowns.resultTypes))[0] || null}
              onChange={(selected) => {
                setFormData(prev => ({ ...prev, resultype: selected ? selected.value.toString() : "" }));
                if (errors.resultype) setErrors(prev => ({ ...prev, resultype: "" }));
              }}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Search and select result type..."
              isSearchable
              isClearable
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            {errors.resultype && (
              <p className="text-red-500 text-sm mt-1">{errors.resultype}</p>
            )}
          </div>

          {/* Unit of Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unit of Result <span className="text-red-500">*</span>
            </label>
            <Select
              name="resultunit"
              options={getSelectOptions(dropdowns.units)}
              value={getSelectedOptions(Number(formData.resultunit), getSelectOptions(dropdowns.units))[0] || null}
              onChange={(selected) => {
                setFormData(prev => ({ ...prev, resultunit: selected ? selected.value.toString() : "" }));
                if (errors.resultunit) setErrors(prev => ({ ...prev, resultunit: "" }));
              }}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Search and select result unit..."
              isSearchable
              isClearable
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            {errors.resultunit && (
              <p className="text-red-500 text-sm mt-1">{errors.resultunit}</p>
            )}
          </div>

          {/* No. of Decimal Points */}
          <div>
            <Input
              label="No. of Decimal Points"
              name="decimal"
              type="number"
              placeholder="Digits after decimal"
              value={formData.decimal}
              onChange={handleChange}
            />
          </div>

          {/* NABL Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Min NABL Range"
                name="minnabl"
                type="number"
                step="0.01"
                placeholder="Min NABL range"
                value={formData.minnabl}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Max NABL Range"
                name="maxnabl"
                type="number"
                step="0.01"
                placeholder="Max NABL range"
                value={formData.maxnabl}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* QAI Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Min QAI Range"
                name="minqai"
                type="number"
                step="0.01"
                placeholder="Min QAI range"
                value={formData.minqai}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Max QAI Range"
                name="maxqai"
                type="number"
                step="0.01"
                placeholder="Max QAI range"
                value={formData.maxqai}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Remark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Remark
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter remarks"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboards/testing/test-parameters")}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={submitLoading}>
              {submitLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Updating...
                </div>
              ) : (
                "Update Parameter"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Measurement Element Modal */}
      {showElementModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add New Element</h3>
              <button onClick={() => setShowElementModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Measurement Element
                </label>
                <Select
                  name="element"
                  options={getElementOptions()}
                  value={getSelectedOptions(Number(newElement.element), getElementOptions())[0] || null}
                  onChange={(selected) => setNewElement({ ...newElement, element: selected ? selected.value.toString() : "" })}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Search and select element..."
                  isSearchable
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
              <Input
                label="Priority"
                value={newElement.priority}
                onChange={(e) => setNewElement({ ...newElement, priority: e.target.value })}
                placeholder="Enter priority number"
                type="number"
              />
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowElementModal(false)}>
                  Cancel
                </Button>
                <Button color="primary" className="flex-1" onClick={handleAddElement} disabled={submitLoading}>
                  Add Element
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consumable Modal */}
      {showConsumableModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Consumable</h3>
              <button onClick={() => setShowConsumableModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Consumable
                </label>
                <Select
                  name="consumable"
                  options={getSelectOptions(dropdowns.consumables, "consumable")}
                  value={getSelectedOptions(Number(newConsumable.consumable), getSelectOptions(dropdowns.consumables, "consumable"))[0] || null}
                  onChange={(selected) => setNewConsumable({ ...newConsumable, consumable: selected ? selected.value.toString() : "" })}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Search and select consumable..."
                  isSearchable
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Quantity"
                    value={newConsumable.quantity}
                    onChange={(e) => setNewConsumable({ ...newConsumable, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    type="number"
                  />
                </div>
                {newConsumable.consumable && (
                  <div className="text-sm font-medium text-gray-500 mb-2 pb-1 pr-1">
                    {(() => {
                      const selectedConsumable = dropdowns.consumables.find(c => c.id === Number(newConsumable.consumable));
                      const unit = dropdowns.units.find(u => u.id === selectedConsumable?.unit);
                      return unit ? unit.name : "";
                    })()}
                  </div>
                )}
              </div>
              <Input
                label="Priority"
                value={newConsumable.priority}
                onChange={(e) => setNewConsumable({ ...newConsumable, priority: e.target.value })}
                placeholder="Enter priority number"
                type="number"
              />
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowConsumableModal(false)}>
                  Cancel
                </Button>
                <Button color="primary" className="flex-1" onClick={handleAddConsumable} disabled={submitLoading}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}