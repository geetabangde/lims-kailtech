// Import Dependencies
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "utils/axios";

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { Page } from "components/shared/Page";
import { useThemeContext } from "app/contexts/theme/context";

export default function EnvironmentalRecord() {
  const { cardSkin } = useThemeContext();
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  useEffect(() => {
    // Permission 411 as per PHP code: if(!in_array(411, $permissions)){ header("location:index.php"); }
    if (!permissions.includes(411)) {
      navigate("/dashboards");
    }
  }, [navigate, permissions]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters matching PHP code
  const [filters, setFilters] = useState({
    year: "",
    month: "",
    labid: "",
  });
  const [labs, setLabs] = useState([]);

  // Fetch labs dropdown data
  const fetchLabs = async () => {
    try {
      const res = await axios.get("/master-data/labs", {
        params: { status: 1 }
      });
      setLabs(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching labs:", err);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  // Fetch environmental record data using PHP endpoint
  const fetchEnvironmentalData = async () => {
    try {
      setLoading(true);
      
      // Use environmental record endpoint matching PHP logic
      const res = await axios.get("/enviornmentalRecordData", { params: filters });
      
      // Handle DataTables server-side response format
      let rows = res.data?.data || [];
      
      // Map to PHP table structure: Date, Environmental Type, Temperature, Humidity, Time, Added By
      rows = rows.map((row, index) => ({
        date: row[0] || "",
        environmental_type: row[1] || "",
        temperature: row[2] || "",
        humidity: row[3] || "",
        time: row[4] || "",
        added_by: row[5] || "",
      }));
      
      setTableData(rows);
    } catch (err) {
      console.error("Error fetching received data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    fetchEnvironmentalData();
  };

  const handleExport = (e) => {
    e?.preventDefault?.();
    // Create form data for export request
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/registers/exportenviornmentalrecord';
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (typeof value !== 'object' || value.length > 0)) {
        if (Array.isArray(value)) {
          value.forEach(val => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = `${key}[]`;
            input.value = val;
            form.appendChild(input);
          });
        } else {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      }
    });
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  // Generate year options (2021 to current year)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2021; i <= currentYear + 5; i++) {
    years.push(i);
  }

  // Generate month options
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const getMonthLabel = (monthValue) => {
    const month = months.find(m => m.value === monthValue);
    return month ? month.label : "";
  };

  function PageSpinner() {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-3 text-gray-500">
        <svg className="h-7 w-7 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z" />
        </svg>
        Loading...
      </div>
    );
  }

  if (loading) {
    return (
      <Page title="Environmental Record">
        <PageSpinner />
      </Page>
    );
  }

  return (
    <Page title="Environmental Record">
      <div className="px-(--margin-x) pt-4">
        <div className="box box-info">
          <div className="box-header with-border no-print">
            <h3 className="box-title with-border">Environmental Record List</h3>
            <div className="box-tools pull-right">
              <select 
                className="btn btn-box-tool notselect2" 
                id="month" 
                value={filters.month} 
                onChange={(e) => handleFilterChange("month", e.target.value)}
              >
                {months.map((month) => (
                  <option 
                    key={month.value} 
                    value={month.value}
                    selected={filters.month === month.value}
                  >
                    {month.label}
                  </option>
                ))}
              </select>
              <select 
                className="btn btn-box-tool notselect2" 
                id="year" 
                value={filters.year} 
                onChange={(e) => handleFilterChange("year", e.target.value)}
              >
                {years.map((year) => (
                  <option 
                    key={year} 
                    value={year}
                    selected={filters.year === year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="box-body" id="catid">
            <table id="example1" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th colSpan="13">
                    <div className="flex justify-between items-center">
                      <span>MONTH</span>
                      <span>YEAR</span>
                      <span>LOCATION</span>
                      <span>DEPARTMENT</span>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th>Date</th>
                  <th>Environmental Type</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Time</th>
                  <th>Added By</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.environmental_type}</td>
                    <td>{row.temperature}</td>
                    <td>{row.humidity}</td>
                    <td>{row.time}</td>
                    <td>{row.added_by}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="13">
                    <div className="flex justify-between items-center">
                      <span>MONTH</span>
                      <span>YEAR</span>
                      <span>LOCATION</span>
                      <span>DEPARTMENT</span>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <i className="fa fa-refresh fa-spin"></i>
      </div>
    </Page>
  );
}