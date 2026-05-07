import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import { Button } from "components/ui";

export default function ViewMultipleDraft() {
  const params = useParams();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printLoading, setPrintLoading] = useState(false);

  // Extract parameters from URL
  const inwardId = params.id || params.inwardId;
  const instId = params.itemId || params.instId;

  console.log("URL Params:", params);
  console.log("Extracted inwardId:", inwardId);
  console.log("Extracted instId:", instId);

  // Get caliblocation and calibacc from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const caliblocation = searchParams.get('caliblocation') || 'Lab';
  const calibacc = searchParams.get('calibacc') || 'Nabl';

  console.log("URL Search Params:", {
    caliblocation,
    calibacc,
    fullURL: window.location.href
  });

  // Parse multiple instrument IDs
  const getInstrumentIds = () => {
    if (!instId) return [];
    // Handle both comma-separated and single IDs
    if (instId.includes(',')) {
      return instId.split(',').map(id => id.trim()).filter(id => id);
    }
    return [instId.trim()].filter(id => id);
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      const instids = getInstrumentIds();

      console.log("Processing instrument IDs:", instids);

      if (!inwardId) {
        toast.error('Missing inwardId parameter');
        setLoading(false);
        return;
      }

      if (instids.length === 0) {
        toast.error('Missing instId parameter');
        setLoading(false);
        return;
      }

      try {
        // Fetch certificates for all instrument IDs
        const certificatePromises = instids.map(async (instid) => {
          try {
            const apiUrl = `/calibrationprocess/view-multiple-draft-certificate?inwardid=${inwardId}&instid=${instid}&caliblocation=${caliblocation}&calibacc=${calibacc}`;
            console.log(`Fetching certificate for instid ${instid}:`, apiUrl);

            const response = await axios.get(apiUrl);
            
            console.log(`API Response for instid ${instid}:`, response.data);

            let htmlContent = '';
            
            // Handle different response structures
            if (response.data) {
              if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
                // Case 1: {success: true, data: [html_string]}
                htmlContent = response.data.data[0] || '';
              } else if (response.data.success && response.data.data && typeof response.data.data === 'string') {
                // Case 2: {success: true, data: html_string}
                htmlContent = response.data.data;
              } else if (typeof response.data === 'string') {
                // Case 3: direct HTML string
                htmlContent = response.data;
              } else if (response.data.data) {
                // Case 4: nested data
                htmlContent = response.data.data;
              } else {
                console.warn(`Unexpected response structure for instid ${instid}:`, response.data);
              }
            }

            return {
              instid,
              html: htmlContent,
              success: htmlContent ? true : false
            };
          } catch (error) {
            console.error(`Error fetching certificate for instid ${instid}:`, error);
            toast.error(`Failed to load certificate for ID: ${instid}`);
            return {
              instid,
              html: null,
              success: false,
              error: error.response?.data?.message || error.message
            };
          }
        });

        const results = await Promise.all(certificatePromises);
        
        console.log("All API results:", results);

        // Filter successful certificates
        const successfulCertificates = results.filter(res => res.success && res.html);
        
        console.log("Successful certificates:", successfulCertificates);

        if (successfulCertificates.length === 0) {
          toast.error("No certificates could be loaded");
        } else {
          toast.success(`Loaded ${successfulCertificates.length} certificate(s)`);
        }

        setCertificates(successfulCertificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        toast.error("Failed to fetch certificates");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [inwardId, instId, caliblocation, calibacc]);

  // Print handler for all certificates
  const handlePrint = () => {
    setPrintLoading(true);
    try {
      const printWindow = window.open("", "_blank", "width=900,height=650");
      
      if (!printWindow) {
        toast.error("Unable to open print window. Please check popup blocker.");
        setPrintLoading(false);
        return;
      }
      
      // Combine all certificate HTML content
      const allCertificatesHtml = certificates
        .map(cert => cert.html)
        .join('<div style="page-break-after: always;"></div>');

      printWindow.document.write(`
        <html>
          <head>
            <title>Multiple Certificates</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                padding: 0;
              }
              .certificate-container { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
              }
              @media print {
                body { margin: 0; }
                .page-break { page-break-after: always; }
              }
            </style>
          </head>
          <body>
            ${allCertificatesHtml}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error("Print failed:", error);
      toast.error("Print failed");
    } finally {
      setTimeout(() => setPrintLoading(false), 1500);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Page title="Multiple Draft Certificates">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
              ></path>
            </svg>
            <div className="text-lg">Loading Draft Certificates...</div>
            <div className="text-sm text-gray-500 mt-2">
              InwardId: {inwardId}, InstIds: {instId}
            </div>
          </div>
        </div>
      </Page>
    );
  }

  // No certificates found
  if (certificates.length === 0) {
    return (
      <Page title="Multiple Draft Certificates">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <div className="text-xl mb-2">No Certificates Found</div>
            <div className="text-sm text-gray-500 mb-4">
              Please check your parameters and try again
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-xs">
              <div><strong>Current Parameters:</strong></div>
              <div>InwardId: {inwardId || 'Missing'}</div>
              <div>InstId: {instId || 'Missing'}</div>
              <div>CalibLocation: {caliblocation}</div>
              <div>CalibAcc: {calibacc}</div>
              <div>Full URL: {window.location.href}</div>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </Page>
    );
  }

  // Main render
  return (
    <Page title="Multiple Draft Certificates">
      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <div className="space-y-8">
            {certificates.map((cert, index) => (
              <div key={cert.instid} className="certificate-container">
                <div className="w-full">
                  
                  <div 
                    dangerouslySetInnerHTML={{ __html: cert.html }} 
                    className="w-full"
                  />
                  
                  {index < certificates.length - 1 && (
                    <div className="border-t-2 border-gray-300 my-8 pt-8"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 sticky top-4">
          <div className="space-y-3">
            <Button
              onClick={handlePrint}
              color="success"
              disabled={printLoading || certificates.length === 0}
              className="px-6 py-3 text-sm font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ 
                minWidth: '160px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {printLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Preparing...
                </>
              ) : (
                <>
                  <svg 
                    className="h-4 w-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download All CRFs
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}








