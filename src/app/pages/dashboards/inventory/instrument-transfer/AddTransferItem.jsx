// Import Dependencies
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "utils/axios";
import { toast } from "react-hot-toast";

// Local Imports
import {
  Card,
  Button,
  ReactSelect as Select,
} from "components/ui";
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function AddTransferItem() {
  const [searchParams] = useSearchParams();
  const indentId = searchParams.get("hakuna");
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      item_name: "",
      item_location: "",
      qty: "",
    }
  });

  const [loading, setLoading] = useState(false);
  const [instruments, setInstruments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationHtml, setLocationHtml] = useState(""); // If backend returns HTML for locations/qty


  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await axios.get("inventory/instrument-list-for-transfer", {
          params: { hakuna: indentId }
        });
        if (response.data.status) {
          setInstruments(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching instruments:", err);
      }
    };

    fetchInstruments();
  }, [indentId]);

  const handleItemChange = async (itemId) => {
    if (!itemId) {
      setLocations([]);
      setLocationHtml("");
      return;
    }
    try {
      // PHP: fetch_instrument_location.php with params 0 & matata = indentid
      const response = await axios.get("inventory/fetch-instrument-location", {
        params: {
          itemid: itemId,
          matata: indentId || 0
        }
      });

      if (response.data.status) {
        // If backend provides structured data
        if (response.data.locations) {
          setLocations(response.data.locations);
        }
        // If backend provides raw HTML (as in legacy PHP search function)
        if (response.data.html) {
          setLocationHtml(response.data.html);
        }
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post("inventory/insert-transfer-item", {
        ...formData,
        indentid: indentId
      });

      if (response.data.status) {
        toast.success(response.data.message || "Transfer successful");
        navigate("/dashboards/inventory/instrument-transfer");
      } else {
        toast.error(response.data.message || "Transfer failed");
      }
    } catch {
      toast.error("An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Transfer Item">
      <div className="transition-content w-full pb-5">
        <Card className="flex flex-col border-none shadow-soft dark:bg-dark-700">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-dark-500 sm:p-5">
            <h3 className="text-lg font-bold text-gray-800 dark:text-dark-100">
              Transfer Item
            </h3>
            <Button
              component={Link}
              to={indentId ? `/dashboards/inventory/view-indent?hakuna=${indentId}` : "/dashboards/inventory/instrument-transfer"}
              color="secondary"
              variant="outline"
              size="sm"
            >
              {"<< Back"}
            </Button>
          </div>

          <div className="p-4 sm:p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
              <div className="flex flex-col gap-2">
                <Controller
                  name="item_name"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      id="item_name"
                      label="Select Item"
                      placeholder="Choose Item to Transfer"
                      options={instruments.map(item => ({
                        value: item.id,
                        label: `${item.name} ${item.idno || ""}`
                      }))}
                      onChange={(val) => {
                        field.onChange(val);
                        handleItemChange(val);
                      }}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Dynamic Location and Quantity Section */}
              <div id="instrument-location" className="space-y-6">
                {locationHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: locationHtml }} />
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <Controller
                        name="item_location"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field, fieldState }) => (
                          <Select
                            {...field}
                            id="item_location"
                            label="Select Location"
                            placeholder="Select"
                            options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Quantity
                      </label>
                      <Controller
                        name="qty"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-100"
                          />
                        )}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-dark-600">
                <Button
                  type="submit"
                  color="primary"
                  loading={loading}
                  className="px-8"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </Page>
  );
}
