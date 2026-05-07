// Import Dependencies
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

// Local Imports
import { Card, Button, Input, ReactSelect as Select } from "components/ui";
import axios from "utils/axios";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function EditAppraisal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Options State
  const [options, setOptions] = useState({
    employees: [],
    departments: [],
    designations: [],
    branches: [],
    salaryStructures: [],
  });

  const [formData, setFormData] = useState({
    userid: "",
    eff_date: "",
    appraisalin: "",
    department: "",
    designation: "",
    hod: "",
    assesdby: "",
    reportingto: "",
    posting: "",
    salarystructure: "",
    gross: 0,
    basic: 0,
    hra: 0,
    sa: 0,
    bonus: 0,
    epfemp: 0,
    esicemp: 0,
    pt: 0,
    netinhand: 0,
    epfemployer: 0,
    esicemployer: 0,
    mobileallowance: 0,
    grossctcmonth: 0,
    grossctcannual: 0,
    remark: "",
  });

  const [structureRules, setStructureRules] = useState(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch Options and Appraisal Data in parallel
      const [optRes, appRes] = await Promise.all([
        axios.get("/hrm/appraisal-options"),
        axios.get(`/hrm/get-appraisal-byid/${id}`)
      ]);

      if (optRes.data.status) {
        setOptions(optRes.data.data);
      }

      if (appRes.data.status) {
        const data = appRes.data.data;
        setFormData({
          ...data,
          eff_date: data.eff_date ? dayjs(data.eff_date).format("YYYY-MM-DD") : "",
        });
        
        if (data.salarystructure) {
          fetchStructureRules(data.salarystructure);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load appraisal data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchStructureRules = async (structureId) => {
    try {
      const res = await axios.get(`/hrm/get-salary-structure-rules/${structureId}`);
      if (res.data.status) {
        setStructureRules(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching rules:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "salarystructure" && value) {
      fetchStructureRules(value);
    }
  };

  // Logic for salary calculations
  useEffect(() => {
    if (!structureRules || formData.appraisalin === "Designation") return;

    const calculateSalary = () => {
      const gross = parseFloat(formData.gross) || 0;
      let basic = parseFloat(formData.basic) || 0;
      let hra = parseFloat(formData.hra) || 0;
      let epfemp = parseFloat(formData.epfemp) || 0;
      let esicemp = parseFloat(formData.esicemp) || 0;
      let pt = parseFloat(formData.pt) || 0;
      let epfemployer = parseFloat(formData.epfemployer) || 0;
      let esicemployer = parseFloat(formData.esicemployer) || 0;
      let mobileallowance = parseFloat(formData.mobileallowance) || 0;

      // Apply rules if not manual
      if (structureRules.basicpercentof !== "manual") {
        basic = (gross * parseFloat(structureRules.basicpercent)) / 100;
      }
      if (structureRules.hrapercentof !== "manual") {
        hra = (basic * parseFloat(structureRules.hrapercent)) / 100;
      }
      // ... Add other complex rules here based on structureRules ...
      // This part should mimic exactly what the backend/legacy JS does

      const netinhand = gross - epfemp - esicemp - pt;
      const grossctcmonth = gross + epfemployer + esicemployer + mobileallowance;
      const grossctcannual = grossctcmonth * 12;

      setFormData(prev => ({
        ...prev,
        basic: basic.toFixed(2),
        hra: hra.toFixed(2),
        netinhand: netinhand.toFixed(2),
        grossctcmonth: grossctcmonth.toFixed(2),
        grossctcannual: grossctcannual.toFixed(2)
      }));
    };

    calculateSalary();
  }, [formData.gross, formData.basic, formData.hra, structureRules, formData.appraisalin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`/hrm/update-appraisal/${id}`, formData);
      if (response.data.status) {
        toast.success("Appraisal updated successfully ✅");
        navigate("/dashboards/hrm/pending-appraisal-list");
      } else {
        toast.error(response.data.message || "Failed to update ❌");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const showDesignation = formData.appraisalin === "Designation" || formData.appraisalin === "Salary & designation";
  const showSalary = formData.appraisalin === "Salary" || formData.appraisalin === "Salary & designation";

  return (
    <Page title="Edit Appraisal">
      <div className="mx-auto w-full max-w-5xl pb-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-dark-800"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-50">
              Edit Appraisal
            </h1>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Header Info */}
              <Select
                label="Employee"
                name="userid"
                options={options.employees}
                value={formData.userid}
                onChange={(val) => handleSelectChange("userid", val)}
                required
              />
              <Input
                label="Effective Date"
                name="eff_date"
                type="date"
                value={formData.eff_date}
                onChange={handleChange}
                required
              />
              <Select
                label="Appraisal In"
                name="appraisalin"
                options={[
                  { value: "Salary", label: "Salary" },
                  { value: "Designation", label: "Designation" },
                  { value: "Salary & designation", label: "Salary & designation" },
                ]}
                value={formData.appraisalin}
                onChange={(val) => handleSelectChange("appraisalin", val)}
                required
              />
              <div></div>

              {/* Designation Section */}
              {showDesignation && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-4">
                  <h3 className="md:col-span-2 text-lg font-semibold">Designation Details</h3>
                  <Select
                    label="Department"
                    name="department"
                    options={options.departments}
                    value={formData.department}
                    onChange={(val) => handleSelectChange("department", val)}
                    required
                  />
                  <Select
                    label="Designation"
                    name="designation"
                    options={options.designations}
                    value={formData.designation}
                    onChange={(val) => handleSelectChange("designation", val)}
                    required
                  />
                  <Select
                    label="HOD"
                    name="hod"
                    options={options.employees}
                    value={formData.hod}
                    onChange={(val) => handleSelectChange("hod", val)}
                    required
                  />
                  <Select
                    label="Monthly Performance Assessed By"
                    name="assesdby"
                    options={options.employees.filter(e => e.value !== formData.userid)}
                    value={formData.assesdby}
                    onChange={(val) => handleSelectChange("assesdby", val)}
                    required
                  />
                  <Select
                    label="Reporting To"
                    name="reportingto"
                    options={options.employees.filter(e => e.value !== formData.userid)}
                    value={formData.reportingto}
                    onChange={(val) => handleSelectChange("reportingto", val)}
                    required
                  />
                  <Select
                    label="Branch / Location"
                    name="posting"
                    options={options.branches}
                    value={formData.posting}
                    onChange={(val) => handleSelectChange("posting", val)}
                    required
                  />
                </div>
              )}

              {/* Salary Section */}
              {showSalary && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-4">
                  <h3 className="md:col-span-2 text-lg font-semibold">Salary Details</h3>
                  <Select
                    label="Salary Structure"
                    name="salarystructure"
                    options={options.salaryStructures}
                    value={formData.salarystructure}
                    onChange={(val) => handleSelectChange("salarystructure", val)}
                    required
                  />
                  <div></div>

                  <Input label="Gross" name="gross" type="number" value={formData.gross} onChange={handleChange} />
                  <Input label="Basic" name="basic" type="number" value={formData.basic} onChange={handleChange} readOnly={structureRules?.basicpercentof !== "manual"} />
                  <Input label="HRA" name="hra" type="number" value={formData.hra} onChange={handleChange} readOnly={structureRules?.hrapercentof !== "manual"} />
                  <Input label="Special Allowance" name="sa" type="number" value={formData.sa} onChange={handleChange} />
                  <Input label="Bonus" name="bonus" type="number" value={formData.bonus} onChange={handleChange} />

                  <h4 className="md:col-span-2 font-medium mt-2">Deductions</h4>
                  <Input label="EPF (Employee)" name="epfemp" type="number" value={formData.epfemp} readOnly />
                  <Input label="ESIC (Employee)" name="esicemp" type="number" value={formData.esicemp} readOnly />
                  <Input label="Professional Tax" name="pt" type="number" value={formData.pt} readOnly />
                  <Input label="Net In Hand" name="netinhand" type="number" value={formData.netinhand} readOnly />

                  <h4 className="md:col-span-2 font-medium mt-2">Invisible Benefits</h4>
                  <Input label="EPF (Employer)" name="epfemployer" type="number" value={formData.epfemployer} readOnly />
                  <Input label="ESIC (Employer)" name="esicemployer" type="number" value={formData.esicemployer} readOnly />
                  <Input label="Mobile Allowance" name="mobileallowance" type="number" value={formData.mobileallowance} onChange={handleChange} />
                  
                  <div className="md:col-span-2 grid grid-cols-2 gap-6 pt-4 border-t">
                    <Input label="Gross CTC / Month" name="grossctcmonth" type="number" value={formData.grossctcmonth} readOnly />
                    <Input label="Gross CTC / Annual" name="grossctcannual" type="number" value={formData.grossctcannual} readOnly />
                  </div>
                </div>
              )}

              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Remark</label>
                <textarea
                  name="remark"
                  rows={3}
                  value={formData.remark}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-xs focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Page>
  );
}
