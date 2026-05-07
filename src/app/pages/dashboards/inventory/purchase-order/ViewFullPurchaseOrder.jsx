// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Input } from "components/ui";

// ----------------------------------------------------------------------
// PHP: $po_id = $_GET["hakuna"];
// PHP: $purchase_order = $obj->selectextrawhere("purchase_order", "id=$po_id");
// PHP: $po_item = $obj->selectextrawhere("purchase_order_item", "purchase_order_id=$po_id");
// PHP: $approveid = $obj->selectfield("purchase_order", "status", "id", $po_id);

export default function ViewFullPurchaseOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const poId = searchParams.get("hakuna");

  const [loading, setLoading] = useState(true);
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);
  const [supplier, setSupplier] = useState(null);

  // PHP: Fetch purchase order data
  useEffect(() => {
    const fetchPurchaseOrderData = async () => {
      if (!poId) {
        toast.error("Purchase Order ID is required");
        navigate("/dashboards/inventory/purchase-order");
        return;
      }

      try {
        setLoading(true);

        // Fetch purchase order details
        // PHP: $purchase_order = $obj->selectextrawhere("purchase_order", "id=$po_id");
        const poResponse = await axios.get(`/inventory/purchase-order/${poId}`);
        if (poResponse.data.status) {
          const poData = poResponse.data.data;
          setPurchaseOrder(poData);

          // Fetch supplier details
          // PHP: $obj->selectfield("suppliers", "company", "id", $row["customer_id"])
          if (poData.customer_id) {
            const supplierResponse = await axios.get(`/master/suppliers/${poData.customer_id}`);
            if (supplierResponse.data.status) {
              setSupplier(supplierResponse.data.data);
            }
          }

          // Fetch purchase order items
          // PHP: $po_item = $obj->selectextrawhere("purchase_order_item", "purchase_order_id=$po_id");
          const itemsResponse = await axios.get(`/inventory/purchase-order-items/${poId}`);
          if (itemsResponse.data.status) {
            setPurchaseOrderItems(itemsResponse.data.data || []);
          }
        } else {
          toast.error("Purchase Order not found");
          navigate("/dashboards/inventory/purchase-order");
        }
      } catch (error) {
        console.error("Error fetching purchase order:", error);
        toast.error("Something went wrong while loading purchase order");
        navigate("/dashboards/inventory/purchase-order");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrderData();
  }, [poId, navigate]);

  // PHP: Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
  };

  // PHP: if ($approveid == -1) { ?>
  const canEdit = purchaseOrder && purchaseOrder.status === -1;

  const handleBack = () => {
    navigate("/dashboards/inventory/purchase-order");
  };

  const handleEdit = () => {
    navigate(`/dashboards/inventory/purchase-order/edit-purchase-order?hakuna=${poId}`);
  };

  const handleExportPDF = () => {
    // PHP: <a href="exportpotopdf.php?hakuna=<?= $po_id ?>"
    window.open(`/inventory/export-purchase-order-pdf?hakuna=${poId}`, '_blank');
  };

  if (loading) {
    return (
      <Page title="View Purchase Order">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"></path>
          </svg>
          Loading Purchase Order...
        </div>
      </Page>
    );
  }

  if (!purchaseOrder) {
    return (
      <Page title="View Purchase Order">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          Purchase Order not found
        </div>
      </Page>
    );
  }

  return (
    <Page title="View Purchase Order">
      <div className="row">
        <div className="col-12 purchaseorder-view">
          <div className="card card-default">
            <div className="card-header">
              <h3 className="card-title">View Purchase Order</h3>
              <div className="card-tools">
                <button
                  onClick={handleBack}
                  className="btn btn-default"
                >
                  &lt;&lt; Back
                </button>
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="btn border border-warning"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={handleExportPDF}
                  className="btn border border-secondary"
                >
                  Export to PDF
                </button>
                <button type="button" className="btn btn-tool">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* PHP: while ($row = $obj->fetch_assoc($purchase_order)) { */}
              <div>
                <div className="form-group row">
                  <label className="col-sm-8 col-form-label text-right">Date: </label>
                  <div className="col-sm-4">
                    <Input
                      type="text"
                      value={formatDate(purchaseOrder.date)}
                      readOnly
                      className="form-control"
                      name="date"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-8 col-form-label text-right">PO No.</label>
                  <div className="col-sm-4">
                    <Input
                      type="text"
                      value={purchaseOrder.po_number}
                      disabled
                      className="form-control"
                      name="po_number"
                    />
                  </div>
                </div>

                <br />

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Business Name</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={supplier?.company || ""}
                          readOnly
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div id="contact">
                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">Phone Number</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={supplier?.mobile || ""}
                            disabled
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">E-mail Address</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={supplier?.email || ""}
                            disabled
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">GST Number</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={supplier?.gstno || ""}
                            disabled
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">Website</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={supplier?.website || ""}
                            disabled
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">Contact</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={purchaseOrder.sname || ""}
                            readOnly
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">Phone</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={purchaseOrder.sphone || ""}
                            readOnly
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">Designation</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={purchaseOrder.designation || ""}
                            readOnly
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">Email</label>
                        <div className="col-sm-12">
                          <Input
                            type="text"
                            value={purchaseOrder.semail || ""}
                            readOnly
                            className="form-control"
                          />
                        </div>
                      </div>

                      <h5>Address Information</h5>
                      <div className="form-group row">
                        <label className="col-sm-12 col-form-label">Address</label>
                        <div className="col-sm-12">
                          <textarea
                            value={purchaseOrder.saddress || ""}
                            readOnly
                            style={{ resize: "none", height: "110px" }}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Billed and Consign To:</label>
                      <div className="col-sm-12">
                        <textarea
                          value={purchaseOrder.bill_and_consign_to || ""}
                          readOnly
                          style={{ resize: "none", height: "120px" }}
                          className="form-control"
                          name="bill_and_consign_to"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Delivery Terms:</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={purchaseOrder.delivery_terms || ""}
                          disabled
                          className="form-control"
                          name="delivery_terms"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Payment Terms:</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={purchaseOrder.payment_terms || ""}
                          disabled
                          className="form-control"
                          name="payment_terms"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Quotation Date:</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={formatDate(purchaseOrder.quotationdate)}
                          readOnly
                          className="form-control"
                          name="quotationdate"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Quotation Reference No:</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={purchaseOrder.quotationno || ""}
                          readOnly
                          className="form-control"
                          name="quotationno"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Warranty:</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={purchaseOrder.warranty || ""}
                          readOnly
                          className="form-control"
                          name="warranty"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Jurisdiction :</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={purchaseOrder.jurisdiction || ""}
                          readOnly
                          className="form-control"
                          name="jurisdiction"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Other Detail :</label>
                      <div className="col-sm-12">
                        <textarea
                          value={purchaseOrder.otherdetails || ""}
                          readOnly
                          className="form-control"
                          name="otherdetails"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="full-product-ui p-2">
                  <div className="ml-4 mt-3">
                    <h5>Product Details</h5>
                  </div>

                  <table className="table table-striped table-responsive text-center table-bordered">
                    <thead>
                      <tr>
                        <td><h5>S.no</h5></td>
                        <td><h5>HSN/SAC</h5></td>
                        <td><h5>Material / Services Name</h5></td>
                        <td><h5>Specification</h5></td>
                        <td><h5>Price</h5></td>
                        <td><h5>Quantity</h5></td>
                        <td><h5>Amount</h5></td>
                        <td><h5>Discount%</h5></td>
                        <td><h5>Tax Rate</h5></td>
                        <td>IGST</td>
                        <td>CGST</td>
                        <td>SGST</td>
                        <td>Total Tax</td>
                        <td>Total</td>
                      </tr>
                    </thead>
                    <tbody>
                      {/* PHP: $i = 1; while ($subrow = $obj->fetch_assoc($po_item)) { */}
                      {purchaseOrderItems.map((item, index) => (
                        <tr key={item.id} className="item-class" style={{ position: "relative" }}>
                          <td>{index + 1}</td>
                          <td>{item.hsn_code || ""}</td>
                          <td>
                            {/* PHP: if(($row["ordertype"] == "PO")){ echo $obj->selectfield("instrumentcategories", "name", "id", $subrow['subcategory_id']); } else if($row["ordertype"] == "WO"){ echo $subrow["itemname"]; } */}
                            {purchaseOrder.ordertype === "PO" ? item.category_name || "" : item.itemname || ""}
                          </td>
                          <td>{item.specification || ""}</td>
                          <td>{item.price || ""}</td>
                          <td>{item.quantity || ""}</td>
                          <td>{item.list_price || ""}</td>
                          <td>{item.discount ? item.discount + "%" : "NA"}</td>
                          <td>{item.tax_rate || ""}</td>
                          <td>{item.igstamount || ""}</td>
                          <td>{item.cgstamount || ""}</td>
                          <td>{item.sgstamount || ""}</td>
                          <td>{item.totaltaxamountitem || ""}</td>
                          <td>{Number(item.finalamount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="float-right mt-3 tax-detail">
                    <div className="row">
                      <label className="col-md-9 text-right">Total Item Amount</label>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.subtotal || ""}
                          readOnly
                          className="form-control"
                          name="subtotal"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-9 text-right">Discount</label>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.discount || ""}
                          readOnly
                          className="form-control"
                          name="discount"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Total After Discount Value</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.totalafterdisc || ""}
                          readOnly
                          className="form-control"
                          name="totalafterdisc"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Packing & Forwarding Charges</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.packaginchrgs || ""}
                          readOnly
                          className="form-control"
                          name="packaginchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Freight Charges</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.freightchrgs || ""}
                          readOnly
                          className="form-control"
                          name="freightchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Insurance charges</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.insurancechrgs || ""}
                          readOnly
                          className="form-control"
                          name="insurancechrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Calibration Certificate Charges</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.calibrationchrgs || ""}
                          readOnly
                          className="form-control"
                          name="calibrationchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Installation,Demonstration&Training Charges</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.trainingchrgs || ""}
                          readOnly
                          className="form-control"
                          name="trainingchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Import /Custom Duty Charges</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.customdutychrgs || ""}
                          readOnly
                          className="form-control"
                          name="customdutychrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9 text-right">Total Tax Value</div>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.totaltaxamount || ""}
                          readOnly
                          className="form-control"
                          name="totaltaxamount"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-9 text-right">Total Invoice Amount</label>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.total_amount || ""}
                          readOnly
                          className="form-control"
                          name="totalinvoiceamount"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-9 text-right">Round Off</label>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.roundoff || ""}
                          readOnly
                          className="form-control"
                          name="roundoff"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-9 text-right">Total</label>
                      <div className="col-md-3">
                        <Input
                          type="text"
                          value={purchaseOrder.finaltotal || ""}
                          readOnly
                          className="form-control"
                          name="finaltotal"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div id="resultid"></div>
              </div>
            </div>
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

        input {
          width: 200px;
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

        .form-control:read-only {
          background-color: #e9ecef;
          opacity: 1;
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

        .border {
          border: 1px solid #ddd;
        }

        .border-warning {
          border-color: #ffc107;
        }

        .border-secondary {
          border-color: #6c757d;
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

        .text-right {
          text-align: right;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }

        .col-sm-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-sm-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-sm-8 {
          flex: 0 0 66.666667%;
          max-width: 66.666667%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-sm-12 {
          flex: 0 0 100%;
          max-width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-md-3 {
          flex: 0 0 25%;
          max-width: 25%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-md-9 {
          flex: 0 0 75%;
          max-width: 75%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .float-right {
          float: right;
        }

        .tax-detail {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        h5 {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 0;
        }

        @media (max-width: 768px) {
          .col-sm-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </Page>
  );
}