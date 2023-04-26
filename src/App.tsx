import { hooks } from "@reef-defi/react-lib";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./common/Nav";
import ContentRouter from "./pages/ContentRouter";
import NoAccount from "./pages/error/NoAccount";
import NoExtension from "./pages/error/NoExtension";
import NetworkSwitch, { setSwitching } from "./context/NetworkSwitch";
import NetworkSwitching from "./common/NetworkSwitching";

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  const { loading, error } = hooks.useInitReefState("Reef Wallet App", {
    ipfsHashResolverFn: (hash: string) =>
      `https://reef.infura-ipfs.io/ipfs/${hash}`,
  });

  const [isNetworkSwitching, setNetworkSwitching] = useState(false);
  const networkSwitch = {
    isSwitching: isNetworkSwitching,
    setSwitching: (value: boolean) => setSwitching(value, setNetworkSwitching),
  };

  useEffect(() => {
    if (!loading && isNetworkSwitching) setNetworkSwitching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <NetworkSwitch.Provider value={networkSwitch}>
      <div className="App d-flex w-100 h-100">
        <div className="w-100 main-content">
          {!loading && !error && (
            <>
              <Nav display={!loading && !error} />
              <QueryClientProvider client={queryClient}>
                <ContentRouter />
              </QueryClientProvider>
            </>
          )}

          <NetworkSwitching isOpen={isNetworkSwitching} />

          {error?.code === 1 && <NoExtension />}
          {error?.code === 2 && <NoAccount />}
          <ToastContainer
            draggable
            newestOnTop
            closeOnClick
            hideProgressBar
            position={toast.POSITION.BOTTOM_LEFT}
            autoClose={5000}
            rtl={false}
            pauseOnFocusLoss={false}
            pauseOnHover={false}
          />
        </div>
      </div>
    </NetworkSwitch.Provider>
  );
};

export default App;
