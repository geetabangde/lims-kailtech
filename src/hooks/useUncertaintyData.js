// ===================== src/hooks/useUncertaintyData.js =====================

import { useEffect, useState } from "react";
import axios from "utils/axios";
import { toast } from "sonner";
import { mapDataBySuffix } from "../utils/dataMapper";

export const useUncertaintyData = (inwardId, instId, caliblocation, calibacc) => {
  const [data, setData] = useState([]);
  const [suffix, setSuffix] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUncertainty = async () => {
      try {
        const response = await axios.get(
          `/calibrationprocess/get-uncertainty?inwardid=${inwardId}&instid=${instId}&caliblocation=${caliblocation}&calibacc=${calibacc}`
        );

        if (response.data?.status === true) {
          const instrumentSuffix = response.data.data?.listInstrument?.suffix || "";
          
          console.log("🔍 API Response:", response.data.data);
          console.log("🎯 Instrument Suffix:", instrumentSuffix);
          
          setSuffix(instrumentSuffix);
          
          let apiData = [];
          
          // Get correct data structure based on suffix
          if (instrumentSuffix === "mm") {
            apiData = response.data.data?.uncertainty?.original?.data || [];
          } else if (instrumentSuffix === "mt" || instrumentSuffix === "fg") {
            apiData = response.data.data?.uncertainty?.data || [];
          } else if (["it", "hg", "avg", "msr", "mg", "exm", "rtdwi", "ppg", "gtm", "dg"].includes(instrumentSuffix)) {
            apiData = response.data.data?.uncertainty || [];
          } else {
            apiData = response.data.data?.uncertainty || [];
          }

          console.log("📦 Raw API Data:", apiData);

          // Map data based on suffix
          const mappedData = mapDataBySuffix(instrumentSuffix, apiData);
          
          console.log("✅ Mapped Data:", mappedData);
          console.log("📊 Data Length:", mappedData?.length);
          
          setData(mappedData);
        } else {
          toast.error("No data found");
          setData([]);
        }
      } catch (error) {
        console.error("❌ Error fetching uncertainty:", error);
        toast.error("Failed to fetch data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUncertainty();
  }, [inwardId, instId, caliblocation, calibacc]);

  // ✅ SEPARATE useEffect to log state changes
  useEffect(() => {
    console.log("🔄 State Updated - Suffix:", suffix);
    console.log("🔄 State Updated - Data:", data);
    console.log("🔄 State Updated - Loading:", loading);
  }, [suffix, data, loading]);

  return { data, suffix, loading };
};