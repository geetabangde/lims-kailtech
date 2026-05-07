import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Button, Input, ReactSelect } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function AddSubcategory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    type: "",
    instrumenttype: "",
    name: "",
    hsn: "",
    critical: "0", // default no
    unit: "",
    expiry: "",
    reorder: "",
    min: "",
    tax: "",
    cost: "",
  });

  // Error and touched states
  const [errors, setErrors] = useState({
    category: "",
    type: "",
    name: "",
    unit: "",
    reorder: "",
    min: "",
    tax: "",
    cost: "",
  });

  const [touched, setTouched] = useState({
    category: false,
    type: false,
    name: false,
    unit: false,
    reorder: false,
    min: false,
    tax: false,
    cost: false,
  });

  // dropdowns
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [instrumentTypes, setInstrumentTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxSlabs, setTaxSlabs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cat, typ, inst, unit, tax] = await Promise.all([
          axios.get("/inventory/category-list"),
          axios.get("/get-type"),
          axios.get("/get-instrument-type"),
          axios.get("/master/units-list"),
          axios.get("/master/get-taxslab-list"),
        ]);
      
        setCategories(cat.data.data || []);
        setTypes(typ.data.data || []);
        setInstrumentTypes(inst.data.data || []);
        setUnits(unit.data.data || []);
        setTaxSlabs(tax.data.data || []);
        
      } catch (err) {
        toast.error("Error loading dropdown data");
        console.error("Dropdown Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const categoryOptions = useMemo(() => categories.map(c => ({ value: c.id, label: c.name })), [categories]);
  const typeOptions = useMemo(() => types.map(t => ({ value: t.id, label: t.name })), [types]);
  const instrumentTypeOptions = useMemo(() => instrumentTypes.map(i => ({ value: i.id, label: i.name })), [instrumentTypes]);
  const unitOptions = useMemo(() => units.map(u => ({ value: u.id, label: u.name })), [units]);
  const taxOptions = useMemo(() => taxSlabs.map(t => ({ value: t.id, label: t.name })), [taxSlabs]);
  const criticalOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Clear error when user makes selection
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Immediate validation for select fields
    validateField(name, value);
  };

  // Handle field blur to show validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let error = "";
    
    // Check if field is required
    const requiredFields = ['category', 'type', 'name', 'unit', 'reorder', 'min', 'tax', 'cost'];
    
    if (requiredFields.includes(fieldName)) {
      if (!value || value.toString().trim() === "") {
        error = "This field is required";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error === "";
  };

  // Validate all required fields
  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    const requiredFields = [
      { field: 'category', label: 'Category' },
      { field: 'type', label: 'Type' },
      { field: 'name', label: 'Name' },
      { field: 'unit', label: 'Unit of measurement' },
      { field: 'reorder', label: 'Reorder Alert Level' },
      { field: 'min', label: 'Minimum Quantity Buffer' },
      { field: 'tax', label: 'Tax Slab' },
      { field: 'cost', label: 'Cost' },
    ];

    requiredFields.forEach(({ field }) => {
      newTouched[field] = true;
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value),
      );

      await axios.post("/inventory/subcategory-create", form);

      toast.success("Subcategory created successfully ✅", {
        duration: 1000,
        icon: "✅",
      });

      navigate("/dashboards/inventory/subcategories");
    } catch (err) {
      console.error("Error creating subcategory:", err);
      toast.error(err?.response?.data?.message || "Failed to create ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Subcategory">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Subcategory</h2>
          <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate("/dashboards/inventory/subcategories")}
          >
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <ReactSelect
              label="Category"
              name="category"
              options={categoryOptions}
              value={formData.category}
              onChange={(val) => handleSelectChange(val, "category")}
              error={touched.category ? errors.category : ""}
              placeholder="Select Category"
              isSearchable
            />
          </div>

          <div>
            <ReactSelect
              label="Type"
              name="type"
              options={typeOptions}
              value={formData.type}
              onChange={(val) => handleSelectChange(val, "type")}
              error={touched.type ? errors.type : ""}
              placeholder="Select Type"
              isSearchable
            />
          </div>

          <div>
            <ReactSelect
              label="Instrument Type"
              name="instrumenttype"
              options={instrumentTypeOptions}
              value={formData.instrumenttype}
              onChange={(val) => handleSelectChange(val, "instrumenttype")}
              placeholder="Select Instrument Type"
              isSearchable
            />
          </div>

          <div>
            <Input
              label="Subcategory Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? "border-red-500" : ""}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="HSN"
              name="hsn"
              value={formData.hsn}
              onChange={handleChange}
            />
          </div>

          <div>
            <ReactSelect
              label="Critical"
              name="critical"
              options={criticalOptions}
              value={formData.critical}
              onChange={(val) => handleSelectChange(val, "critical")}
              placeholder="Critical"
              isSearchable
            />
          </div>

          <div>
            <ReactSelect
              label="Unit of measurement"
              name="unit"
              options={unitOptions}
              value={formData.unit}
              onChange={(val) => handleSelectChange(val, "unit")}
              error={touched.unit ? errors.unit : ""}
              placeholder="Select Unit"
              isSearchable
            />
          </div>

          <div>
            <Input
              label="Expiry"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
            />
          </div>

          <div>
            <Input
              label="Reorder Alert Level"
              name="reorder"
              value={formData.reorder}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.reorder && touched.reorder ? "border-red-500" : ""}
            />
            {errors.reorder && touched.reorder && (
              <p className="text-red-500 text-sm mt-1">{errors.reorder}</p>
            )}
          </div>

          <div>
            <Input
              label="Minimum Quantity Buffer"
              name="min"
              value={formData.min}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.min && touched.min ? "border-red-500" : ""}
            />
            {errors.min && touched.min && (
              <p className="text-red-500 text-sm mt-1">{errors.min}</p>
            )}
          </div>

          <div>
            <ReactSelect
              label="Tax Slab"
              name="tax"
              options={taxOptions}
              value={formData.tax}
              onChange={(val) => handleSelectChange(val, "tax")}
              error={touched.tax ? errors.tax : ""}
              placeholder="Select Tax"
              isSearchable
            />
          </div>

          <div>
            <Input
              label="Cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.cost && touched.cost ? "border-red-500" : ""}
            />
            {errors.cost && touched.cost && (
              <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
            )}
          </div>

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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                  />
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