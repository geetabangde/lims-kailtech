// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Input } from "components/ui";


export default function EditIndentApprove() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("hakuna");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [indentData, setIndentData] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [approvedQuantities, setApprovedQuantities] = useState({});

  // PHP: $indent = $obj->selectextrawhere("indent", "id=$id");
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No indent ID provided");
        navigate("/dashboards/inventory/purchase-requisition");
        return;
      }

      try {
        setLoading(true);

        // Fetch indent data
        const indentResponse = await axios.get(`/inventory/indent/${id}`);
        if (indentResponse.data.status) {
          setIndentData(indentResponse.data.data);
        } else {
          toast.error("Failed to fetch indent data");
          return;
        }

        // Fetch requirements data
        const requirementsResponse = await axios.get(`/inventory/indent-requirements/${id}`);
        if (requirementsResponse.data.status) {
          setRequirements(requirementsResponse.data.data);
          // Initialize approved quantities
          const initialApproved = {};
          requirementsResponse.data.data.forEach((req) => {
            initialApproved[req.id] = req.quantity; // Default to original quantity
          });
          setApprovedQuantities(initialApproved);
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

  // PHP: onsubmit="event.preventDefault();sendForm('id', '<?= $id ?>', 'update_indent_approve.php', 'resultid', 'approve_indent');return 0;"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        id: id,
        id_req: requirements.map(req => req.id),
        approved_quantity: requirements.map(req => approvedQuantities[req.id])
      };

      const response = await axios.post("/inventory/update-indent-approve", payload);

      if (response.data.status) {
        toast.success("Indent approved successfully");
        navigate("/dashboards/inventory/purchase-requisition");
      } else {
        toast.error(response.data.message || "Failed to approve indent");
      }
    } catch (error) {
      console.error("Error approving indent:", error);
      toast.error("Something went wrong while approving indent");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprovedQuantityChange = (requirementId, value) => {
    const requirement = requirements.find(req => req.id === requirementId);
    const maxQuantity = requirement ? requirement.quantity : 0;

    // PHP: data-bvalidator="required,min[0],max[<?= $row["quantity"] ?>]"
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > maxQuantity) {
      toast.error(`Quantity must be between 0 and ${maxQuantity}`);
      return;
    }

    setApprovedQuantities(prev => ({
      ...prev,
      [requirementId]: numValue
    }));
  };

  const handleBack = () => {
    navigate("/dashboards/inventory/purchase-requisition");
  };

  if (loading) {
    return (
      <Page title="Approve Indent Requisition">
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
      <Page title="Approve Indent Requisition">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <p>Indent not found</p>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Approve Indent Requisition">
      <div className="row">
        <div className="col-12 Requisition">
          <div className="card card-default">
            <div className="card-header">
              <h3 className="card-title">Approve Requisition</h3>
              <div className="card-tools">
                <button
                  onClick={handleBack}
                  className="btn btn-default"
                >
                  &lt;&lt; Back
                </button>
                <button type="button" className="btn btn-tool">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* PHP: <form data-bvalidator-validate data-bvalidator-theme="gray" id="approve_indent" onsubmit="event.preventDefault();sendForm('id', '<?= $id ?>', 'update_indent_approve.php', 'resultid', 'approve_indent');return 0;" autocomplete="off"> */}
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="card-body">
                <div className="ml-4 mt-2">
                  <h5 style={{ paddingBottom: "8px", marginRight: "15px" }}>Requisition Information</h5>
                </div>

                {/* PHP: while ($row = $obj->fetch_assoc($indent)) */}
                <div className="row">
                  <div className="form-group col-sm-6">
                    <label htmlFor="name" className="col-sm-12 col-form-label">Indent Number</label>
                    <div className="col-sm-12">
                      <Input
                        value={indentData.indent_number || ""}
                        readOnly
                        className="form-control"
                        placeholder="Primary Name"
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-6">
                    <label htmlFor="phone" className="col-sm-12 col-form-label">Employee Code</label>
                    <div className="col-sm-12">
                      <Input
                        value={indentData.employee_code || ""}
                        disabled
                        className="form-control"
                        placeholder="Requisition Subject"
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-6">
                    <label htmlFor="company_name" className="col-sm-12 col-form-label">Name of Employee</label>
                    <div className="col-sm-12">
                      <Input
                        value={indentData.employee_name || ""}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-6">
                    <label htmlFor="email" className="col-sm-12 col-form-label">Priority</label>
                    <div className="col-sm-12">
                      <Input
                        value={indentData.priority_name || ""}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-6">
                    <label htmlFor="email" className="col-sm-12 col-form-label">New/Existing</label>
                    <div className="col-sm-12">
                      <Input
                        value={indentData.indent_type_name || ""}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="full-product-ui">
                  <div className="ml-4 mt-3">
                    <h5>Product Details</h5>
                  </div>

                  <table style={{ width: "100%" }} className="text-center table-bordered">
                    <thead>
                      <tr>
                        <td width="5%">
                          <h5>S.no</h5>
                        </td>
                        <td width="16%">
                          <h5>Material / Services Name</h5>
                        </td>
                        <td width="12%">
                          <h5>Specification</h5>
                        </td>
                        <td width="9%">
                          <h5>Quantity</h5>
                        </td>
                        <td width="9%">
                          <h5>Unit</h5>
                        </td>
                        <td width="9%">
                          <h5>Approved Quantity</h5>
                        </td>
                        <td width="15%">
                          <h5>Remark</h5>
                        </td>
                      </tr>
                    </thead>

                    <tbody>
                      {/* PHP: while ($row = $obj->fetch_assoc($requirement)) */}
                      {requirements.map((row, index) => (
                        <tr key={row.id} className="item-class" style={{ position: "relative" }}>
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
                              value={row.id}
                            />
                            <Input
                              type="text"
                              disabled
                              value={row.material_name || ""}
                              className="form-control"
                            />
                          </td>

                          <td>
                            <Input
                              type="text"
                              disabled
                              value={row.specification || ""}
                              className="form-control price_class"
                            />
                          </td>

                          <td>
                            <Input
                              type="number"
                              disabled
                              value={row.quantity || ""}
                              className="form-control quantity_class"
                            />
                          </td>

                          <td>
                            <Input
                              type="text"
                              disabled
                              value={row.unit || ""}
                              className="form-control unit_class"
                            />
                          </td>

                          <td>
                            <Input
                              type="number"
                              value={approvedQuantities[row.id] || row.quantity || ""}
                              onChange={(e) => handleApprovedQuantityChange(row.id, e.target.value)}
                              className="form-control app_quantity_class"
                              min={0}
                              max={row.quantity || 0}
                              required
                            />
                          </td>

                          <td>
                            <textarea
                              type="text"
                              disabled
                              value={row.remark || ""}
                              className="form-control"
                              style={{ resize: "none" }}
                              rows={2}
                            />
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

      <style dangerouslySetInnerHTML={{ __html: `
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

        .table-bordered {
          border-collapse: collapse;
        }

        .table-bordered th,
        .table-bordered td {
          border: 1px solid #ddd;
          padding: 8px;
        }

        .text-center {
          text-align: center;
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

        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
          color: white;
        }

        .btn:hover {
          opacity: 0.8;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      ` }} />
    </Page>
  );
}