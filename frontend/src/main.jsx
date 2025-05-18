import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { zkSyncEra, base } from "./utils/chains";

const projectId = "48ecc4a8c7c822c92b7e475737d492af";

const config = getDefaultConfig({
  appName: "Zmol Games",
  projectId,
  chains: [zkSyncEra, base], 
  ssr: false,
});

const queryClient = new QueryClient();

// Graceful catch for weird mobile errors
window.addEventListener("error", function (e) {
  const message = e?.message;
  if (typeof message === "string" && message.includes("reading '0'")) {
    console.error("💣 Global error caught:", message);
    console.error("🧵 Stack trace:", e.error?.stack || "No stack trace");
    e.preventDefault?.();
    return true;
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: "#3a4a2c",
          accentColorForeground: "#d6df69",
          borderRadius: "none",
          fontStack: "system",
        })}
      >
        <App />
      </RainbowKitProvider>
    </WagmiProvider>
  </QueryClientProvider>,
);
