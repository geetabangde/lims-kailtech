import { useParams,useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function RegenerateCacheCopy() {
  const { id: inwardId, itemId: instId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const regenerateCacheCopy = async () => {
      try {
        const response = await axios.post(
          `/calibrationprocess/Regenerate-Cache-Copy`,
          {
            inwardid: inwardId,
            instid: instId,
          }
        );

        const certificateHtml = response.data;

        // ✅ Create a Blob URL from the HTML
        const blob = new Blob([`
           ${certificateHtml}
        `], { type: "text/html" });

        const blobUrl = URL.createObjectURL(blob);

        // ✅ Create an anchor element and simulate a click — this forces new TAB
        const link = document.createElement("a");
        link.href = blobUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

         setTimeout(() => {
          navigate(`/dashboards/calibration-process/inward-entry-lab/perform-calibration/${inwardId}?caliblocation=Lab&calibacc=Nabl`);
        }, 5000);

      } catch (error) {
        console.error("Error regenerating cache copy:", error);
        toast.error("Failed to regenerate cache copy");
      } finally {
        setLoading(false);
      }
    };

    regenerateCacheCopy();
  }, [inwardId, instId]);

  if (loading) {
    return (
      <Page title="Cache Copy">
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
          Loading Regenrate Cache Copy...
        </div>
      </Page>
    );
  }

  // return (
  //   <Page title="Cache Copy">
  //     {/* <div className="flex h-[60vh] items-center justify-center text-green-600 text-lg font-semibold">
  //       ✅ Certificate opened in a new tab!
  //     </div> */}
  //   </Page>
  // );
}










