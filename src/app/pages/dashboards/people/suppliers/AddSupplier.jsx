import { useNavigate } from "react-router";
import { Button, Input, Select } from "components/ui";
import { Page } from "components/shared/Page";

export default function AddCurrency() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual API call
    console.log("Creating suppliers...");
    navigate("/dashboards/people/suppliers");
  };

  return (
    <Page title="Add Suppliers">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Suppliers</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/people/suppliers")}
          >
            Back to List
          </Button>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input label="Supplier Name" name="supplier_name" placeholder="Supplier name" required />

  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-white">Address</label>
    <textarea
      name="address"
      placeholder="Company Address"
      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:border-primary-500"
      rows="3"
      required
    ></textarea>
  </div>

  <Input label="Company" name="company" placeholder="Company" />
  <Input label="Email" name="email" placeholder="Email" type="email" />
  <Input label="Mobile" name="mobile" placeholder="Mobile" type="tel" />
  <Input label="GST No" name="gst_no" placeholder="GST No" />
  <Input label="PAN No" name="pan_no" placeholder="PAN No" />
  <Input label="City" name="city" placeholder="City" />
  <Input label="Website" name="website" placeholder="Website" />

  <Select label="Country*" name="country" required>
    <option value="">Choose one..</option>
    <option value="India">India</option>
    <option value="USA">USA</option>
    {/* Add more if needed */}
  </Select>

  <Input label="State*" name="state" placeholder="State" required />

  {/* Contact Person Section */}
  <Input label="Contact Person Name*" name="contact_person_name" placeholder="Primary Name" required />
  <Input label="Contact Person Phone*" name="contact_person_phone" placeholder="Primary Phone Number" required type="tel" />
  <Input label="Contact Person Email" name="contact_person_email" placeholder="Primary Email" type="email" />
  <Input label="Designation" name="designation" placeholder="Designation" />

  <div className="md:col-span-2">
    <Button type="submit" color="primary" className="w-full">
      Save Supplier
    </Button>
  </div>
</form>

      </div>
    </Page>
  );
}
