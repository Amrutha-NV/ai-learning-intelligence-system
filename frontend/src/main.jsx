import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { DashboardProvider } from "./context/DashboardContext.jsx";
import { AnalyticsProvider } from "./context/AnalyticsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <BrowserRouter>
        <AuthProvider>
          <DashboardProvider>
            <AnalyticsProvider>
              <Toaster
                position="top-right"
                toastOptions={{ duration: 4000 }}
              />
              <App />
            </AnalyticsProvider>
          </DashboardProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);