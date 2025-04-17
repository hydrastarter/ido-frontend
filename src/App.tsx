import { Components, hooks, ReefSigner } from "@reef-chain/react-lib";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./common/Nav";
import ContentRouter from "./pages/ContentRouter";
import NoAccount from "./pages/error/NoAccount";
import NoExtension from "./pages/error/NoExtension";
import NetworkSwitch, { setSwitching } from "./context/NetworkSwitch";
import ReefSignersContext from "./context/ReefSigners";
import NetworkSwitching from "./common/NetworkSwitching";
import Bind from "./common/Bind/Bind";
import { BigNumber } from "ethers";
import { extension as reefExt } from '@reef-chain/util-lib';
import { connectWc } from './utils/walletConnect';
import Uik from "@reef-chain/ui-kit";
import useConnectedWallet from "./hooks/useConnecctedWallet";
import useWcPreloader from "./hooks/useWcPreloader";
import { useNavigate } from "react-router-dom";
import HideBalance, { getStoredPref, toggleHidden } from './context/HideBalance';

const { WalletSelector, walletSelectorOptions } = Components;

export const availableWalletOptions = [
  walletSelectorOptions[reefExt.REEF_EXTENSION_IDENT],
  walletSelectorOptions[reefExt.REEF_SNAP_IDENT],
  // walletSelectorOptions[reefExt.REEF_EASY_WALLET_IDENT],
  walletSelectorOptions[reefExt.REEF_WALLET_CONNECT_IDENT]
];


export const connectWalletConnect = async (ident: string, setSelExtensionName: any, setWcPreloader: any) => {
  setWcPreloader({
    value: true,
    message: "initializing mobile app connection"
  });
  setSelExtensionName(undefined); //force setting this to different value from the ident initially or else it doesn't call useInitReefState hook

  const response: reefExt.WcConnection | undefined = await connectWc(setWcPreloader)
  console.log('connectWalletConnect', response);
  if (response) {
    reefExt.injectWcAsExtension(response, { name: reefExt.REEF_WALLET_CONNECT_IDENT, version: "1.0.0" });
    setSelExtensionName(ident);
    // display preloader 
    setWcPreloader({
      value: true,
      message: "wait while we are establishing a connection"
    });
  } else {
    // if proposal expired, recursively call
    Uik.notify.danger("Connection QR expired, reloading")
    await connectWalletConnect(ident, setSelExtensionName, setWcPreloader);
  }
}


const App = (): JSX.Element => {
  const { selExtensionName, setSelExtensionName } = useConnectedWallet();
  const { loading: wcPreloader, setLoading: setWcPreloader } = useWcPreloader()
  const [accounts, setAccounts] = useState<ReefSigner[]>([]);
  const [selectedSigner, setSelectedSigner] = useState<ReefSigner | undefined>(undefined);

  const {
    loading, error, signers, selectedReefSigner, network, provider, reefState, extension
  } = hooks.useInitReefStateExtension(
    'Reef IDO', selExtensionName, { ipfsHashResolverFn: (hash: string): string => `https://reef.infura-ipfs.io/ipfs/${hash}` },
  );

  const accountsBalances: any[] = hooks.useObservableState(reefState.accounts$);

  useEffect(() => {
    let updatedAccountsList: any = [];

    if (signers && accountsBalances) {
      signers.forEach((sgnr, idx) => {

        const accountBalance = accountsBalances.find((bal) => bal.address === sgnr.address);


        if (accountBalance) {
          let accountUpdatedBal = {
            ...sgnr,
            name: accountBalance.name,
            freeBalance: accountBalance ? accountBalance.freeBalance : BigNumber.from("0"),
            lockedBalance: accountBalance ? accountBalance.lockedBalance : BigNumber.from("0")
          };
          updatedAccountsList.push(accountUpdatedBal);
        }
      });

      setAccounts(updatedAccountsList);
    }
  }, [accountsBalances, signers]);

  useEffect(() => {
    setSelectedSigner(selectedReefSigner);

    // if account connected , hide preloader & set account address
    if (signers?.length && signers?.indexOf(selectedReefSigner!) == -1) {
      reefState.setSelectedAddress(signers[0].address)
    }
  }, [selectedReefSigner, signers])

  useEffect(() => {
    setAccounts([]);
    setSelectedSigner(undefined);
  }, [selExtensionName])

  const history = useNavigate();
  const [isBalanceHidden, setBalanceHidden] = useState(getStoredPref());
  const hideBalance = {
    isHidden: isBalanceHidden,
    toggle: () => toggleHidden(isBalanceHidden, setBalanceHidden),
  };


  const [isNetworkSwitching, setNetworkSwitching] = useState(false);
  const networkSwitch = {
    isSwitching: isNetworkSwitching,
    setSwitching: (value: boolean) => setSwitching(value, setNetworkSwitching),
  };

  useEffect(() => {
    if (!loading && isNetworkSwitching) setNetworkSwitching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (selExtensionName === reefExt.REEF_SNAP_IDENT && error?.code === 2) {
      // history(SNAP_URL); //add this route later
    }
  }, [extension, error]);

  const [errorToast, setErrorToast] = useState<{
    message: String;
    type: String;
  } | undefined>();

  useEffect(() => {
    if (errorToast) {
      if (errorToast.type == "danger") {
        Uik.notify.danger(errorToast.message.toString());
      } else {
        Uik.notify.danger({
          message: errorToast.message.toString(),
          keepAlive: true,
          children: <>
            <Uik.Button
              text='Reconnect'
              fill
              onClick={() => window.location.reload()}
            />
          </>
        })
      }
    }
  }, [errorToast])

  window.addEventListener("unhandledrejection", (event) => {
    const errorMessage = event.reason?.message || event.reason;
    if (errorMessage === "_canceled") {
      // disable wallet connect loader if exists 
      setWcPreloader({
        value: false, message: ""
      })
      setErrorToast({
        message: "You rejected the transaction",
        type: "danger"
      });
    } else if (errorMessage === "_invalid") {
      setErrorToast({
        message: "Session expired kindly reconnect",
        type: "info"
      })
    } else if (errorMessage === "_noUriFoundWC") {
      setErrorToast({
        message: "Encountered an error in initialization",
        type: "danger"
      })
    }
  });

  //handle preloader
  useEffect(() => {
    // preloader active
    if (wcPreloader.value && signers.length) {
      setWcPreloader({
        value: false,
        message: ""
      })
    }
  }, [signers])



  const onExtensionSelected = async (ident: string) => {
    console.log('onExtensionSelected', ident);
    try {
      if (ident === reefExt.REEF_WALLET_CONNECT_IDENT) {
        await connectWalletConnect(ident, setSelExtensionName, setWcPreloader);
      } else {
        setSelExtensionName(ident);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ReefSignersContext.Provider value={{
      accounts,
      selectedSigner,
      network,
      reefState,
      provider,
      extension,
      selExtName: undefined,
    }}
    >
      {loading && !error ? <>
        <Uik.Loading className="center-loader" />
        {!selExtensionName &&
          <WalletSelector
            onExtensionSelect={(extName: string) => onExtensionSelected(extName)}
            availableExtensions={availableWalletOptions}
          />
        }

        <Uik.Modal
          title={"Connecting to wallet"}
          isOpen={!!selExtensionName}
        >
          <div className="connecting-modal-content">
            <Uik.Loading />
            <Uik.Button onClick={() => setSelExtensionName(undefined)}>Cancel connection</Uik.Button>
          </div>
        </Uik.Modal>
      </>
        :
        <NetworkSwitch.Provider value={networkSwitch}>
          <div className="App d-flex w-100 h-100">
            <div className="w-100 main-content">
              {!loading && !error && (
                <>
                  <Nav display={!loading && !error} selectExtension={(extName) => onExtensionSelected(extName)} />
                  <ContentRouter />
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
              <Bind />
            </div>
          </div>
        </NetworkSwitch.Provider>
      }

    </ReefSignersContext.Provider>
  );
};

export default App;
