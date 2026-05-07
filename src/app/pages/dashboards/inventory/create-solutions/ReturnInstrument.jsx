// Import Dependencies
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function usePermissions() {
    const p = localStorage.getItem("userPermissions");
    try {
        return JSON.parse(p) || [];
    } catch {
        return p?.split(",").map(Number) || [];
    }
}

export default function ReturnInstrument() {
    const permissions = usePermissions();
    const navigate = useNavigate();
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            purpose: "",
            returnby: "",
            inwarddinid: "",
            trfdinid: "",
            dinid: "",
        }
    });

    const [loading, setLoading] = useState(false);
    const [purposes, setPurposes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [inwardDins, setInwardDins] = useState([]);
    const [trfDins, setTrfDins] = useState([]);
    const [masterDins, setMasterDins] = useState([]);
    const [issueItems, setIssueItems] = useState(""); // This will hold the HTML or component data from AJAX

    const purpose = watch("purpose");

    useEffect(() => {
        setIssueItems("");
    }, [purpose]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [purpRes, empRes, inwardRes, trfRes, masterRes] = await Promise.all([
                axios.get("inventory/din-purpose-data"), // Assuming these endpoints exist
                axios.get("hrm/employee-list-data"),
                axios.get("inventory/din-list-data", { params: { purpose: 7, status: 1 } }),
                axios.get("inventory/din-list-data", { params: { purpose: 6, status: 1 } }),
                axios.get("inventory/din-list-data", { params: { purpose: '1,2,3,4,5', status: 1, has_issued_items: true } })
            ]);

            if (purpRes.data.status) {
                setPurposes(purpRes.data.data.filter(p => ![8, 9, 10, 11].includes(p.id)));
            }
            if (empRes.data.status) {
                setEmployees(empRes.data.data);
            }
            if (inwardRes.data.status) {
                setInwardDins(inwardRes.data.data);
            }
            if (trfRes.data.status) {
                setTrfDins(trfRes.data.data);
            }
            if (masterRes.data.status) {
                setMasterDins(masterRes.data.data);
            }
        } catch (err) {
            console.error("Error fetching initial data:", err);
        }
    };

    const handleDinChange = async (dinId) => {
        if (!dinId) {
            setIssueItems("");
            return;
        }
        try {
            const response = await axios.get("inventory/return-inst-data", { params: { hakuna: dinId } });
            if (response.data.status) {
                setIssueItems(response.data.html || ""); // PHP used AJAX to load HTML
            }
        } catch (err) {
            console.error("Error fetching issue items:", err);
        }
    };

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            const response = await axios.post("inventory/insert-instrument-return", formData);
            if (response.data.status) {
                toast.success(response.data.message || "Return submitted successfully");
                navigate("/dashboards/inventory/dispatch-return");
            } else {
                toast.error(response.data.message || "Failed to submit return");
            }
        } catch {
            toast.error("An error occurred while submitting the return");
        } finally {
            setLoading(false);
        }
    };

    if (!permissions.includes(316)) {
        return (
            <Page title="Dispatch Return">
                <div className="flex h-60 items-center justify-center rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Access Denied - Permission 316 required
                    </p>
                </div>
            </Page>
        );
    }

    return (
        <Page title="Dispatch Return">
            <Card className="flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-dark-500 sm:p-5">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-dark-100">
                        Return
                    </h3>
                    <Button
                        component={Link}
                        to="/dashboards/inventory/dispatch-return"
                        color="info"
                        size="sm"
                    >
                        {"<< Back to Record List"}
                    </Button>
                </div>
                <div className="p-4 sm:p-5">
                    <form id="returninhouse" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Controller
                                    name="purpose"
                                    control={control}
                                    rules={{ required: "Required" }}
                                    render={({ field, fieldState }) => (
                                        <Select
                                            {...field}
                                            id="purpose"
                                            label="Return From"
                                            options={purposes.map(p => ({ value: p.id, label: p.name }))}
                                            placeholder="Select"
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>

                            {[1, 2, 3, 4, 5].includes(Number(purpose)) && (
                                <div className="flex flex-col gap-2">
                                    <Controller
                                        name="returnby"
                                        control={control}
                                        rules={{ required: "Required" }}
                                        render={({ field, fieldState }) => (
                                            <Select
                                                {...field}
                                                id="returnby"
                                                label="Employee Name"
                                                options={employees.map(e => ({ value: e.id, label: `${e.firstname} ${e.lastname}` }))}
                                                placeholder="Select"
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        {purpose === "7" && (
                            <div className="flex flex-col gap-2 max-w-md">
                                <Controller
                                    name="inwarddinid"
                                    control={control}
                                    rules={{ required: "Required" }}
                                    render={({ field, fieldState }) => (
                                        <Select
                                            {...field}
                                            id="inwarddinid"
                                            label="Inward Din"
                                            options={inwardDins.map(d => ({ value: d.id, label: `${d.id} ${d.customername} (${d.challanno})` }))}
                                            placeholder="Select"
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {purpose === "6" && (
                            <div className="flex flex-col gap-2 max-w-md">
                                <Controller
                                    name="trfdinid"
                                    control={control}
                                    rules={{ required: "Required" }}
                                    render={({ field, fieldState }) => (
                                        <Select
                                            {...field}
                                            id="trfdinid"
                                            label="TRF Din"
                                            options={trfDins.map(d => ({ value: d.id, label: `${d.id} ${d.customername} (${d.challanno})` }))}
                                            placeholder="Select"
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {[1, 2, 3, 4, 5].includes(Number(purpose)) && (
                            <div className="flex flex-col gap-2 max-w-md">
                                <Controller
                                    name="dinid"
                                    control={control}
                                    rules={{ required: "Required" }}
                                    render={({ field, fieldState }) => (
                                        <Select
                                            {...field}
                                            id="dinid"
                                            label="Din"
                                            options={masterDins.map(d => ({ value: d.id, label: `${d.id} ${d.customername} (${d.challanno})` }))}
                                            placeholder="Select"
                                            onChange={(val) => {
                                                field.onChange(val);
                                                handleDinChange(val);
                                            }}
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        <div
                            className="mt-6 border-t border-gray-100 pt-6"
                            dangerouslySetInnerHTML={{ __html: issueItems }}
                        />
                    </form>
                </div>
                <div className="flex justify-end border-t border-gray-100 p-4 sm:p-5">
                    <Button
                        type="submit"
                        color="success"
                        size="lg"
                        className="font-bold"
                        loading={loading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Submit
                    </Button>
                </div>
            </Card>
        </Page>
    );
}
