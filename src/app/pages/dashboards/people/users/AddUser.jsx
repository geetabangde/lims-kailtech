import { useNavigate } from "react-router";
import { Button, Input, Select } from "components/ui";
import { Page } from "components/shared/Page";

export default function AddCurrency() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual API call
    console.log("Creating suppliers...");
    navigate("/dashboards/people/users");
  };

  return (
    <Page title="Add Suppliers">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Users</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/people/users")}
          >
            Back to List
          </Button>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

  <Input label="First Name" name="first_name" placeholder="First Name" required />
  <Input label="Last Name" name="last_name" placeholder="Last Name" required />

  <Input label="Username" name="username" placeholder="Username" required />
  <Input label="Employee ID" name="empid" placeholder="Employee ID" required />

  <Input label="Mobile" name="mobile" placeholder="Mobile No." type="tel" required />
  <Input label="Email" name="email" placeholder="Email Address" type="email" required />
  <Input label="Password" name="password" placeholder="Password" type="password" required />

  <Select label="Gender" name="gender" required>
    <option value="">Select</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </Select>

  <Input label="Department" name="department" placeholder="Department" required />
  <Input label="Designation" name="designation" placeholder="Designation" required />

  <Input label="Authorize For" name="authorize_for" placeholder="Role" required />
  <Input label="Nationality" name="nationality" placeholder="Nationality" required />

  <Select label="Marital Status" name="marital_status" required>
    <option value="">Select</option>
    <option value="single">Single</option>
    <option value="married">Married</option>
  </Select>

  <Input label="Date of Birth" name="dob" type="date" required />

  <Input label="Attendance Policy" name="attendance_policy" placeholder="Attendance Policy" />
  <Input label="Leave Policy" name="leave_policy" placeholder="Leave Policy" />

  <div className="md:col-span-2 flex gap-4">
    <label className="flex items-center gap-2">
      <span>Login Allowed</span>
      <input type="checkbox" name="login_allowed" className="form-checkbox" />
    </label>
    <label className="flex items-center gap-2">
      <span>Login Time Restriction</span>
      <input type="checkbox" name="login_time_restriction" className="form-checkbox" />
    </label>
  </div>

  <Input label="Login Start Time" name="login_start_time" type="time" />
  <Input label="Login End Time" name="login_end_time" type="time" />

  <Select label="Login Allowed For" name="login_allowed_for">
    <option value="">Select</option>
    <option value="office">Office</option>
    <option value="site">Site</option>
  </Select>

  <Input label="IP Validation" name="ip_validation" placeholder="IP Validation (e.g. 192.168.0.1)" />

  <Input label="Reporting To" name="reporting_to" placeholder="Reporting To (Name or ID)" />
  <Input label="Posting" name="posting" placeholder="Posting Location" />

  {/* ✅ Photo Upload */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-white">
      Upload Photo
    </label>
    <input
      type="file"
      name="photo"
      accept="image/*"
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
    />
  </div>

  {/* ✅ Signature Upload */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-white">
      Upload Signature
    </label>
    <input
      type="file"
      name="signature"
      accept="image/*"
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
    />
  </div>

  {/* ✅ Submit Button */}
  <div className="md:col-span-2">
    <Button type="submit" color="primary" className="w-full">
      Save User
    </Button>
  </div>
</form>


      </div>
    </Page>
  );
}
