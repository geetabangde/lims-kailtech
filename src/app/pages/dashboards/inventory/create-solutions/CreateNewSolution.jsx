// Import Dependencies
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "utils/axios";
import { toast } from "react-hot-toast";
import { Plus, X } from "lucide-react";

// Local Imports
import { 
  Card, 
  Button, 
  ReactSelect as Select, 
} from "components/ui";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function CreateNewSolution() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [masterInstruments, setMasterInstruments] = useState([]);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      category: "",
      type: "",
      quantity: "",
      exp: "",
      department: "",
      mixedSolutions: [
        { subcatid: "", qty: "" }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mixedSolutions"
  });

  const categoryId = watch("category");

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await axios.get("inventory/get-solution-initial-data");
      if (response.data.status) {
        setCategories(response.data.categories || []);
        setDepartments(response.data.departments || []);
        setMasterInstruments(response.data.masterInstruments || []);
      }
    } catch (err) {
      console.error("Error fetching solution initial data:", err);
    }
  }, []);

  const fetchSubcategories = useCallback(async (cid) => {
    try {
      const response = await axios.get("inventory/get-subcategory", {
        params: { category: cid, type: 'consumable' }
      });
      if (response.data.status) {
        setSubcategories(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  }, [categoryId, fetchSubcategories]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post("inventory/insert-create-solution", formData);
      if (response.data.status) {
        toast.success(response.data.message || "Solution added successfully");
        navigate("/dashboards/inventory/create-solutions");
      } else {
        toast.error(response.data.message || "Failed to add solution");
      }
    } catch {
      toast.error("An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add New Solution">
      <div className="transition-content w-full pb-5">
        <Card className="flex flex-col border-none shadow-soft dark:bg-dark-700">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-dark-500 sm:p-5">
            <h3 className="text-lg font-bold text-gray-800 dark:text-dark-100">
              Add New Solution
            </h3>
            <Button
              component={Link}
              to="/dashboards/inventory/create-solutions"
              color="info"
              variant="outline"
              size="sm"
            >
              {"<< Back to Solution creation List"}
            </Button>
          </div>

          <div className="p-4 sm:p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
              {/* Main Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      id="category"
                      label="Category"
                      placeholder="Select Category"
                      options={categories.map(c => ({ value: c.id, label: c.name }))}
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="type"
                      label="Product Type / Subcategory"
                      placeholder="Select Type"
                      options={subcategories.map(s => ({ value: s.id, label: s.name }))}
                    />
                  )}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Qty
                  </label>
                  <Controller
                    name="quantity"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-100"
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </label>
                  <Controller
                    name="exp"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-100"
                      />
                    )}
                  />
                </div>

                <Controller
                  name="department"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      id="department"
                      label="Department"
                      placeholder="Select Department"
                      options={departments.map(d => ({ value: d.id, label: d.name }))}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Mixed Solutions Section */}
              <div className="mt-8 space-y-4">
                <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 border-b pb-2">
                  Mixed Solution
                </h4>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg relative md:flex-row md:items-end">
                    <div className="flex-1">
                      <Controller
                        name={`mixedSolutions.${index}.subcatid`}
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field, fieldState }) => (
                          <Select
                            {...field}
                            label={index === 0 ? "Select Item" : ""}
                            placeholder="Select"
                            options={masterInstruments.map(m => ({ 
                              value: m.id, 
                              label: `${m.name} (${m.newidno || ""}) (${m.department} ${m.qty}${m.udescription || ""})` 
                            }))}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </div>
                    
                    <div className="w-full md:w-32">
                      <Controller
                        name={`mixedSolutions.${index}.qty`}
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            placeholder="Qty"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-100"
                          />
                        )}
                      />
                    </div>

                    {index > 0 && (
                      <Button
                        type="button"
                        color="error"
                        variant="soft"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  size="sm"
                  className="flex items-center gap-2 !bg-blue-600 !text-white hover:!bg-blue-700 font-bold shadow-sm"
                  onClick={() => append({ subcatid: "", qty: "" })}
                >
                  <Plus className="h-4 w-4" /> Add Button
                </Button>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-dark-600">
                <Button
                  type="submit"
                  color="success"
                  size="lg"
                  loading={loading}
                  className="px-10 font-bold"
                >
                  Add Solution
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </Page>
  );
}
