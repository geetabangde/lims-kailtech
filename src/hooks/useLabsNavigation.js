import { useState, useEffect } from "react";
import axios from "utils/axios";
import { dashboards } from "app/navigation/dashboards";
import { NAV_TYPE_ITEM } from "constants/app.constant";

export const useLabsNavigation = () => {
  const [navigation, setNavigation] = useState([dashboards]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabsAndBuildNav = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/master/list-lab");
        const labsData = response.data.data;
        console.log("Fetched labs data:", labsData); 

        const labNavItems = labsData.map((lab) => {
          const slug = lab.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[()]/g, '')
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9-]/g, '');

          return {
            id: `dashboards.material-list.${slug}`,
            type: NAV_TYPE_ITEM,
            path: `/dashboards/material-list/${slug}?labId=${lab.id}`,
            title: lab.name,
            transKey: `nav.dashboards.${slug}`,
          };
        });

        const updatedDashboards = JSON.parse(JSON.stringify(dashboards));
        const materialListIndex = updatedDashboards.childs.findIndex(
          (child) => child.id === "dashboards.material-list"
        );

        if (materialListIndex !== -1) {
          updatedDashboards.childs[materialListIndex].childs = labNavItems;
        }

        setNavigation([updatedDashboards]);
        setLoading(false);
      } catch (err) {
        console.error("Error loading labs:", err);
        setError(err);
        setLoading(false);
        setNavigation([dashboards]);
      }
    };

    fetchLabsAndBuildNav();
  }, []);

  return { navigation, loading, error };
};