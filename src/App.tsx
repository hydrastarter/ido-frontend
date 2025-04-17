import { hooks, ReefSigner } from "@reef-chain/react-lib";
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
import { BigNumber} from "ethers";
import { extension as reefExt } from '@reef-chain/util-lib';

const App = (): JSX.Element => {
  const [accounts,setAccounts] = useState<ReefSigner[]>([]);
  const [selectedSigner,setSelectedSigner] = useState<ReefSigner | undefined>(undefined);

  const {
    loading, error, signers, selectedReefSigner, network, provider, reefState, extension
  } = hooks.useInitReefStateExtension(
    'Reef App', reefExt.REEF_EXTENSION_IDENT, { ipfsHashResolverFn: (hash: string): string => `https://reef.infura-ipfs.io/ipfs/${hash}` },
  );

  const accountsBalances:any[] = hooks.useObservableState(reefState.accounts$);

  useEffect(() => {
    let updatedAccountsList: any = [];
    
    if (signers && accountsBalances) {
      signers.forEach((sgnr, idx) => {
        
        const accountBalance = accountsBalances.find((bal) => bal.address === sgnr.address);


        if(accountBalance){
          let accountUpdatedBal = {
            ...sgnr,
            name:accountBalance.name,
            freeBalance: accountBalance ? accountBalance.freeBalance : BigNumber.from("0"),
            lockedBalance: accountBalance ? accountBalance.lockedBalance : BigNumber.from("0")
          };
          updatedAccountsList.push(accountUpdatedBal);
        }
      });

      setAccounts(updatedAccountsList);
    }
  }, [accountsBalances, signers]);

  useEffect(()=>{
    setSelectedSigner(selectedReefSigner);

    // if account connected , hide preloader & set account address
    if(signers?.length && signers?.indexOf(selectedReefSigner!)==-1){
      reefState.setSelectedAddress(signers[0].address)
    }
  },[selectedReefSigner,signers])


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
    <NetworkSwitch.Provider value={networkSwitch}>
      <div className="App d-flex w-100 h-100">
        <div className="w-100 main-content">
          {!loading && !error && (
            <>
              <Nav display={!loading && !error} />
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
    </ReefSignersContext.Provider>
  );
};

export default App;
