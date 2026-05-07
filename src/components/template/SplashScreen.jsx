// Local Imports
// import Logo from "assets/appLogo.svg?react";
import { Progress } from "components/ui";
import { Link } from "react-router";
import appLogo from "assets/logo.png"; 
// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center">
     <Link to="/">
              <img
                src={appLogo}
                alt="App Logo"
                className="h-10 w-auto object-contain text-center" style={{ marginLeft: '70px' }}
              />
            </Link>
      <Progress
        color="primary"
        isIndeterminate
        animationDuration="1s"
        className="mt-2 h-1"
      />
    </div>
  );
}
