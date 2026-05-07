// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Card, Button, Input, Select } from "components/ui";
import axios from "utils/axios";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function AddAttendancePolicy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState({ fh: [], nh: [] });

  const [formData, setFormData] = useState({
    name: "",
    intime: "",
    outtime: "",
    workinghours: "",
    fh: [],
    nh: [],
    fhworking: "",
    nhworking: "",
    flexibility: "1",
    noofallowedflexibility: "1",
    noofallowedlatecomming: "1",
    allowedLatecommingtime: "5",
    allowedHalfday: "1",
    halfdaytime: "1",
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get("/hrm/active-holidays-list");
      if (response.data.status && Array.isArray(response.data.data)) {
        const allHolidays = response.data.data;
        setHolidays({
          fh: allHolidays
            .filter((h) => h.holidaytype === "FH")
            .map((h) => ({ value: h.id, label: `${h.name} (${h.date})` })),
          nh: allHolidays
            .filter((h) => h.holidaytype === "NH")
            .map((h) => ({ value: h.id, label: `${h.name} (${h.date})` })),
        });
      }
    } catch (err) {
      console.error("Error fetching holidays:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/hrm/insert-attendance-policy", formData);
      if (response.data.status) {
        toast.success("Attendance policy added successfully ✅");
        navigate("/dashboards/hrm/view-attendance-policies");
      } else {
        toast.error(response.data.message || "Failed to add policy ❌");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred during submission ❌");
    } finally {
      setLoading(false);
    }
  };

  // Generate options for selectors
  const flexibilityOptions = Array.from({ length: 30 }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }));
  const allowedOptions = Array.from({ length: 10 }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }));
  const lateComingTimeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120].map(m => ({
    value: m.toString(),
    label: m >= 60 ? `${Math.floor(m / 60)} Hour ${m % 60 > 0 ? (m % 60) + ' Min' : ''}` : `${m} Min`
  }));
  const halfDayOptions = Array.from({ length: 15 }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }));
  const halfDayHoursOptions = [];
  for (let i = 1; i <= 10; i += 0.5) {
    halfDayHoursOptions.push({ value: i.toString(), label: i.toString() });
  }

  return (
    <Page title="Add Attendance Policy">
      <div className="mx-auto w-full max-w-4xl pb-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-dark-800"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-50">
              Add New Attendance Policy
            </h1>
          </div>
        </div>

        <Card className="overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Policy Name */}
              <div className="md:col-span-2">
                <Input
                  label="Policy Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter policy name"
                  required
                />
              </div>

              {/* Times */}
              <Input
                label="In Time"
                name="intime"
                type="time"
                value={formData.intime}
                onChange={handleChange}
                required
              />
              <Input
                label="Out Time"
                name="outtime"
                type="time"
                value={formData.outtime}
                onChange={handleChange}
                required
              />
              <Input
                label="Working Hours"
                name="workinghours"
                type="time"
                value={formData.workinghours}
                onChange={handleChange}
                required
              />
              <div className="hidden md:block"></div>

              {/* Holiday Selections */}
              <Select
                label="Select FH (Festival Holidays)"
                name="fh"
                options={holidays.fh}
                isMulti
                value={formData.fh}
                onChange={(val) => handleSelectChange("fh", val)}
              />
              <Select
                label="Select NH (National Holidays)"
                name="nh"
                options={holidays.nh}
                isMulti
                value={formData.nh}
                onChange={(val) => handleSelectChange("nh", val)}
              />

              {/* If Working on Holidays */}
              <Input
                label="If FH Working"
                name="fhworking"
                value={formData.fhworking}
                onChange={handleChange}
                placeholder="e.g. Extra Pay / Compensatory"
              />
              <Input
                label="If NH Working"
                name="nhworking"
                value={formData.nhworking}
                onChange={handleChange}
                placeholder="e.g. Double Pay"
              />

              {/* Flexibility & Late Coming */}
              <Select
                label="Time Flexibility (Min)"
                name="flexibility"
                options={flexibilityOptions}
                value={formData.flexibility}
                onChange={(val) => handleSelectChange("flexibility", val)}
              />
              <Select
                label="No of Allowed Flexibility"
                name="noofallowedflexibility"
                options={allowedOptions}
                value={formData.noofallowedflexibility}
                onChange={(val) => handleSelectChange("noofallowedflexibility", val)}
              />
              <Select
                label="No of Allowed Late Coming"
                name="noofallowedlatecomming"
                options={allowedOptions}
                value={formData.noofallowedlatecomming}
                onChange={(val) => handleSelectChange("noofallowedlatecomming", val)}
              />
              <Select
                label="Allowed Time for Late Coming"
                name="allowedLatecommingtime"
                options={lateComingTimeOptions}
                value={formData.allowedLatecommingtime}
                onChange={(val) => handleSelectChange("allowedLatecommingtime", val)}
              />

              {/* Half Day Settings */}
              <Select
                label="Allowed Half-Days in a Month (Paid)"
                name="allowedHalfday"
                options={halfDayOptions}
                value={formData.allowedHalfday}
                onChange={(val) => handleSelectChange("allowedHalfday", val)}
              />
              <Select
                label="Hours to attend for Half-Day"
                name="halfdaytime"
                options={halfDayHoursOptions}
                value={formData.halfdaytime}
                onChange={(val) => handleSelectChange("halfdaytime", val)}
              />
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? "Saving..." : "Save Policy"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Page>
  );
}
