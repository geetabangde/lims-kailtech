import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "utils/axios";
import { toast } from "sonner";

// Import dependencies for PDF generation
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ExportBISRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    startdate: "",
    enddate: "",
    product: "",
    department: "",
    contactperson: "",
    specificpurpose: "",
  });

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters = {
      startdate: urlParams.get('startdate') || "",
      enddate: urlParams.get('enddate') || "",
      product: urlParams.get('product') || "",
      department: urlParams.get('department') || "",
      contactperson: urlParams.get('contactperson') || "",
      specificpurpose: urlParams.get('specificpurpose') || "",
    };
    setFilters(newFilters);
    fetchData(newFilters);
  }, []);

  // Fetch data for export matching PHP logic
  const fetchData = async (filterParams) => {
    try {
      setLoading(true);
      
      // Build search query matching PHP logic
      let searchQuery = "";
      if (filterParams.startdate && filterParams.enddate) {
        searchQuery += ` and trfs.date>='${filterParams.startdate}' and trfs.date<='${filterParams.enddate}'`;
      }
      if (filterParams.product) {
        searchQuery += ` and trfProducts.product='${filterParams.product}'`;
      }
      if (filterParams.department) {
        searchQuery += ` inner join packageparameters on packageparameters.package=trfProducts.package and packageparameters.department='${filterParams.department}'`;
      }
      if (filterParams.contactperson) {
        searchQuery += ` and customer-contact.name like '%${filterParams.contactperson}%'`;
      }
      if (filterParams.specificpurpose) {
        searchQuery += ` and trfs.specificpurpose like '%${filterParams.specificpurpose}%'`;
      }

      // Fetch data matching PHP query structure
      const res = await axios.get("/registers/trfProducts", {
        params: {
          search: searchQuery,
          join: "inner join trfs on trfProducts.trf=trfs.id inner join products on trfProducts.product=products.id inner join customer-contact on customer-contact.id=trfs.concernpersonname",
          fields: "trfs.date as tdate, trfProducts.testrequest, trfProducts.brand, trfProducts.qrcode, trfProducts.product, trfProducts.trf, trfProducts.id as id, trfProducts.brn as brn, trfProducts.lrn as lrn, customer-contact.name as concernperson, products.standard, products.name as productname, trfs.deadline as deadline, trfProducts.reportdate as reportdate, trfProducts.package as package, trfs.notes as remark",
          group_by: "trfProducts.id"
        }
      });

      if (res.data?.data) {
        const processedData = await Promise.all(
          res.data.data.map(async (row) => {
            // Get package details matching PHP logic
            const packageResult = await axios.get("/registers/packageparameters", {
              params: { package: row.package }
            });
            
            const parameters = packageResult.data?.data || [];
            const departments = [...new Set(parameters.map(p => p.department))];
            const paramIds = parameters.map(p => p.parameter).join(",");
            const deptIds = departments.join(",");
            
            // Get parameter names matching PHP logic
            let paramNames = "";
            if (paramIds) {
              const paramResult = await axios.get("/registers/parameters", {
                params: { 
                  id: paramIds,
                  fields: "group_concat(name) as names"
                }
              });
              paramNames = paramResult.data?.data?.[0]?.names || "";
            }
            
            // Get department names matching PHP logic
            let deptNames = "";
            if (deptIds) {
              const deptResult = await axios.get("/registers/labs", {
                params: { 
                  id: deptIds,
                  fields: "group_concat(distinct name) as names"
                }
              });
              deptNames = deptResult.data?.data?.[0]?.names || "";
            }
            
            // Get standard name matching PHP logic
            let standardName = "";
            if (row.standard) {
              const standardResult = await axios.get("/registers/standards", {
                params: { id: row.standard }
              });
              standardName = standardResult.data?.data?.[0]?.name || "";
            }
            
            // Get quantity details matching PHP logic
            let quantityDetails = "";
            if (row.package) {
              const quantityResult = await axios.get("/registers/packagequantity", {
                params: { package: row.package, status: 1 }
              });
              
              if (quantityResult.data?.data) {
                const quantityPromises = quantityResult.data.data.map(async q => {
                  const unitResult = await axios.get("/registers/units", {
                    params: { id: q.unit }
                  });
                  const unitName = unitResult.data?.data?.[0]?.name || "";
                  return `${q.name} ${q.quantity} ${unitName}`;
                });
                quantityDetails = (await Promise.all(quantityPromises)).join("<br/>");
              }
            }

            return {
              sno: row.id,
              tdate: row.tdate,
              lrn_brn: `${row.lrn || ""}/${row.brn || ""}`,
              testrequest: row.testrequest || "",
              brand: row.brand || "",
              qrcode: row.qrcode || "",
              concernperson: row.concernperson || "",
              productname: row.productname || "",
              quantity: quantityDetails,
              departments: deptNames,
              parameters: paramNames,
              reportdate: row.reportdate || "",
            };
          })
        );
        
        setData(processedData);
      }
    } catch (err) {
      console.error("Error fetching BIS export data:", err);
      toast.error("Failed to fetch data for export");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF matching PHP BIS structure
  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "letter"
      });

      // BIS Header matching PHP structure
      const headerData = [
        [
          { content: "", colSpan: 6, styles: { valign: "top" } },
          { content: "Sample /UUC Received Record and Department Sample Inward Register", colSpan: 6, styles: { halign: "center" } },
          { content: "QF. No.", colSpan: 3, styles: { halign: "left" } },
          { content: "COMPANY/QF/0704/01", colSpan: 3, styles: { halign: "left" } },
          { content: "Issue No.", colSpan: 3, styles: { halign: "left" } },
          { content: "01", colSpan: 3, styles: { halign: "left" } },
          { content: "Issue Date", colSpan: 3, styles: { halign: "left" } },
          { content: "01/06/2019", colSpan: 3, styles: { halign: "left" } },
          { content: "Revision No.", colSpan: 3, styles: { halign: "left" } },
          { content: "-", colSpan: 3, styles: { halign: "left" } },
          { content: "Revision Date", colSpan: 3, styles: { halign: "left" } },
          { content: "-", colSpan: 3, styles: { halign: "left" } },
          { content: "Page", colSpan: 3, styles: { halign: "left" } },
          { content: "", colSpan: 3, styles: { halign: "left" } }
        ]
      ];

      // Table headers matching PHP BIS structure
      const tableHeaders = [
        "S no",
        "Date of Receipt",
        "LRN/BRN",
        "Sample Code",
        "Branch Office",
        "Letter Ref No & date",
        "Billed to",
        "Nature Of Sample",
        "Indian Stanard",
        "Approx Recieved Quantity",
        "Department",
        "Tests",
        "Reporting Date"
      ];

      // Table data matching PHP structure
      const tableData = data.map((row, index) => [
        index + 1,
        formatDate(row.tdate),
        row.lrn_brn || "",
        row.testrequest || "",
        row.brand || "",
        row.qrcode || "",
        row.concernperson || "",
        row.productname || "",
        "", // Indian Standard - would need additional API call
        row.quantity || "",
        row.departments || "",
        row.parameters || "",
        formatDate(row.reportdate)
      ]);

      // Footer data matching PHP
      const footerData = [
        ["Prepared by", "Reviewed by", "Approved by"],
        ["Sr. Engineer", "DTM", "TM"],
        ["Name:", "Name:", "Name:"],
        ["Sign:", "Sign:", "Sign:"]
      ];

      // Add header
      doc.setFontSize(10);
      headerData.forEach(row => {
        if (row.content) {
          doc.text(row.content, doc.internal.pageSize.width / 2, 20, { align: row.styles?.halign || "left" });
        }
      });

      // Add table
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: 70,
        theme: 'grid',
        styles: {
          head: { fillColor: [200, 200, 200], textColor: 0, fontStyle: 'bold' },
          body: { textColor: 0 }
        },
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: 0,
          fontStyle: 'bold'
        }
      });

      // Add footer
      const finalY = doc.internal.pageSize.height - 70;
      doc.setFontSize(10);
      footerData.forEach((row, index) => {
        const x = (doc.internal.pageSize.width / 3) * index;
        doc.text(row[0], x, finalY, { align: "left" });
        doc.text(row[1], x, finalY + 15, { align: "left" });
        doc.text(row[2], x, finalY + 30, { align: "left" });
      });

      // Add date at bottom
      doc.setFontSize(11);
      doc.text(`Date: ${formatDate(new Date())}`, doc.internal.pageSize.width / 2, finalY + 50, { align: "right" });

      // Save PDF
      doc.save("bis_sample_inward.pdf");
      
    } catch (err) {
      console.error("Error generating BIS PDF:", err);
      toast.error("Failed to generate PDF");
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-3 text-gray-500">
        <svg className="h-7 w-7 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z" />
        </svg>
        <div className="mt-2">Generating BIS PDF...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">BIS Sample Inward Register Export</h1>
            <p className="text-gray-600 mb-4">Generate PDF export of BIS sample inward register data.</p>
          </div>

          {/* Current Filters Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Current Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <div className="mt-1 p-2 bg-white border border-gray-300 rounded-md">
                  {filters.startdate || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="mt-1 p-2 bg-white border border-gray-300 rounded-md">
                  {filters.enddate || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <div className="mt-1 p-2 bg-white border border-gray-300 rounded-md">
                  {filters.product || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <div className="mt-1 p-2 bg-white border border-gray-300 rounded-md">
                  {filters.department || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <div className="mt-1 p-2 bg-white border border-gray-300 rounded-md">
                  {filters.contactperson || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specific Purpose</label>
                <div className="mt-1 p-2 bg-white border border-gray-300 rounded-md">
                  {filters.specificpurpose || "Not set"}
                </div>
              </div>
            </div>
          </div>

          {/* Data Preview */}
          {data.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Data Preview ({data.length} records)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["S no", "Date of Receipt", "LRN/BRN", "Sample Code", "Branch Office", "Letter Ref", "Billed to", "Nature", "Standard", "Quantity", "Department", "Tests", "Reporting Date"].map(header => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.slice(0, 5).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(row.tdate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.lrn_brn || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.testrequest || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.brand || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.qrcode || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.concernperson || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.productname || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div dangerouslySetInnerHTML={{ __html: row.quantity || "" }} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.departments || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.parameters || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(row.reportdate)}</td>
                      </tr>
                    ))}
                    {data.length > 5 && (
                      <tr>
                        <td colSpan="13" className="px-6 py-4 text-center text-sm text-gray-500">
                          ... and {data.length - 5} more records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboards/registers/sample-inward-register')}
              className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Back to Register
            </button>
            <button
              onClick={generatePDF}
              disabled={loading || data.length === 0}
              className="flex-1 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate BIS PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
