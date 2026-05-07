import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import ReactSelect from "react-select";

export default function EditSalaryStructureDesign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    basic: "",
    hra: "",
    sa: "",
    bonus: "",
    pfmax: "",
    esicmin: "",
    esicmax: "",
    epfemp: "",
    esicemp: "",
    epfemployer: "",
    esicemployer: "",
    mobileallowance: "",
    basicPercentOf: [],
    hraPercentOf: [],
    saPercentOf: [],
    bonusPercentOf: [],
    epfempPercentOf: [],
    esicempPercentOf: [],
    epfemployerPercentOf: [],
    esicemployerPercentOf: [],
    mobileallowancePercentOf: [],
    pfRequired: "",
    esicRequired: "",
  });

  const recordEnvOptions = [
    { value: "Manual", label: "Manual" },
    { value: "Not Required", label: "Not Required" },
    { value: "Gross", label: "Gross" },
    { value: "Basic", label: "Basic" },
    { value: "Special Allowances", label: "Special Allowances" },
    { value: "Bonus", label: "Bonus" },
  ];

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/hrm/salary-structure-get-byid/${id}`);
        const result = res.data;

        if (result.status === true && result.data) {
          const data = result.data;

          setFormData({
            name: data.name || "",
            basic: data.basic || "",
            hra: data.hra || "",
            sa: data.sa || "",
            bonus: data.bonus || "",
            pfmax: data.pfmax || "",
            esicmin: data.esicmin || "",
            esicmax: data.esicmax || "",
            epfemp: data.epfemp || "",
            esicemp: data.esicemp || "",
            epfemployer: data.epfemployer || "",
            esicemployer: data.esicemployer || "",
            mobileallowance: data.mobileallowance || "",
            basicPercentOf: data.basicpercentof ? data.basicpercentof.split(",") : [],
            hraPercentOf: data.hrapercentof ? data.hrapercentof.split(",") : [],
            saPercentOf: data.sapercentof ? data.sapercentof.split(",") : [],
            bonusPercentOf: data.bonuspercentof ? data.bonuspercentof.split(",") : [],
            epfempPercentOf: data.epfemppercentof ? data.epfemppercentof.split(",") : [],
            esicempPercentOf: data.esicemppercentof ? data.esicemppercentof.split(",") : [],
            epfemployerPercentOf: data.epfemployerpercentof ? data.epfemployerpercentof.split(",") : [],
            esicemployerPercentOf: data.esicemployerpercetof ? data.esicemployerpercetof.split(",") : [],
            mobileallowancePercentOf: data.mobileallowancepercentof ? data.mobileallowancepercentof.split(",") : [],
            pfRequired: data.pfrequired || "",
            esicRequired: data.esicrequired || "",
          });
        } else {
          toast.error(result.message || "No data found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field, selected) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected ? selected.map((opt) => opt.value) : [],
    }));
  };

  const handleYesNoChange = (field, selected) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected ? selected.value : "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.basic) newErrors.basic = "Basic value is required";
    if (!formData.hra) newErrors.hra = "HRA value is required";
    if (!formData.sa) newErrors.sa = "SA value is required";
    if (!formData.bonus) newErrors.bonus = "Bonus value is required";
    if (!formData.pfmax) newErrors.pfmax = "PF Max is required";
    if (!formData.esicmin) newErrors.esicmin = "ESIC Min is required";
    if (!formData.esicmax) newErrors.esicmax = "ESIC Max is required";
    if (!formData.epfemp) newErrors.epfemp = "EPF Employee is required";
    if (!formData.esicemp) newErrors.esicemp = "ESIC Employee is required";
    if (!formData.mobileallowance) newErrors.mobileallowance = "Mobile Allowance is required";
    if (!formData.epfemployer) newErrors.epfemployer = "EPF Employer is required";
    if (!formData.esicemployer) newErrors.esicemployer = "ESIC Employer is required";
    if (!formData.pfRequired) newErrors.pfRequired = "Please select PF Required";
    if (!formData.esicRequired) newErrors.esicRequired = "Please select ESIC Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields ❌");
      return;
    }

    setLoading(true);

    try {
      const fieldMap = {
        name: "name",
        basic: "basic",
        hra: "hra",
        sa: "sa",
        bonus: "bonus",
        pfmax: "pfmax",
        esicmin: "esicmin",
        esicmax: "esicmax",
        epfemp: "epfemp",
        esicemp: "esicemp",
        epfemployer: "epfemployer",
        esicemployer: "esicemployer",
        mobileallowance: "mobileallowance",
        basicPercentOf: "basicpercentof",
        hraPercentOf: "hrapercentof",
        saPercentOf: "sapercentof",
        bonusPercentOf: "bonuspercentof",
        epfempPercentOf: "epfemppercentof",
        esicempPercentOf: "esicemppercentof",
        epfemployerPercentOf: "epfemployerpercentof",
        esicemployerPercentOf: "esicemployerpercetof",
        mobileallowancePercentOf: "mobileallowancepercentof",
        pfRequired: "pfrequired",
        esicRequired: "esicrequired",
      };

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        const backendKey = fieldMap[key];
        if (Array.isArray(value)) {
          form.append(backendKey, value.join(","));
        } else {
          form.append(backendKey, value);
        }
      });

      await axios.post(`/hrm/salary-structure-update/${id}`, form);
      toast.success("Salary structure updated ✅");
      navigate("/dashboards/hrm/salary-structure-design");
    } catch (err) {
      console.error(err);
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Salary Structure Design">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Salary Structure Design
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/hrm/salary-structure-design")}
          >
            Back to List
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </div>

          <div>
            <Input label="Basic" name="basic" value={formData.basic} onChange={handleChange} type="number" />
            {errors.basic && <span className="text-red-500 text-sm">{errors.basic}</span>}
          </div>
          <label>Basic Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.basicPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("basicPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <div>
            <Input label="HRA" name="hra" value={formData.hra} onChange={handleChange} type="number" />
            {errors.hra && <span className="text-red-500 text-sm">{errors.hra}</span>}
          </div>
          <label>HRA Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.hraPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("hraPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <div>
            <Input label="SA" name="sa" value={formData.sa} onChange={handleChange} type="number" />
            {errors.sa && <span className="text-red-500 text-sm">{errors.sa}</span>}
          </div>
          <label>SA Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.saPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("saPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <div>
            <Input label="Bonus" name="bonus" value={formData.bonus} onChange={handleChange} type="number" />
            {errors.bonus && <span className="text-red-500 text-sm">{errors.bonus}</span>}
          </div>
          <label>Bonus Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.bonusPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("bonusPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <label>PF Required</label>
          <ReactSelect
            options={yesNoOptions}
            value={yesNoOptions.find((opt) => opt.value === formData.pfRequired) || null}
            onChange={(opt) => handleYesNoChange("pfRequired", opt)}
            isClearable
            placeholder="Select..."
          />
          {errors.pfRequired && <span className="text-red-500 text-sm">{errors.pfRequired}</span>}

          <div>
            <Input label="PF Max" name="pfmax" value={formData.pfmax} onChange={handleChange} type="number" />
            {errors.pfmax && <span className="text-red-500 text-sm">{errors.pfmax}</span>}
          </div>

          <label>ESIC Required</label>
          <ReactSelect
            options={yesNoOptions}
            value={yesNoOptions.find((opt) => opt.value === formData.esicRequired) || null}
            onChange={(opt) => handleYesNoChange("esicRequired", opt)}
            isClearable
            placeholder="Select..."
          />
          {errors.esicRequired && <span className="text-red-500 text-sm">{errors.esicRequired}</span>}

          <div>
            <Input label="ESIC Min" name="esicmin" value={formData.esicmin} onChange={handleChange} type="number" />
            {errors.esicmin && <span className="text-red-500 text-sm">{errors.esicmin}</span>}
          </div>

          <div>
            <Input label="ESIC Max" name="esicmax" value={formData.esicmax} onChange={handleChange} type="number" />
            {errors.esicmax && <span className="text-red-500 text-sm">{errors.esicmax}</span>}
          </div>

          <div>
            <Input label="EPF Employee" name="epfemp" value={formData.epfemp} onChange={handleChange} type="number" />
            {errors.epfemp && <span className="text-red-500 text-sm">{errors.epfemp}</span>}
          </div>
          <label>EPF Employee Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.epfempPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("epfempPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <div>
            <Input label="ESIC Employee" name="esicemp" value={formData.esicemp} onChange={handleChange} type="number" />
            {errors.esicemp && <span className="text-red-500 text-sm">{errors.esicemp}</span>}
          </div>
          <label>ESIC Employee Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.esicempPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("esicempPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <div>
            <Input label="Mobile Allowance" name="mobileallowance" value={formData.mobileallowance} onChange={handleChange} type="number" />
            {errors.mobileallowance && <span className="text-red-500 text-sm">{errors.mobileallowance}</span>}
          </div>
          <label>Mobile Allowance Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.mobileallowancePercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("mobileallowancePercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <div>
            <Input label="EPF Employer" name="epfemployer" value={formData.epfemployer} onChange={handleChange} type="number" />
            {errors.epfemployer && <span className="text-red-500 text-sm">{errors.epfemployer}</span>}
          </div>
          <label>EPF Employer Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.epfemployerPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("epfemployerPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <div>
            <Input label="ESIC Employer" name="esicemployer" value={formData.esicemployer} onChange={handleChange} type="number" />
            {errors.esicemployer && <span className="text-red-500 text-sm">{errors.esicemployer}</span>}
          </div>
          <label>ESIC Employer Will Be Percent Of</label>
          <ReactSelect
            options={recordEnvOptions}
            value={recordEnvOptions.filter((opt) => formData.esicemployerPercentOf.includes(opt.value))}
            onChange={(opts) => handleSelectChange("esicemployerPercentOf", opts)}
            isMulti
            isClearable
            placeholder="Select..."
          />

          <Button type="submit" color="primary" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
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