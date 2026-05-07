import { useNavigate } from "react-router";
import { useState } from "react";
import { Button, Input, Textarea } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function AddProcess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const [steps, setSteps] = useState([
    { name: "", description: "" }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  const addStep = () => {
    setSteps([...steps, { name: "", description: "" }]);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Process Name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";

    // Validate steps are not empty
    const incompleteStep = steps.some(step => !step.name.trim() || !step.description.trim());
    if (incompleteStep) {
      toast.error("Please fill in all Step Names and Descriptions");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        stepname: steps.map(s => s.name),
        stepdesc: steps.map(s => s.description),
      };

      const response = await axios.post("rolemanagment/create-process", payload);

      if (response.data.success || response.data.status === true) {
        toast.success(response.data.message || "New Process has been added successfully ✅");
        // Legacy PHP redirect text was "Proceed to add Quotation Items"
        navigate("/dashboards/role-management/process-guide");
      } else {
        toast.error(response.data.message || "Failed to add process");
      }
    } catch (err) {
      console.error("Error creating process:", err);
      toast.error(err?.response?.data?.message || "Error adding process ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add New Process">
      <div className="transition-content p-4 sm:p-6 lg:p-8 w-full">
        {/* Header Section */}
        <div className="mb-10 flex items-center justify-between border-b border-gray-200 dark:border-dark-700 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add New Process
            </h1>
          </div>
          <Button
            variant="flat"
            onClick={() => navigate("/dashboards/role-management/process-guide")}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            ← Back to Process List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* 1. Process Name - Top of the form in PHP */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                <PlusIcon className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Main Identity</h3>
            </div>

            <div className="max-w-3xl">
              <Input
                label="Process Name"
                name="name"
                placeholder="Enter Process Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
            </div>
          </section>

          {/* 2. Dynamic Steps - Follows name in PHP */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
                  <PlusIcon className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Process Flow Steps</h3>
              </div>
              <Button
                type="button"
                variant="outlined"
                size="sm"
                onClick={addStep}
                className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all font-bold"
              >
                <PlusIcon className="h-4 w-4" /> Add Button
              </Button>
            </div>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="group relative pb-10 border-b border-gray-100 dark:border-dark-800 last:border-0 transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-500/30">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-black tracking-widest uppercase text-blue-600">Configuration</h4>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">Define Phase Requirements</p>
                      </div>
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete Step"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Step Name</label>
                      <Input
                        placeholder="Enter Step Name"
                        value={step.name}
                        onChange={(e) => handleStepChange(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Step Desc</label>
                      <Input
                        placeholder="Enter Step Description"
                        value={step.description}
                        onChange={(e) => handleStepChange(index, "description", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Description & Category - Bottom of the form in PHP */}
          <section className="space-y-10 pt-4 border-t border-gray-100 dark:border-dark-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="md:col-span-1">
                <Textarea
                  label="Description"
                  name="description"
                  placeholder="Enter detailed process description (replaces text input)"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  label="Category"
                  name="category"
                  placeholder="Enter Category"
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                  required
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end pt-10 border-t border-gray-200 dark:border-dark-700">
            <Button
              type="submit"
              color="success"
              disabled={loading}
              className="px-12 py-4 font-black text-lg rounded-2xl shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Proceed to add Quotation Items"}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
}