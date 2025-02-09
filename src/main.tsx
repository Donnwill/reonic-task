import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SessionInfoProvider } from "./provider/session-info-provider.tsx";
import { InputParametersProvider } from "./provider/input-parameters-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InputParametersProvider>
      <SessionInfoProvider>
        <App />
      </SessionInfoProvider>
    </InputParametersProvider>
  </StrictMode>
);
