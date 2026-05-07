import { useNavigate } from "react-router";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";

export default function AddCurrency() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual API call
    console.log("Creating currency...");
    navigate("/dashboards/people/customer-categories");
  };

  return (
    <Page title="Add customer-categories">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Customer Categories</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/people/customer-categories")}
          >
            Back to List
          </Button>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <Input label="Customer Category Name" placeholder="Customer Category Name"  required />
          <Input label="Code Prefix" placeholder="Code Prefix" required />

          <Button type="submit" color="primary">
            Save
          </Button>
        </form>
      </div>
    </Page>
  );
}
