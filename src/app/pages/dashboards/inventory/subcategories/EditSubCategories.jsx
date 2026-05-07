import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { Button, Input, ReactSelect } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditSubcategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    type: "",
    instrumenttype: "",
    name: "",
    hsn: "",
    critical: "0",
    unit: "",
    expiry: "",
    reorder: "",
    min: "",
    tax: "",
    cost: "",
  });

  // Error and touched states for required fields
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

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [instrumentTypes, setInstrumentTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxSlabs, setTaxSlabs] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

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

        const response = await axios.get(`/inventory/subcategory-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          setFormData({
            category: result.data.category?.toString() || "",
            type: result.data.type?.toString() || "",
            instrumenttype: result.data.instrumenttype?.toString() || "",
            name: result.data.name || "",
            hsn: result.data.hsn || "",
            critical: result.data.critical?.toString() || "0",
            unit: result.data.unit?.toString() || "",
            expiry: result.data.expiry?.toString() || "",
            reorder: result.data.reorder?.toString() || "",
            min: result.data.min?.toString() || "",
            tax: result.data.tax?.toString() || "",
            cost: result.data.cost?.toString() || "",
          });
        } else {
          toast.error(result.message || "Failed to load subcategory data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const catOptions = useMemo(() => categories.map(c => ({ value: c.id.toString(), label: c.name })), [categories]);
  const typeOptions = useMemo(() => types.map(t => ({ value: t.id.toString(), label: t.name })), [types]);
  const instOptions = useMemo(() => instrumentTypes.map(i => ({ value: i.id.toString(), label: i.name })), [instrumentTypes]);
  const uOptions = useMemo(() => units.map(u => ({ value: u.id.toString(), label: u.name })), [units]);
  const tOptions = useMemo(() => taxSlabs.map(t => ({ value: t.id.toString(), label: t.name })), [taxSlabs]);
  const criticalOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      { field: 'unit', label: 'Unit' },
      { field: 'reorder', label: 'Reorder Level' },
      { field: 'min', label: 'Min Level' },
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          form.append(key, value);
        }
      });

      const response = await axios.post(
        `/inventory/subcategory-update/${id}`,
        form,
      );
      const result = response.data;

      if (result.status === "true") {
        toast.success("Subcategory updated successfully ✅");
        navigate("/dashboards/inventory/subcategories");
      } else {
        toast.error(result.message || "Update failed ❌");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Error during update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Subcategory">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Subcategory</h2>
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
              label="Category"
              name="category"
              options={catOptions}
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
              options={instOptions}
              value={formData.instrumenttype}
              onChange={(val) => handleSelectChange(val, "instrumenttype")}
              placeholder="Select Instrument Type"
              isSearchable
            />
          </div>

          <div>
            <ReactSelect
              label="Unit"
              name="unit"
              options={uOptions}
              value={formData.unit}
              onChange={(val) => handleSelectChange(val, "unit")}
              error={touched.unit ? errors.unit : ""}
              placeholder="Select Unit"
              isSearchable
            />
          </div>

          <div>
            <ReactSelect
              label="Tax Slab"
              name="tax"
              options={tOptions}
              value={formData.tax}
              onChange={(val) => handleSelectChange(val, "tax")}
              error={touched.tax ? errors.tax : ""}
              placeholder="Select Tax"
              isSearchable
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
            <Input
              label="Expiry"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
            />
          </div>

          <div>
            <Input
              label="Reorder Level"
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
              label="Min Level"
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
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}