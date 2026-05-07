import { useParams, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";
import { Button } from "components/ui";

export default function ViewCertificateWithlh() {
  const { id: inwardId, itemId: instId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caliblocation = searchParams.get('caliblocation') || 'Lab';
  const calibacc = searchParams.get('calibacc') || 'Nabl';
  
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfOpened, setPdfOpened] = useState(false);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `/calibrationprocess/view-certificate-withletterhead`,
        {
          params: {
            inwardid: inwardId,
            instid: instId,
            caliblocation: caliblocation,
            calibacc: calibacc
          },
          timeout: 30000,
        }
      );
      
      if (response.data) {
        // Make PDF links clickable and extract PDF URLs for auto-opening
        const processedHtml = response.data.replace(
          /(https?:\/\/[^\s<>"']+\.pdf)/gi,
          `<div class="pdf-link-container" style="margin: 20px 0; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="color: white; font-size: 16px; font-weight: 600; margin-bottom: 8px;">📄 Certificate PDF Available</div>
            <a href="$1" target="_blank" rel="noopener noreferrer" 
               style="display: inline-flex; align-items: center; gap: 8px; color: #ffffff; text-decoration: none; 
                      background: rgba(255,255,255,0.2); padding: 10px 16px; border-radius: 8px; 
                      font-weight: 500; transition: all 0.3s ease; backdrop-filter: blur(10px);"
               onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)'"
               onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)'">
              <span>🔗</span>
              <span>Click Here to View Certificate PDF</span>
              <span>↗️</span>
            </a>
          </div>`
        );
        setHtml(processedHtml);
        
        // Auto-open PDF if not already opened
        if (!pdfOpened) {
          const pdfUrls = response.data.match(/(https?:\/\/[^\s<>"']+\.pdf)/gi);
          if (pdfUrls && pdfUrls.length > 0) {
            // Open the first PDF found
            setTimeout(() => {
              window.open(pdfUrls[0], '_blank', 'noopener,noreferrer');
              setPdfOpened(true);
            }, 1000); // Small delay to ensure component is rendered
          }
        }
      } else {
        throw new Error('No certificate data received');
      }
      
    } catch (error) {
      console.error("Error fetching certificate:", error);
      const errorMessage = error.response?.status === 404 ? "Certificate not found" :
                          error.response?.status === 500 ? "Server error" :
                          error.code === 'ECONNABORTED' ? "Request timeout" :
                          "Failed to fetch certificate";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inwardId && instId) {
      fetchCertificate();
    } else {
      setError("Missing required parameters");
      setLoading(false);
    }
  }, [inwardId, instId]);

  const handleBackToPerformCalibration = () => {
    navigate(`/dashboards/calibration-process/inward-entry-lab/perform-calibration/${inwardId}?caliblocation=${caliblocation}&calibacc=${calibacc}`);
  };

  if (loading)
    return (
      <Page title="Certificate">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <svg
            className="animate-spin h-6 w-6 mr-2 text-blue-600"
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
          Loading View Certificate WithLH...
        </div>
      </Page>
    );

  // Error state
  if (error) {
    return (
      <Page title="Certificate - Error">
        <div className="flex h-[60vh] items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-lg border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Certificate Loading Failed</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchCertificate} color="primary">
                🔄 Retry Loading
              </Button>
              <Button onClick={handleBackToPerformCalibration} color="secondary">
                ← Back to Calibration
              </Button>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  // Success state
  return (
    <Page title="Calibration Certificate">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Enhanced Header */}
        <div className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-10 backdrop-blur-sm b">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📋</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">View Certificate With Letter Head</h1>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Inward ID: <strong>{inwardId}</strong>
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Instrument ID: <strong>{instId}</strong>
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleBackToPerformCalibration} 
                  color="primary"
                  size="sm"
                  className="shadow-md hover:shadow-lg transition-all duration-200"
                >
                  ← Back to Perform Calibration
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
         
            
            {/* Certificate Body */}
            <div className="p-8">
              <div 
                className="certificate-container prose max-w-none"
                dangerouslySetInnerHTML={{ __html: html }} 
                style={{
                  minHeight: '800px',
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: '1.6',
                  color: '#374151'
                }}
              />
            </div>
          </div>
        </div>

      
      </div>

      {/* Custom Styles */}
      <style >{`
        .certificate-container a {
          transition: all 0.3s ease;
        }
        
        .certificate-container a:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .pdf-link-container a:hover span:last-child {
          transform: translateX(2px);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .certificate-container {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </Page>
  );
}
















