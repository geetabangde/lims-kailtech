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
      <div className="transition-content w-full px-(--margin-x) pb-5 pt-4">
        <Card className="relative flex flex-col p-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-dark-500">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-50">
              View Purchase Order
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                className="h-9 px-4 text-sm"
              >
                &lt;&lt; Back
              </Button>
              {canEdit && (
                <Button
                  onClick={handleEdit}
                  color="warning"
                  variant="outline"
                  className="h-9 px-4 text-sm"
                >
                  Edit
                </Button>
              )}
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="h-9 px-4 text-sm border-gray-300"
              >
                Export to PDF
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Header Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                 <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                    Business Name
                  </label>
                  <div className="col-span-8">
                    <Input
                      readOnly
                      value={supplier?.company || ""}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                    Contact Person
                  </label>
                  <div className="col-span-8">
                    <Input
                      readOnly
                      value={purchaseOrder.sname || ""}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                    Phone Number
                  </label>
                  <div className="col-span-8">
                    <Input
                      readOnly
                      value={purchaseOrder.sphone || supplier?.mobile || ""}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                    Email Address
                  </label>
                  <div className="col-span-8">
                    <Input
                      readOnly
                      value={purchaseOrder.semail || supplier?.email || ""}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-start gap-4 pt-2">
                  <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                    Address
                  </label>
                  <div className="col-span-8">
                    <textarea
                      readOnly
                      value={purchaseOrder.saddress || ""}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none dark:border-dark-500 dark:bg-dark-800"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-12 items-center gap-4 text-right">
                   <div className="col-span-8 col-start-1">
                     <label className="text-sm font-medium text-gray-600 dark:text-dark-200">Date</label>
                   </div>
                   <div className="col-span-4">
                     <Input readOnly value={formatDate(purchaseOrder.date)} className="bg-gray-50 text-right" />
                   </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-4 text-right">
                   <div className="col-span-8 col-start-1">
                     <label className="text-sm font-medium text-gray-600 dark:text-dark-200">PO Number</label>
                   </div>
                   <div className="col-span-4">
                     <Input readOnly value={purchaseOrder.po_number} className="bg-gray-50 text-right font-bold" />
                   </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="grid grid-cols-12 items-start gap-4">
                    <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                      Billed & Consigned To
                    </label>
                    <div className="col-span-8">
                      <textarea
                        readOnly
                        value={purchaseOrder.bill_and_consign_to || ""}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none dark:border-dark-500 dark:bg-dark-800"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-4">
                    <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                      Delivery Terms
                    </label>
                    <div className="col-span-8">
                      <Input readOnly value={purchaseOrder.delivery_terms || ""} className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-4">
                    <label className="col-span-4 text-sm font-medium text-gray-600 dark:text-dark-200">
                      Payment Terms
                    </label>
                    <div className="col-span-8">
                      <Input readOnly value={purchaseOrder.payment_terms || ""} className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 dark:border-dark-500">
              <div className="bg-gray-50 px-4 py-3 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-500">
                <h3 className="text-md font-semibold text-gray-800 dark:text-dark-50">Product Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600 dark:bg-dark-700 dark:text-dark-200">
                    <tr>
                      <th className="px-4 py-3">S.No</th>
                      <th className="px-4 py-3">HSN/SAC</th>
                      <th className="px-4 py-3">Material/Service Name</th>
                      <th className="px-4 py-3">Specification</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Tax Rate</th>
                      <th className="px-4 py-3 text-right">Tax Amount</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-500">
                    {purchaseOrderItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{item.hsn_code || "—"}</td>
                        <td className="px-4 py-3 font-medium">
                          {purchaseOrder.ordertype === "PO" ? item.category_name || "—" : item.itemname || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{item.specification || "—"}</td>
                        <td className="px-4 py-3 text-right font-mono">{item.price}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{item.tax_rate}%</td>
                        <td className="px-4 py-3 text-right font-mono">{item.totaltaxamountitem}</td>
                        <td className="px-4 py-3 text-right font-bold font-mono">
                          {Number(item.finalamount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="flex justify-end pt-6">
              <div className="w-full max-w-md space-y-3 rounded-xl bg-gray-50 p-6 dark:bg-dark-800">
                <div className="flex justify-between text-sm text-gray-600 dark:text-dark-200">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">{purchaseOrder.subtotal}</span>
                </div>
                {purchaseOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Discount</span>
                    <span className="font-mono">-{purchaseOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600 dark:text-dark-200">
                  <span>Tax Amount</span>
                  <span className="font-mono font-medium">{purchaseOrder.totaltaxamount}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900 dark:border-dark-500 dark:text-dark-50">
                  <span>Grand Total</span>
                  <span className="text-primary-600 font-mono">
                    {Number(purchaseOrder.finaltotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
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