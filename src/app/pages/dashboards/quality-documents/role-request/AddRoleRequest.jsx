// Import Dependencies
import { useNavigate } from "react-router";
import { useState } from "react";
import { Button, Input, Card } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

// PHP: if(!in_array(470, $permissions)) header("location:index.php");
function usePermissions() {
  const p = localStorage.getItem("userPermissions");
  try {
    return JSON.parse(p) || [];
  } catch {
    return p?.split(",").map(Number) || [];
  }
}

// ----------------------------------------------------------------------

export default function AddRoleRequest() {
  const navigate = useNavigate();
  const permissions = usePermissions();

  // ── State Management (All hooks must be called before any conditional returns) ──
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    action: "",
    request_form: "",
  });

  // ── Permission Check (Now after all hooks are called) ────────────────────────
  // PHP: if(!in_array(470, $permissions)) header("location:index.php");
  if (!permissions.includes(470)) {
    return (
      <Page title="Add Role Request">
        <div className="flex h-60 items-center justify-center rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Access Denied - Permission 470 required
          </p>
        </div>
      </Page>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
    if (!formData.employee_name.trim()) newErrors.employee_name = "Employee Name is required";
    if (!formData.action.trim()) newErrors.action = "Action is required";
    if (!formData.request_form.trim()) newErrors.request_form = "Request Form is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("/quality-documents/add-role-request", formData);
      toast.success("Role Request submitted successfully ✅");
      navigate("/dashboards/quality-documents/role-request");
    } catch (err) {
      console.error("Error creating role request:", err);
      toast.error(err?.response?.data?.message || "Failed to submit role request ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Role Request Form">
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-dark-50">Role Request Form</h2>
            <Button
              variant="flat"
              onClick={() => navigate("/dashboards/quality-documents/role-request")}
            >
              Back to List
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Input
                label="Employee ID"
                name="employee_id"
                placeholder="Ex: EMP001"
                value={formData.employee_id}
                onChange={handleChange}
                error={errors.employee_id}
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Employee Name"
                name="employee_name"
                placeholder="Full Name"
                value={formData.employee_name}
                onChange={handleChange}
                error={errors.employee_name}
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Action"
                name="action"
                placeholder="Ex: Add / Modify Roles"
                value={formData.action}
                onChange={handleChange}
                error={errors.action}
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Request Form / Module"
                name="request_form"
                placeholder="Ex: LIMS Module"
                value={formData.request_form}
                onChange={handleChange}
                error={errors.request_form}
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <Button 
                type="submit" 
                color="primary" 
                className="w-full h-11 text-base font-semibold"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Role Request"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Page>
  );
}
