import { labsAPI } from "./api/labs";

// This maps lab types/categories to their route paths
const labTypeToRouteMap = {
  "electro-technical": "electro-technical",
  "site-calibration": "site-calibration",
  "calibration": "calibration",
  "chemical": "chemical",
  "building-material": "building-material",
  "reporting": "reporting",
  // Add more mappings as needed
};

export const generateMaterialListRoutes = async () => {
  try {
    // Fetch labs from API
    const labsData = await labsAPI.getLabs();
    
    if (!labsData || !labsData.data) {
      console.warn("No labs data received from API");
      return [];
    }

    // Generate routes based on labs
    const routes = [];
    
    // Process each lab and create route configuration
    labsData.data.forEach((lab) => {
      const labType = lab.type?.toLowerCase().replace(/\s+/g, '-') || lab.name?.toLowerCase().replace(/\s+/g, '-');
      const routePath = labTypeToRouteMap[labType] || labType;
      
      if (routePath) {
        routes.push({
          id: lab.id || lab.lab_id,
          name: lab.name || lab.lab_name,
          type: lab.type,
          path: routePath,
          isActive: lab.status === "active" || lab.is_active,
          // Add other lab properties you might need
        });
      }
    });

    return routes;
  } catch (error) {
    console.error("Error generating dynamic routes:", error);
    // Return fallback routes if API fails
    return getFallbackRoutes();
  }
};

// Fallback routes in case API fails
const getFallbackRoutes = () => [
  { id: "1", name: "Electro Technical", path: "electro-technical", isActive: true },
  { id: "2", name: "Site Calibration", path: "site-calibration", isActive: true },
  { id: "3", name: "Calibration", path: "calibration", isActive: true },
  { id: "4", name: "Chemical", path: "chemical", isActive: true },
  { id: "5", name: "Building Material", path: "building-material", isActive: true },
  { id: "6", name: "Reporting", path: "reporting", isActive: true },
];