import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import "@reef-chain/react-lib/dist/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { version } from "../package.json";
import { ConnectedWalletProvider } from './context/ConnectedWalletContext';
import { AccountSelectorProvider } from './context/AccountSelectorContext';
import { WcPreloaderProvider } from './context/WcPreloaderContext';

console.log(`Reef-app version: ${version}`);

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <AccountSelectorProvider>
      <ConnectedWalletProvider>
        <WcPreloaderProvider>
          <App />
        </WcPreloaderProvider>
      </ConnectedWalletProvider>
      </AccountSelectorProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
