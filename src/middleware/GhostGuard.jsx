// Import Dependencies
import { Navigate, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

// ----------------------------------------------------------------------


export default function GhostGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

const urlParam = new URLSearchParams(window.location.search).get(REDIRECT_URL_KEY);
const url = urlParam && 
urlParam !== "null" && 
urlParam !== "undefined" && 
urlParam !== "/logout" && 
urlParam !== "" 
  ? urlParam 
  : null;


  if (isAuthenticated) {
    if (url) {
      window.history.replaceState({}, document.title, "/"); // ✅ clean query param
      return <Navigate to={url} />;
    }
    return <Navigate to={HOME_PATH} />;
  }

  return <>{outlet}</>;
}
