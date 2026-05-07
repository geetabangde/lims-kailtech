import { AuthProvider } from "app/contexts/auth/Provider";
import { BreakpointProvider } from "app/contexts/breakpoint/Provider";
import { LocaleProvider } from "app/contexts/locale/Provider";
import { SidebarProvider } from "app/contexts/sidebar/Provider";
import { ThemeProvider } from "app/contexts/theme/Provider";
import { useAuthContext } from "app/contexts/auth/context";
import { RouterProvider } from "react-router";
import router from "app/router/router";


// ✅ Step 1: Wrapper that waits for auth to be initialized
function AppContent() {
  const { isInitialized } = useAuthContext();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

// ✅ Step 2: Main App
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocaleProvider>
          <BreakpointProvider>
            <SidebarProvider>
              <AppContent />
            </SidebarProvider>
          </BreakpointProvider>
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
