import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "utils/axios";
import toast, { Toaster } from "react-hot-toast";
import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
import { MenuAction } from "./MenuActions";
// import { TableConfig } from "./TableConfig";
// import {
//   Popover,
//   PopoverButton,
//   PopoverPanel,
//   Transition,
// } from "@headlessui/react";
// import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";
// import { TableSettings } from "components/shared/table/TableSettings";

const ViewVerificationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    department: "",
    referenceStandard: "",
    equipmentName: "",
    make: "",
    model: "",
    qfNo: "",
    issueNo: "",
    issueDate: "",
    revisionNo: "",
    revisionDate: "",
    page: "1 of 1",
  });
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [parameters, setParameters] = useState([]);
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    if (id) {
      fetchVerificationData();
    }
  }, [id]);

  const fetchVerificationData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/material/view-verfication-list/${id}`);

      console.log("✅ Verification data loaded:", response.data);

      if (response.data.status) {
        const data = response.data.data;

        // Map API data to form state
        setFormData({
          date: data.instrument?.date || "",
          department: data.instrument?.department || "",
          referenceStandard: "",
          equipmentName: data.instrument?.name || "",
          make: data.instrument?.make || "",
          model: data.instrument?.model || "",
          qfNo: data.header?.qf_no || "",
          issueNo: data.header?.issue_no || "",
          issueDate: data.header?.issue_date || "",
          revisionNo: data.header?.revision_no || "",
          revisionDate: data.header?.revision_date || "",
          page: "1 of 1",
        });

        setAcceptanceCriteria(data.acceptance_criteria || "");
        setParameters(data.parameters || []);
        setVerification(data.verification || null);
        setError(null);
      } else {
        setError("Failed to load verification data");
        toast.error("Failed to load verification data");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch verification data";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("❌ Error fetching verification data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
          <div className="text-lg text-gray-600">
            Loading verification form...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md p-6 text-center">
          <div className="mb-4 text-5xl text-red-500">⚠️</div>
          <div className="mb-4 text-lg text-red-600">{error}</div>
          <Button
            onClick={() =>
              navigate(
                "/dashboards/material-list/electro-technical/verification-list",
              )
            }
            className="bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl bg-white p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Verification Form</h1>
          <Button
            className="rounded bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
            onClick={() =>
              navigate(
                "/dashboards/material-list/electro-technical/verification-list",
              )
            }
          >
            Verification list
          </Button>
        </div>

        {/* Search and Actions Section */}
        <div className="mb-4 flex items-center justify-between">
          <CollapsibleSearch
            placeholder="Search verification forms..."
            onSearch={(searchTerm) => console.log("Search:", searchTerm)}
          />
          <MenuAction>
            <Button variant="secondary" size="sm">
              Export PDF
            </Button>
            <Button variant="secondary" size="sm">
              Print Form
            </Button>
            <Button variant="primary" size="sm">
              Save Form
            </Button>
          </MenuAction>
        </div>

        {/* Main Content Table */}
        <div className="border border-gray-400">
          {/* Header Section with Logo and Title */}
          <div className="border-b border-gray-400">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/4 border-r border-gray-400 p-4 align-top">
                    {/* Logo Section */}
                    <div className="mb-4">
                      <img
                        src="/images/logo.png"
                        alt="KTRC Logo"
                        className="h-20 w-32 object-contain"
                      />
                    </div>
                    <div className="text-xs leading-tight text-gray-700">
                      <div className="font-medium">Quality Audit & Control</div>
                      <div>Kailash Test And Research Centre Pvt. Ltd.</div>
                    </div>
                  </td>
                  <td className="border-r border-gray-400 p-4 text-center align-middle">
                    <h2 className="text-lg font-bold text-gray-800">
                      Verification of Equipment
                    </h2>
                  </td>
                  <td className="w-1/4 p-4">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-300">
                          <td className="py-1 font-medium text-gray-700">
                            QF. No.
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={formData.qfNo}
                              onChange={(e) =>
                                handleInputChange("qfNo", e.target.value)
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-1 font-medium text-gray-700">
                            Issue No.
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={formData.issueNo}
                              onChange={(e) =>
                                handleInputChange("issueNo", e.target.value)
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-1 font-medium text-gray-700">
                            Issue Date
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={formData.issueDate}
                              onChange={(e) =>
                                handleInputChange("issueDate", e.target.value)
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-1 font-medium text-gray-700">
                            Revision No.
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={formData.revisionNo}
                              onChange={(e) =>
                                handleInputChange("revisionNo", e.target.value)
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-1 font-medium text-gray-700">
                            Revision Date
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={formData.revisionDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "revisionDate",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium text-gray-700">
                            Page
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={formData.page}
                              onChange={(e) =>
                                handleInputChange("page", e.target.value)
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Form Fields Section */}
          <div className="border-b border-gray-400">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/6 border-r border-gray-400 bg-gray-50 p-3 font-medium text-gray-700">
                    Date
                  </td>
                  <td className="w-1/3 border-r border-gray-400 p-3">
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="w-1/6 border-r border-gray-400 bg-gray-50 p-3 font-medium text-gray-700">
                    Equipment Name
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={formData.equipmentName}
                      onChange={(e) =>
                        handleInputChange("equipmentName", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-400">
                  <td className="border-r border-gray-400 bg-gray-50 p-3 font-medium text-gray-700">
                    Department
                  </td>
                  <td className="border-r border-gray-400 p-3">
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder=""
                    />
                  </td>
                  <td className="border-r border-gray-400 bg-gray-50 p-3 font-medium text-gray-700">
                    Make
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) =>
                        handleInputChange("make", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
                <tr className="border-t border-gray-400">
                  <td className="border-r border-gray-400 bg-gray-50 p-3 font-medium text-gray-700">
                    Any Reference Standard
                  </td>
                  <td className="border-r border-gray-400 p-3">
                    <input
                      type="text"
                      value={formData.referenceStandard}
                      onChange={(e) =>
                        handleInputChange("referenceStandard", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder=""
                    />
                  </td>
                  <td className="border-r border-gray-400 bg-gray-50 p-3 font-medium text-gray-700">
                    Model
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        handleInputChange("model", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Acceptance Criteria Section */}
          <div className="border-b border-gray-400 bg-gray-50 p-4 text-center">
            <h3 className="font-bold text-gray-800">
              ACCEPTANCE CRITERIA (
              {acceptanceCriteria || "As per KTRC/QF/0604/01"})
            </h3>
          </div>

          {/* Parameters Table with TableConfig */}
          <div className="relative">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-r border-gray-400 p-3 text-left font-bold text-gray-800">
                    S.No.
                  </th>
                  <th className="border-r border-gray-400 p-3 text-left font-bold text-gray-800">
                    PARAMETER
                  </th>
                  <th className="border-r border-gray-400 p-3 text-left font-bold text-gray-800">
                    OUR REQUIREMENT
                  </th>
                  <th className="border-r border-gray-400 p-3 text-left font-bold text-gray-800">
                    EQUIPMENT RECEIVED
                  </th>
                  <th className="border-r border-gray-400 p-3 text-left font-bold text-gray-800">
                    REMARKS
                  </th>
                  <th className="p-3 pr-12 text-left font-bold text-gray-800">
                    VERIFYING ENGINEER
                  </th>
                </tr>
              </thead>
              <tbody>
                {parameters && parameters.length > 0
                  ? parameters.map((param, index) => (
                      <tr key={index} className="border-t border-gray-400">
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            value={index + 1}
                            readOnly
                            className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            value={param.parameter || ""}
                            readOnly
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            value={param.our_requirement || ""}
                            readOnly
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            value={param.equipment_received || ""}
                            readOnly
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            value={param.remarks || ""}
                            readOnly
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={param.verifying_engineer || ""}
                            readOnly
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                      </tr>
                    ))
                  : [1, 2, 3, 4, 5].map((index) => (
                      <tr key={index} className="border-t border-gray-400">
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border-r border-gray-400 p-3">
                          <input
                            type="text"
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="border-t border-gray-400 p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="mb-2 font-medium text-gray-700">
                  Verified: {verification?.status || "OK / Not OK"}
                </div>
                <div className="h-16 rounded border border-gray-300 p-2"></div>
              </div>
              <div>
                <div className="mb-2 font-medium text-gray-700">DTM</div>
                <div className="h-16 rounded border border-gray-300 p-2"></div>
              </div>
              <div>
                <div className="mb-2 font-medium text-gray-700">
                  Name & Signature
                </div>
                <div className="h-16 rounded border border-gray-300 p-2"></div>
              </div>
            </div>

            {verification?.verified_by && (
              <div className="mt-4 text-sm">
                <div className="mb-2 font-medium text-gray-700">
                  {verification.verified_by}
                </div>
                {verification.signature_url && (
                  <img
                    src={verification.signature_url}
                    alt="Signature"
                    className="mb-2 max-w-xs"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Electronically signed by</div>
                  <div>{verification.verified_by}</div>
                  <div>Date: {formData.date}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Number */}
        <div className="mt-2 text-right text-sm text-gray-600">99</div>
      </div>
    </>
  );
};

export default ViewVerificationForm;
