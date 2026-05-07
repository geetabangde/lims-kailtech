// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Input } from "components/ui";

// ----------------------------------------------------------------------
// PHP: $customers = $obj->selectextrawhereupdate("suppliers", "id,company", "status=1");
// PHP: $tax_data = $obj->selectextrawhereupdate("currency", "id,name,description", "status=1");

export default function AddPurchaseOrder() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [units, setUnits] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [items, setItems] = useState([]);

  // PHP: Form data state
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-GB'),
    po_number: "",
    currency: "1",
    ordertype: "",
    customer_id: "",
    bill_and_consign_to: "",
    delivery_terms: "",
    payment_terms: "",
    quotationdate: "",
    quotationno: "",
    warranty: "",
    jurisdiction: "Subject to Indore Jurisdiction only",
    otherdetails: ""
  });

  // PHP: Tax calculation state
  const [taxCalculations, setTaxCalculations] = useState({
    subtotal: 0,
    discount: 0,
    totalafterdisc: 0,
    packaginchrgs: 0,
    freightchrgs: 0,
    insurancechrgs: 0,
    calibrationchrgs: 0,
    trainingchrgs: 0,
    customdutychrgs: 0,
    totaltaxamount: 0,
    cgsttotal: 0,
    sgsttotal: 0,
    igsttotal: 0,
    totalamount: 0,
    roundoff: 0,
    finaltotal: 0
  });

  // PHP: Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch suppliers
        // PHP: $customers = $obj->selectextrawhereupdate("suppliers", "id,company", "status=1");
        const suppliersResponse = await axios.get("/master/suppliers?status=1");
        if (suppliersResponse.data.status) {
          setSuppliers(suppliersResponse.data.data || []);
        }

        // Fetch currencies
        // PHP: $tax_data = $obj->selectextrawhereupdate("currency", "id,name,description", "status=1");
        const currenciesResponse = await axios.get("/master/currency?status=1");
        if (currenciesResponse.data.status) {
          setCurrencies(currenciesResponse.data.data || []);
        }

        // Fetch units
        // PHP: $result = $obj->selecttable($tbname);
        const unitsResponse = await axios.get("/master/units");
        if (unitsResponse.data.status) {
          setUnits(unitsResponse.data.data || []);
        }

        // Generate PO Number (simplified - in real app would match PHP logic)
        const poNum = `PO/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`;
        setFormData(prev => ({ ...prev, po_number: poNum }));

        // Set default bill and consign to (would come from company settings)
        const defaultBillTo = "Kailash Testing & Calibration Centre\n123 Test Street\nName: Test Person\nPhone: +91-1234567890";
        setFormData(prev => ({ ...prev, bill_and_consign_to: defaultBillTo }));

      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Something went wrong while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // PHP: $("#business").change(function () {
  const handleSupplierChange = async (supplierId) => {
    setFormData(prev => ({ ...prev, customer_id: supplierId }));
    setItems([]); // Clear items when supplier changes

    if (!supplierId) {
      setVendorData(null);
      return;
    }

    try {
      // PHP: $.get("fill_vendor_data_ajax.php", { hakuna: vendorid }
      const response = await axios.get(`/master/vendor-data/${supplierId}`);
      if (response.data.status) {
        setVendorData(response.data.data);

        // Fetch instruments for this supplier
        // PHP: $.ajax({ url: "fetchinstrumentsearch.php", data: { id: vendorid, ... }})
        const instrumentsResponse = await axios.get("/inventory/instruments-by-vendor", {
          params: {
            vendor_id: supplierId,
            currency: formData.currency,
            wopo: formData.ordertype
          }
        });

        if (instrumentsResponse.data.status) {
          // Add initial item row
          addNewItem(instrumentsResponse.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Something went wrong while loading vendor data");
    }
  };

  // PHP: function additem(my_gst_code, gst_state_code, state_code)
  const addNewItem = (instruments = []) => {
    const newItem = {
      id: Date.now(),
      hsn_code: "",
      subcategory_id: "",
      indent_item_id: "",
      itemname: "",
      price: "",
      specification: "",
      quantity: "",
      unit: "",
      currency: formData.currency,
      amount: 0,
      discountperitem: 0,
      discamount: 0,
      tax_rate: 18,
      igstper: 0,
      igstamount: 0,
      sgstper: 0,
      sgstamount: 0,
      cgstper: 0,
      cgstamount: 0,
      totaltaxamountitem: 0,
      taxableamount: 0,
      finalamount: 0,
      instruments: instruments
    };

    setItems(prev => [...prev, newItem]);
  };

  // PHP: function calculateamount(my_code, vendor_code, state_code, obj = null)
  const calculateItemAmount = (itemId, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };

        // Calculate amount
        const qty = parseFloat(updatedItem.quantity) || 0;
        const rate = parseFloat(updatedItem.price) || 0;
        const finalamount = qty * rate;
        updatedItem.amount = finalamount;

        // Calculate discount
        const discountpercent = parseFloat(updatedItem.discountperitem) || 0;
        const discountamount = (finalamount / 100) * discountpercent;
        updatedItem.discamount = discountamount;

        // Calculate taxable amount
        const taxableamount = finalamount - discountamount;
        updatedItem.taxableamount = taxableamount;

        // Calculate tax (simplified GST logic)
        const tax_rate = parseFloat(updatedItem.tax_rate) || 0;
        let cgstamount = 0, sgstamount = 0, igstamount = 0;
        let totaltaxamount = 0;

        // Simplified tax calculation (would match PHP logic with GST codes)
        if (vendorData && vendorData.gst_state_code === "MP") { // Same state
          const taxRateHalf = tax_rate / 2;
          cgstamount = (taxableamount * taxRateHalf) / 100;
          sgstamount = (taxableamount * taxRateHalf) / 100;
          updatedItem.cgstper = taxRateHalf;
          updatedItem.sgstper = taxRateHalf;
          updatedItem.cgstamount = cgstamount;
          updatedItem.sgstamount = sgstamount;
          totaltaxamount = cgstamount + sgstamount;
        } else { // Different state
          igstamount = (taxableamount * tax_rate) / 100;
          updatedItem.igstper = tax_rate;
          updatedItem.igstamount = igstamount;
          totaltaxamount = igstamount;
        }

        updatedItem.totaltaxamountitem = totaltaxamount;
        updatedItem.finalamount = taxableamount + totaltaxamount;

        return updatedItem;
      }
      return item;
    }));

    // Recalculate totals
    calculateTotals();
  };

  // PHP: function sumamount()
  const calculateTotals = () => {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let discount = 0;

    items.forEach(item => {
      subtotal += parseFloat(item.amount) || 0;
      cgst += parseFloat(item.cgstamount) || 0;
      sgst += parseFloat(item.sgstamount) || 0;
      igst += parseFloat(item.igstamount) || 0;
      discount += parseFloat(item.discamount) || 0;
    });

    const totalafterdisc = subtotal - discount;

    // Calculate additional charges tax (18% GST)
    const packchrgs = parseFloat(taxCalculations.packaginchrgs) || 0;
    const freightchrgs = parseFloat(taxCalculations.freightchrgs) || 0;
    const insurancechrgs = parseFloat(taxCalculations.insurancechrgs) || 0;
    const calibrationchrgs = parseFloat(taxCalculations.calibrationchrgs) || 0;
    const trainingchrgs = parseFloat(taxCalculations.trainingchrgs) || 0;

    const additionalCharges = packchrgs + freightchrgs + insurancechrgs + calibrationchrgs + trainingchrgs;
    const additionalChargesTax = (additionalCharges * 18) / 100;

    const totaltaxamount = cgst + sgst + igst + additionalChargesTax;
    const customdutychrgs = parseFloat(taxCalculations.customdutychrgs) || 0;
    const totalamount = totalafterdisc + totaltaxamount + additionalCharges + customdutychrgs;

    const finaltotal = Math.round(totalamount);
    const roundoff = finaltotal - totalamount;

    setTaxCalculations(prev => ({
      ...prev,
      subtotal,
      discount,
      totalafterdisc,
      totaltaxamount,
      cgsttotal: cgst,
      sgsttotal: sgst,
      igsttotal: igst,
      totalamount,
      roundoff,
      finaltotal
    }));
  };

  // PHP: Additional charges change handlers
  const handleAdditionalChargeChange = (field, value) => {
    setTaxCalculations(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    calculateTotals();
  };

  // Remove item
  const removeItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setTimeout(calculateTotals, 0);
  };

  // PHP: Form submission
  // PHP: sendForm('', '', 'insert_purchase_order.php', 'resultid', 'purchaseorderadd');
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("No Item is Added");
      return;
    }

    if (!formData.ordertype) {
      toast.error("Please select order type (PO/WO)");
      return;
    }

    if (!formData.customer_id) {
      toast.error("Please select a supplier");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        items: items,
        taxCalculations: taxCalculations
      };

      const response = await axios.post("/inventory/insert-purchase-order", payload);

      if (response.data.status) {
        toast.success("Purchase Order created successfully");
        navigate("/dashboards/inventory/purchase-order");
      } else {
        toast.error(response.data.message || "Failed to create purchase order");
      }
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Something went wrong while creating purchase order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboards/inventory/purchase-order");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Page title="Add Purchase Order">
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
    <Page title="Add Purchase Order">
      <div className="row">
        <div className="col-12 purchase-order-add">
          <div className="card card-default">
            <div className="card-header">
              <h3 className="card-title">Add Purchase Order/Work Order</h3>
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

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="card-body">
                <div className="form-group row">
                  <label className="col-sm-7 col-form-label text-right">Date: </label>
                  <div className="col-sm-5">
                    <Input
                      type="text"
                      value={formData.date}
                      readOnly
                      className="form-control"
                      name="date"
                    />
                  </div>
                </div>

                <div id="wopocode">
                  <div className="form-group row">
                    <label className="col-sm-7 col-form-label text-right">PO No.</label>
                    <div className="col-sm-5">
                      <Input
                        type="text"
                        disabled
                        value={formData.po_number}
                        className="form-control"
                        name="po_number"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Currency</label>
                      <div className="col-sm-12">
                        <select
                          value={formData.currency}
                          onChange={(e) => handleInputChange("currency", e.target.value)}
                          className="form-control"
                          name="currency"
                          required
                        >
                          <option value="">Select Currency</option>
                          {currencies.map(currency => (
                            <option key={currency.id} value={currency.id}>
                              {currency.name} {currency.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">PO/WO</label>
                      <div className="col-sm-12">
                        <select
                          value={formData.ordertype}
                          onChange={(e) => handleInputChange("ordertype", e.target.value)}
                          className="form-control"
                          name="ordertype"
                          required
                        >
                          <option value="">Select Order type</option>
                          <option value="PO">PO</option>
                          <option value="WO">WO</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Business Name</label>
                      <div className="col-sm-12">
                        <select
                          value={formData.customer_id}
                          onChange={(e) => handleSupplierChange(e.target.value)}
                          className="form-control"
                          name="customer_id"
                        >
                          <option value="">Choose One..</option>
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.company}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">*Billed and Consign To:</label>
                      <div className="col-sm-12">
                        <textarea
                          value={formData.bill_and_consign_to}
                          onChange={(e) => handleInputChange("bill_and_consign_to", e.target.value)}
                          style={{ resize: "none", height: "150px" }}
                          className="form-control"
                          name="bill_and_consign_to"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Delivery Terms:</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={formData.delivery_terms}
                          onChange={(e) => handleInputChange("delivery_terms", e.target.value)}
                          className="form-control"
                          name="delivery_terms"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Payment Terms:</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={formData.payment_terms}
                          onChange={(e) => handleInputChange("payment_terms", e.target.value)}
                          className="form-control"
                          name="payment_terms"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Quotation Date:</label>
                      <div className="col-sm-12">
                        <Input
                          type="date"
                          value={formData.quotationdate}
                          onChange={(e) => handleInputChange("quotationdate", e.target.value)}
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
                          value={formData.quotationno}
                          onChange={(e) => handleInputChange("quotationno", e.target.value)}
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
                          value={formData.warranty}
                          onChange={(e) => handleInputChange("warranty", e.target.value)}
                          className="form-control"
                          name="warranty"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Jurisdiction :</label>
                      <div className="col-sm-12">
                        <Input
                          type="text"
                          value={formData.jurisdiction}
                          onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                          className="form-control"
                          name="jurisdiction"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-12 col-form-label">Other Detail :</label>
                      <div className="col-sm-12">
                        <textarea
                          value={formData.otherdetails}
                          onChange={(e) => handleInputChange("otherdetails", e.target.value)}
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

                  <table className="table table-responsive table-hover text-center table-bordered">
                    <thead>
                      <tr>
                        <td>S.no</td>
                        <td>Instrument details</td>
                        <td>Specification</td>
                        <td>Quantity</td>
                        <td>Unit</td>
                        <td>Currency</td>
                        <td>Amount</td>
                        <td>Discount%</td>
                        <td>Tax Rate</td>
                        <td>IGST</td>
                        <td>CGST</td>
                        <td>SGST</td>
                        <td>Total Tax</td>
                        <td>Taxable</td>
                        <td>Total</td>
                        <td style={{ width: "5%" }}>Close</td>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className="item-class itemrow">
                          <td className="s_no">{index + 1}</td>
                          <td>
                            <div>
                              HSN/SAC:
                              <Input
                                type="text"
                                value={item.hsn_code}
                                onChange={(e) => calculateItemAmount(item.id, "hsn_code", e.target.value)}
                                className="form-control hsn"
                                name="hsn_code[]"
                              />
                            </div>
                            <div>
                              Name:
                              <Input
                                type="text"
                                value={item.itemname}
                                onChange={(e) => calculateItemAmount(item.id, "itemname", e.target.value)}
                                className="form-control"
                                name="itemname[]"
                              />
                            </div>
                            <div>
                              Price:
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => calculateItemAmount(item.id, "price", e.target.value)}
                                step="any"
                                className="form-control price_class"
                                name="price[]"
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.specification}
                              onChange={(e) => calculateItemAmount(item.id, "specification", e.target.value)}
                              className="form-control"
                              name="specification[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => calculateItemAmount(item.id, "quantity", e.target.value)}
                              step="any"
                              className="form-control qty"
                              name="quantity[]"
                              min="1"
                              required
                            />
                          </td>
                          <td>
                            <select
                              value={item.unit}
                              onChange={(e) => calculateItemAmount(item.id, "unit", e.target.value)}
                              className="form-control"
                              name="unit[]"
                            >
                              <option value="">Select Unit</option>
                              {units.map(unit => (
                                <option key={unit.id} value={unit.id}>
                                  {unit.name} ({unit.description})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={currencies.find(c => c.id === item.currency)?.name + " " + currencies.find(c => c.id === item.currency)?.description || ""}
                              readOnly
                              className="form-control"
                            />
                            <Input
                              type="hidden"
                              value={item.currency}
                              name="currency[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={item.amount}
                              readOnly
                              step="any"
                              className="form-control amount_class"
                              name="list_price[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={item.discountperitem}
                              onChange={(e) => calculateItemAmount(item.id, "discountperitem", e.target.value)}
                              step="any"
                              className="form-control discount_class"
                              name="discountperitem[]"
                            />
                            <Input
                              type="hidden"
                              value={item.discamount}
                              name="discamount[]"
                              readOnly
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              value={item.tax_rate}
                              onChange={(e) => calculateItemAmount(item.id, "tax_rate", e.target.value)}
                              className="form-control tax_class"
                              name="tax_rate[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.igstper}
                              className="form-control igst"
                              readOnly
                              name="igstper[]"
                            />
                            <Input
                              type="text"
                              value={item.igstamount}
                              className="form-control igstamount"
                              readOnly
                              name="igstamount[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.sgstper}
                              className="form-control sgst"
                              readOnly
                              name="sgstper[]"
                            />
                            <Input
                              type="text"
                              value={item.sgstamount}
                              className="form-control sgstamount"
                              readOnly
                              name="sgstamount[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.cgstper}
                              className="form-control cgst"
                              readOnly
                              name="cgstper[]"
                            />
                            <Input
                              type="text"
                              value={item.cgstamount}
                              className="form-control cgstamount"
                              readOnly
                              name="cgstamount[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.totaltaxamountitem}
                              className="form-control totaltaxamountitem"
                              readOnly
                              name="totaltaxamountitem[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.taxableamount}
                              className="form-control taxableamount"
                              readOnly
                              name="taxableamount[]"
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={item.finalamount}
                              className="form-control finalamount"
                              readOnly
                              name="finalamount[]"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-sm btn-danger"
                              onClick={() => removeItem(item.id)}
                            >
                              <i className="fa fa-times" aria-hidden="true"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="float-right mt-3 tax-detail" style={{ display: items.length > 0 ? "block" : "none" }}>
                    <div className="row">
                      <label className="col-md-10 text-right">Total Item Amount</label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.subtotal}
                          readOnly
                          className="form-control"
                          name="subtotal"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-10 text-right">Discount</label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.discount}
                          readOnly
                          className="form-control"
                          name="discount"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Total After Discount Value</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.totalafterdisc}
                          readOnly
                          className="form-control"
                          name="totalafterdisc"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Packing & Forwarding Charges</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.packaginchrgs}
                          onChange={(e) => handleAdditionalChargeChange("packaginchrgs", e.target.value)}
                          className="form-control"
                          name="packaginchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Freight Charges</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.freightchrgs}
                          onChange={(e) => handleAdditionalChargeChange("freightchrgs", e.target.value)}
                          className="form-control"
                          name="freightchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Insurance charges</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.insurancechrgs}
                          onChange={(e) => handleAdditionalChargeChange("insurancechrgs", e.target.value)}
                          className="form-control"
                          name="insurancechrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Calibration Certificate Charges</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.calibrationchrgs}
                          onChange={(e) => handleAdditionalChargeChange("calibrationchrgs", e.target.value)}
                          className="form-control"
                          name="calibrationchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Installation,Demonstration&Training Charges</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.trainingchrgs}
                          onChange={(e) => handleAdditionalChargeChange("trainingchrgs", e.target.value)}
                          className="form-control"
                          name="trainingchrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Import /Custom Duty Charges</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.customdutychrgs}
                          onChange={(e) => handleAdditionalChargeChange("customdutychrgs", e.target.value)}
                          className="form-control"
                          name="customdutychrgs"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">Total Tax Value</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.totaltaxamount}
                          readOnly
                          className="form-control"
                          name="totaltaxamount"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">CGST Total</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.cgsttotal}
                          readOnly
                          className="form-control"
                          name="cgst"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">SGST Total</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.sgsttotal}
                          readOnly
                          className="form-control"
                          name="sgst"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 text-right">IGST Total</div>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.igsttotal}
                          readOnly
                          className="form-control"
                          name="igst"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-10 text-right">Total Invoice Amount</label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.totalamount}
                          readOnly
                          className="form-control"
                          name="totalinvoiceamount"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-10 text-right">Round Off</label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.roundoff}
                          readOnly
                          className="form-control"
                          name="roundoff"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <label className="col-md-10 text-right">Total</label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          value={taxCalculations.finaltotal}
                          readOnly
                          className="form-control"
                          name="finaltotal"
                          required
                        />
                      </div>
                    </div>
                  </div>
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

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-bordered th,
        .table-bordered td {
          border: 1px solid #ddd;
          padding: 8px;
        }

        .table-hover tbody tr:hover {
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

        .col-sm-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-sm-7 {
          flex: 0 0 58.333333%;
          max-width: 58.333333%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-sm-5 {
          flex: 0 0 41.666667%;
          max-width: 41.666667%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-sm-12 {
          flex: 0 0 100%;
          max-width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-md-10 {
          flex: 0 0 83.333333%;
          max-width: 83.333333%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-md-2 {
          flex: 0 0 16.666667%;
          max-width: 16.666667%;
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