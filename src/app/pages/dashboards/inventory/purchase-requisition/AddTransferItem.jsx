// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Input } from "components/ui";

// ----------------------------------------------------------------------
// PHP: $indentid = $_GET["hakuna"];
// PHP: $resultitem = $obj->selectfieldwhere("indent_requirement","group_concat(subcategory_id)","indent_id=$indentid and remainingqty>0 and status = 2");
// PHP: $join = "inner join materiallocation on materiallocation.mminstid = mminstrument.id";
// PHP: $indentitem = "and type in ($resultitem) and materiallocation.instrumentlocation = 24 and materiallocation.status = 1";

export default function AddTransferItem() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const indentId = searchParams.get("hakuna"); // PHP: $_GET["hakuna"]

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    item_name: "",
    item_location: "",
    qty: ""
  });

  // PHP: Fetch items based on indent or all items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        let url = "/inventory/instruments";
        if (indentId) {
          // PHP: $resultitem = $obj->selectfieldwhere("indent_requirement","group_concat(subcategory_id)","indent_id=$indentid and remainingqty>0 and status = 2");
          url = `/inventory/instruments?indent_id=${indentId}&remaining_qty=true&status=2`;
        }
        
        const response = await axios.get(url);
        if (response.data.status) {
          setItems(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Something went wrong while loading items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [indentId]);

  // PHP: onchange="search(this.id,'instrument-location','fetch_instrument_location.php','0&matata=<?= $indentid ?>')"
  const handleItemChange = async (itemId) => {
    setFormData(prev => ({ ...prev, item_name: itemId, item_location: "", qty: "" }));
    setLocations([]);

    if (!itemId) {
      return;
    }

    try {
      // PHP: 'fetch_instrument_location.php','0&matata=<?= $indentid ?>'
      const url = indentId 
        ? `/inventory/instrument-locations/${itemId}?indent_id=${indentId}`
        : `/inventory/instrument-locations/${itemId}`;
      
      const response = await axios.get(url);
      if (response.data.status) {
        setLocations(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Something went wrong while loading locations");
    }
  };

  // PHP: Form submission
  // PHP: sendForm('', '', 'insert_transfer_item.php', 'resultid', 'addtransferitem');
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.item_name) {
      toast.error("Please select an item");
      return;
    }

    if (!formData.item_location) {
      toast.error("Please select a location");
      return;
    }

    if (!formData.qty || parseFloat(formData.qty) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        item_name: formData.item_name,
        item_location: formData.item_location,
        qty: formData.qty,
        indent_id: indentId || null
      };

      const response = await axios.post("/inventory/insert-transfer-item", payload);
      
      if (response.data.status) {
        toast.success("Item transferred successfully");
        
        // Navigate back based on context
        if (indentId) {
          navigate("/dashboards/inventory/purchase-requisition");
        } else {
          navigate("/dashboards/inventory/transfer-item");
        }
      } else {
        toast.error(response.data.message || "Failed to transfer item");
      }
    } catch (error) {
      console.error("Error transferring item:", error);
      toast.error("Something went wrong while transferring item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (indentId) {
      navigate("/dashboards/inventory/purchase-requisition");
    } else {
      navigate("/dashboards/inventory/transfer-item");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Page title="Transfer Item">
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
    <Page title="Transfer Item">
      <div className="row">
        <div className="col-12">
          <div className="card card-default">
            <div className="card-header">
              <h3 className="card-title">Transfer Item</h3>
              <div className="card-tools">
                {/* PHP: if(isset($_GET["hakuna"])){ ?>
                    <a href="view_indent.php" class="btn btn-default" data-card-widget="">
                    << Back </a><?php } else{ ?>    
                <a href="transfer_item.php" class="btn btn-default" data-card-widget="">
                    << Back </a>
                    <?php } */}
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

            {/* PHP: <form data-bvalidator-validate data-bvalidator-theme="gray" id="addtransferitem" onsubmit="event.preventDefault();sendForm('', '', 'insert_transfer_item.php', 'resultid', 'addtransferitem');return 0;"> */}
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="item_name">Select Item</label>
                  <select
                    value={formData.item_name}
                    onChange={(e) => handleItemChange(e.target.value)}
                    id="item_name"
                    className="form-control"
                    style={{ width: "100%" }}
                    required
                  >
                    <option value="">Choose Item to Transfer</option>
                    {/* PHP: $mminstrument = $obj->selectextrawhereupdate("mminstrument $join", "mminstrument.id,name,idno", "mminstrument.status= 1 $indentitem"); */}
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.idno}
                      </option>
                    ))}
                  </select>
                </div>

                <div id="instrument-location">
                  {formData.item_name && (
                    <>
                      <div className="form-group">
                        <label htmlFor="item_location">Select Location</label>
                        <select
                          value={formData.item_location}
                          onChange={(e) => handleInputChange("item_location", e.target.value)}
                          id="item_location"
                          className="form-control"
                          style={{ width: "100%" }}
                          required
                        >
                          <option value="">Select Location</option>
                          {locations.map(location => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="qty">Select Quantity</label>
                        <Input
                          type="text"
                          value={formData.qty}
                          onChange={(e) => handleInputChange("qty", e.target.value)}
                          name="qty"
                          className="form-control"
                          placeholder="Enter quantity"
                          required
                        />
                      </div>
                    </>
                  )}
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
                <div id="resultid" className="form-result"></div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
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

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
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

        .btn-tool {
          background-color: transparent;
          border: none;
          color: #6c757d;
        }

        .btn:hover {
          opacity: 0.8;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }

        .col-12 {
          flex: 0 0 100%;
          max-width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .form-result {
          margin-top: 1rem;
        }
      `}</style>
    </Page>
  );
}