// Import Dependencies
import { Navigate, useLocation, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { GHOST_ENTRY_PATH, REDIRECT_URL_KEY } from "../constants/app.constant";

// ----------------------------------------------------------------------

export default function AuthGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

  const location = useLocation();

  const redirectPath =
  location.pathname && location.pathname !== "/login" && location.pathname !== "/logout"
    ? location.pathname
    : ""; 
  if (!isAuthenticated) {
    return (
      <Navigate
    to={`${GHOST_ENTRY_PATH}?${REDIRECT_URL_KEY}=${redirectPath}`}
    replace
  />
    );
  }
  return <>{outlet}</>;
  
}
