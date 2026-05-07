// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Input } from "components/ui";

// ----------------------------------------------------------------------
// PHP: $emp_name = $obj->selectfield("admin", "concat(firstname,' ',middlename,' ',lastname)", "id", $employeeid);
// PHP: $emp_code = $obj->selectfield("admin", "empid", "id", $employeeid);
// PHP: $priority = $obj->selectextrawhereupdate("priority", "id,priority_name", "status=1");
// PHP: $indent_type = $obj->selectextrawhereupdate("indent_type", "id,name", "status=1");

export default function AddIndent() {
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("userId");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [employeeData, setEmployeeData] = useState({ name: "", code: "" });
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [indentTypeOptions, setIndentTypeOptions] = useState([]);
  const [formData, setFormData] = useState({
    priority: "",
    indent_type_id: ""
  });

  // PHP: Fetch employee data and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch employee data
        if (employeeId) {
          const empResponse = await axios.get(`/admin/employee/${employeeId}`);
          if (empResponse.data.status) {
            const emp = empResponse.data.data;
            setEmployeeData({
              name: `${emp.firstname || ""} ${emp.middlename || ""} ${emp.lastname || ""}`.trim(),
              code: emp.empid || ""
            });
          }
        }

        // Fetch priority options
        // PHP: $priority = $obj->selectextrawhereupdate("priority", "id,priority_name", "status=1");
        const priorityResponse = await axios.get("/master/priority?status=1");
        if (priorityResponse.data.status) {
          setPriorityOptions(priorityResponse.data.data || []);
        }

        // Fetch indent type options
        // PHP: $indent_type = $obj->selectextrawhereupdate("indent_type", "id,name", "status=1");
        const indentTypeResponse = await axios.get("/master/indent-type?status=1");
        if (indentTypeResponse.data.status) {
          setIndentTypeOptions(indentTypeResponse.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // PHP: Search functionality
  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (term.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      // PHP: url: "search_item_for_indent.php", data: { search: request.term }
      const response = await axios.post("/inventory/search-item-for-indent", { search: term });
      if (response.data.status) {
        setSearchResults(response.data.data || []);
      }
    } catch (error) {
      console.error("Error searching items:", error);
    }
  };

  // PHP: Add item to table
  const handleAddItem = (item) => {
    // Check if item already added
    // PHP: if ($(this).find("#subcategory_id").val() == a) { alert("Item Already Added"); }
    const isAlreadyAdded = addedItems.some(addedItem => addedItem.id === item.id);
    if (isAlreadyAdded) {
      toast.error("Item Already Added");
      return;
    }

    setAddedItems(prev => [...prev, item]);
    setSearchTerm("");
    setSearchResults([]);
  };

  // PHP: Remove item from table
  const handleRemoveItem = (itemId) => {
    setAddedItems(prev => prev.filter(item => item.id !== itemId));
  };

  // PHP: Form submission
  // PHP: sendForm('', '', 'insert_indent.php', 'resultid', 'Requisitionadd');
  const handleSubmit = async (e) => {
    e.preventDefault();

    // PHP: if ($.trim($("tbody#result").html()) == '') { alert("No Item is Added"); }
    if (addedItems.length === 0) {
      toast.error("No Item is Added");
      return;
    }

    if (!formData.priority || !formData.indent_type_id) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        employee_id: employeeId,
        priority: formData.priority,
        indent_type_id: formData.indent_type_id,
        items: addedItems.map(item => ({
          subcategory_id: item.id,
          specification: item.specification || "",
          quantity: item.quantity || 1,
          remark: item.remark || ""
        }))
      };

      const response = await axios.post("/inventory/insert-indent", payload);
      
      if (response.data.status) {
        toast.success("Requisition added successfully");
        navigate("/dashboards/inventory/purchase-requisition");
      } else {
        toast.error(response.data.message || "Failed to add requisition");
      }
    } catch (error) {
      console.error("Error adding requisition:", error);
      toast.error("Something went wrong while adding requisition");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <Page title="Add Requisition">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"></path>
          </svg>
          Loading...
        </div>
      </Page>
    );
  }

  return (
    <Page title="Add Requisition">
      <div className="row">
        <div className="col-12">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Add Requisition</h3>
            </div>

            {/* PHP: <form data-bvalidator-validate data-bvalidator-theme="gray" id="Requisitionadd" onsubmit="event.preventDefault();sendForm('', '', 'insert_indent.php', 'resultid', 'Requisitionadd');return 0;" autocomplete="off"> */}
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="card-body">
                <div className="ml-4 mt-2">
                  <h5 style={{ paddingBottom: "8px", marginRight: "15px" }}>Requisition Information</h5>
                </div>
                
                <div className="row">
                  <div className="form-group col-sm-6">
                    <label htmlFor="phone" className="col-sm-12 col-form-label">Employee Code</label>
                    <div className="col-sm-12">
                      <Input
                        value={employeeData.code}
                        disabled
                        className="form-control"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-6">
                    <label htmlFor="company_name" className="col-sm-12 col-form-label">Name of Employee</label>
                    <div className="col-sm-12">
                      <Input
                        type="hidden"
                        value={employeeId}
                      />
                      <Input
                        value={employeeData.name}
                        disabled
                        className="form-control"
                        placeholder="Company or Requisition Name"
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-6">
                    <label htmlFor="email" className="col-sm-12 col-form-label">Priority</label>
                    <div className="col-sm-12">
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="form-control"
                        style={{ width: "100%" }}
                        required
                      >
                        <option value="">Select Priority</option>
                        {/* PHP: foreach ($priority_data as list($id, $name)) */}
                        {priorityOptions.map(priority => (
                          <option key={priority.id} value={priority.id}>
                            {priority.priority_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group col-sm-6">
                    <label htmlFor="email" className="col-sm-12 col-form-label">New/Existing</label>
                    <div className="col-sm-12">
                      <select
                        value={formData.indent_type_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, indent_type_id: e.target.value }))}
                        className="form-control"
                        style={{ width: "100%" }}
                        required
                      >
                        <option value="">Select Type</option>
                        {/* PHP: foreach ($indent_type_data as list($id, $name)) */}
                        {indentTypeOptions.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group col-sm-12">
                    <label htmlFor="phone" className="col-sm-12 col-form-label">Search</label>
                    <div className="col-sm-12 relative">
                      <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="form-control"
                        placeholder="Search Any Item"
                      />
                      
                      {/* Search Results Dropdown */}
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {searchResults.map((item, index) => (
                            <div
                              key={index}
                              onClick={() => handleAddItem(item)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                            >
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600">{item.specification}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="full-product-ui">
                  <div className="ml-4 mt-3">
                    <h5>Product Details</h5>
                  </div>
                  
                  <table className="table table-condensed table-striped table-bordered">
                    <thead>
                      <tr>
                        <td width="50px">
                          <h5>S.no</h5>
                        </td>
                        <td>
                          <h5>Material / Services Name</h5>
                        </td>
                        <td width="200px">
                          <h5>Specification</h5>
                        </td>
                        <td width="180px">
                          <h5>Quantity</h5>
                        </td>
                        <td width="100px">
                          <h5>Unit</h5>
                        </td>
                        <td>
                          <h5>Remark</h5>
                        </td>
                        <td>
                          <h5>Close</h5>
                        </td>
                      </tr>
                    </thead>
                    <tbody id="result">
                      {/* Added items */}
                      {addedItems.map((item, index) => (
                        <tr key={item.id} className="item-class">
                          <td>
                            <Input
                              type="text"
                              value={index + 1}
                              readOnly
                              className="form-control s_no"
                            />
                          </td>
                          <td>
                            <Input
                              type="hidden"
                              value={item.id}
                            />
                            <Input
                              type="text"
                              value={item.name}
                              readOnly
                              className="form-control"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.specification || ""}
                              readOnly
                              className="form-control"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              defaultValue={item.quantity || 1}
                              min="1"
                              className="form-control"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.unit || ""}
                              readOnly
                              className="form-control"
                            />
                          </td>
                          <td>
                            <textarea
                              className="form-control"
                              style={{ resize: "none" }}
                              rows={1}
                              placeholder="Add remark..."
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="btn btn-sm btn-danger"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-footer">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
                <div id="resultid"></div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          box-shadow: inset 0 0 5px grey;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: lightblue;
          border-radius: 10px;
        }

        .item-class td {
          padding: 5px;
        }

        .card-primary {
          border: 1px solid #007bff;
          border-radius: 4px;
        }

        .card-header {
          background-color: #007bff;
          color: white;
          border-bottom: 1px solid #007bff;
          padding: 1rem;
        }

        .card-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
        }

        .card-body {
          padding: 1rem;
        }

        .card-footer {
          background-color: #f8f9fa;
          border-top: 1px solid #ddd;
          padding: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .col-form-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-bordered th,
        .table-bordered td {
          border: 1px solid #ddd;
          padding: 8px;
        }

        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .btn {
          padding: 0.375rem 0.75rem;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
          color: white;
        }

        .btn-danger {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }

        .btn:hover {
          opacity: 0.8;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-control {
          display: block;
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-control:focus {
          color: #495057;
          background-color: #fff;
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .form-control:disabled {
          background-color: #e9ecef;
          opacity: 1;
        }
      `}</style>
    </Page>
  );
}