// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Input } from "components/ui";

// ----------------------------------------------------------------------
// PHP: $id = $_GET["hakuna"];
// PHP: $status = $obj->selectfield("indent", "status", "id", $id);
// PHP: $indent = $obj->selectextrawhere("indent", "id=$id");
// PHP: $requirement = $obj->selectextrawhere("indent_requirement", "indent_id=$id");

export default function ViewFullIndent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("hakuna"); // PHP: $_GET["hakuna"]

  const [loading, setLoading] = useState(true);
  const [indentData, setIndentData] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [status, setStatus] = useState(null);

  // PHP: Permission check for edit button
  function usePermissions() {
    const p = localStorage.getItem("userPermissions");
    try {
      return JSON.parse(p) || [];
    } catch {
      return p?.split(",").map(Number) || [];
    }
  }
  const permissions = usePermissions();

  // PHP: Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No indent ID provided");
        navigate("/dashboards/inventory/purchase-requisition");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch indent status
        // PHP: $status = $obj->selectfield("indent", "status", "id", $id);
        const statusResponse = await axios.get(`/inventory/indent-status/${id}`);
        if (statusResponse.data.status) {
          setStatus(statusResponse.data.data);
        }

        // Fetch indent data
        // PHP: $indent = $obj->selectextrawhere("indent", "id=$id");
        const indentResponse = await axios.get(`/inventory/indent/${id}`);
        if (indentResponse.data.status) {
          setIndentData(indentResponse.data.data);
        } else {
          toast.error("Failed to fetch indent data");
          return;
        }

        // Fetch requirements data
        // PHP: $requirement = $obj->selectextrawhere("indent_requirement", "indent_id=$id");
        const requirementsResponse = await axios.get(`/inventory/indent-requirements/${id}`);
        if (requirementsResponse.data.status) {
          setRequirements(requirementsResponse.data.data);
        } else {
          toast.error("Failed to fetch requirements data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/dashboards/inventory/purchase-requisition");
  };

  const handleEdit = () => {
    navigate(`/dashboards/inventory/purchase-requisition/edit-indent?hakuna=${id}`);
  };

  // PHP: Check if edit button should be shown
  const canEdit = permissions.includes(196) && status === "1";

  if (loading) {
    return (
      <Page title="View Requisition">
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

  if (!indentData) {
    return (
      <Page title="View Requisition">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <p>Indent not found</p>
        </div>
      </Page>
    );
  }

  return (
    <Page title="View Requisition">
      <div className="row">
        <div className="col-12 Requisition">
          <div className="card card-default">
            <div className="card-header">
              <h3 className="card-title">View Requisition</h3>
              <div className="card-tools">
                <button 
                  onClick={handleBack}
                  className="btn btn-default"
                >
                  &lt;&lt; Back
                </button>
                
                {/* PHP: if (in_array(196, $permissions)) { if ($status == "1") { ?> */}
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="btn border border-warning"
                  >
                    Edit
                  </button>
                )}
                
                <button type="button" className="btn btn-tool">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* PHP: include "formatheaders.php"; - Format headers would be implemented here if needed */}
              
              {/* PHP: while ($row = $obj->fetch_assoc($indent)) */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label htmlFor="name" className="col-md-12 col-form-label">Indent Number</label>
                    <div className="col-md-12">
                      <Input
                        value={indentData.indent_number || ""}
                        readOnly
                        className="form-control"
                        placeholder="Primary Name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group row">
                    <label htmlFor="phone" className="col-md-12 col-form-label">Employee Code</label>
                    <div className="col-md-12">
                      <Input
                        value={indentData.employee_code || ""}
                        disabled
                        className="form-control"
                        placeholder="Requisition Subject"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group row">
                    <label htmlFor="company_name" className="col-md-12 col-form-label">Name of Employee</label>
                    <div className="col-md-12">
                      <Input
                        value={indentData.employee_name || ""}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group row">
                    <label htmlFor="priority" className="col-md-12 col-form-label">Priority</label>
                    <div className="col-md-12">
                      <Input
                        value={indentData.priority_name || ""}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group row">
                    <label htmlFor="email" className="col-md-12 col-form-label">New/Existing</label>
                    <div className="col-md-12">
                      <Input
                        value={indentData.indent_type_name || ""}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="full-product-ui">
                <div className="ml-4 mt-3">
                  <h5>Product Details</h5>
                </div>
                
                <table className="table table-striped table-responsive text-center table-bordered">
                  <thead>
                    <tr>
                      <td>
                        <h5>S.no</h5>
                      </td>
                      <td>
                        <h5>Material / Services Name</h5>
                      </td>
                      <td>
                        <h5>Specification</h5>
                      </td>
                      <td>
                        <h5>Quantity</h5>
                      </td>
                      <td>
                        <h5>Approved Quantity</h5>
                      </td>
                      <td>
                        <h5>Remaining Quantity</h5>
                      </td>
                      <td>
                        <h5>Remark</h5>
                      </td>
                    </tr>
                  </thead>

                  <tbody>
                    {/* PHP: while ($row = $obj->fetch_assoc($requirement)) */}
                    {requirements.map((row, index) => (
                      <tr key={row.id} className="item-class" style={{ position: "relative" }}>
                        <td>
                          <div style={{ margin: "auto" }}>
                            {index + 1}
                          </div>
                        </td>
                        <td>
                          <Input
                            type="hidden"
                            value={row.id}
                          />
                          {row.material_name || ""}
                        </td>
                        <td>
                          {row.specification || ""}
                        </td>
                        <td>
                          {row.quantity || ""}
                        </td>
                        <td>
                          {row.approved_quantity || ""}
                        </td>
                        <td>
                          {row.remainingqty || ""}
                        </td>
                        <td>
                          {row.remark || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="add-more" id="more-items"></div>
              </div>
            </div>

            <div className="card-footer">
              <div id="resultid"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

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

        .card-default {
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .card-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #ddd;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
        }

        .card-tools {
          display: flex;
          gap: 0.5rem;
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

        .text-center {
          text-align: center;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .btn {
          padding: 0.375rem 0.75rem;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .btn-default {
          background-color: #f8f9fa;
          border-color: #ddd;
          color: #212529;
        }

        .btn-tool {
          background-color: transparent;
          border: none;
          color: #6c757d;
        }

        .border-warning {
          border-color: #ffc107 !important;
          color: #856404;
        }

        .btn:hover {
          opacity: 0.8;
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

        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-md-12 {
          flex: 0 0 100%;
          max-width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        @media (max-width: 768px) {
          .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </Page>
  );
}