// Import Dependencies
import { Outlet, ScrollRestoration } from "react-router";
import { lazy } from "react";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { LabsProvider } from "app/contexts/labs/context"; 
import { SplashScreen } from "components/template/SplashScreen";
import { Progress } from "components/template/Progress";
import { Loadable } from "components/shared/Loadable";

const Toaster = Loadable(lazy(() => import("components/template/Toaster")));
const Tooltip = Loadable(lazy(() => import("components/template/Tooltip")));

// ----------------------------------------------------------------------

function Root() {
  const { isInitialized } = useAuthContext();

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <LabsProvider> 
      <Progress />
      <ScrollRestoration />
      <Outlet />
      <Tooltip />
      <Toaster />
    </LabsProvider>
  );
}

export default Root;