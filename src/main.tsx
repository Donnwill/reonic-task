import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChargingSessionsProvider } from "./provider/charging-sessions-provider.tsx";
import { InputParametersProvider } from "./provider/input-parameters-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InputParametersProvider>
      <ChargingSessionsProvider>
        <App />
      </ChargingSessionsProvider>
    </InputParametersProvider>
  </StrictMode>
);
