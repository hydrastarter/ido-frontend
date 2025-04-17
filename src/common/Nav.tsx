import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Components,
} from "@reef-chain/react-lib";
import {network as reefNw} from "@reef-chain/util-lib";
import "./Nav.css";
import { saveAs } from 'file-saver';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Uik from "@reef-chain/ui-kit";
import { saveSignerLocalPointer } from "../store/internalStore";
import { network as nw, extension as reefExt } from '@reef-chain/util-lib';
import { ADMIN_URL, DASHBOARD_URL } from "../urls";
import { appAvailableNetworks } from "../environment";
import NetworkSwitch from "../context/NetworkSwitch";
import ReefSigners from "../context/ReefSigners";
import useConnectedWallet from "../hooks/useConnecctedWallet";
import { availableWalletOptions, connectWalletConnect } from "../App";
import useWcPreloader from "../hooks/useWcPreloader";
import {sendToSnap} from "./../utils/snap";
//@ts-ignore
import { AccountCreationData, Extension } from '@reef-chain/ui-kit/dist/ui-kit/components/organisms/AccountSelector/AccountSelector';
import {getMetadata} from "./../utils/metadata";
import useAccountSelector from "./../hooks/useAccountSelector"

export interface Nav {
  display: boolean;
  selectExtension:(name: string) => void;
}

const Nav = ({ display,selectExtension }: Nav): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {isAccountSelectorOpen,setIsAccountSelectorOpen} = useAccountSelector();
  const { selectedSigner,network,accounts,reefState,selExtName,provider ,extension} = useContext(ReefSigners);
  const mainnetSelected =
    network == null || network?.rpcUrl === reefNw.AVAILABLE_NETWORKS.mainnet.rpcUrl;
  const menuItems = [
    { title: "Dashboard", url: DASHBOARD_URL },
    { title: "Launch IDO", url: ADMIN_URL },
  ];
  const [showMetadataUpdate, setShowMetadataUpdate] = useState(false);
  const networkSwitch = useContext(NetworkSwitch);
  const [availableExtensions, setAvailableExtensions] = useState(availableWalletOptions);

  const {setSelExtensionName} = useConnectedWallet();

  useEffect(() => {
    if (provider && extension?.name === reefExt.REEF_SNAP_IDENT) {
      //@ts-ignore
      const metadata = getMetadata(provider.api);
      sendToSnap('listMetadata').then((metadataList) => {
        const existing = metadataList.find((item:any) => item.genesisHash === metadata.genesisHash);
        setShowMetadataUpdate(!existing || existing.specVersion < metadata.specVersion);
      });
    }
  }, [provider, selExtName]);

  useEffect(() => {
    availableExtensions.forEach((ext: Extension) => {
      ext.installed = ext.name === extension?.name;
    });
    setAvailableExtensions(availableExtensions);
  }, [extension, selExtName]);

  const selectAccount = (index: number): void => {
    saveSignerLocalPointer(index);
    reefState!.setSelectedAddress(
      index != null ? accounts?.[index].address : undefined
    );
  };


  const renameAccount = (address: string, newName: string): void => {
    sendToSnap('renameAccount', { addressRename: address, newName });
  }

  const exportAccount = async (address: string, password: string): Promise<void> => {
    const json = await sendToSnap('exportAccount', {
      addressExport: address,
      passwordExport: password
    });
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });
    saveAs(blob, `${address}.json`);
  }

  const importAccount = async ({ name, seed, json, password }:any): Promise<void> => {
    if (name && seed) {
      await sendToSnap('createAccountWithSeed', { seed: seed.trim(), name });
      window.location.reload();
    } else if (json && password) {
      await sendToSnap('importAccount', { json: JSON.parse(json), password });
      window.location.reload();
    } else {
      Uik.notify.danger('Invalid import data');
    }
  }

  const forgetAccount = async (address: string): Promise<void> => {
    const res = await sendToSnap('forgetAccount', { addressForget: address });
    if (res) {
      const accountsUpdated = accounts!.filter((acc) => acc.address !== address);
      reefState!.setAccounts(accountsUpdated);
      window.location.reload();
    }
  }

  const updateMetadata = async (): Promise<void> => {
    if (!provider) return;
    //@ts-ignore
    const metadata = getMetadata(provider.api);
    const updated = await sendToSnap('provideMetadata', metadata);
    if (updated) setShowMetadataUpdate(false);
  }

  const generateSeed = async (): Promise<AccountCreationData> => {
    return await sendToSnap('createSeed');
  }

  const createAccount = async (seed: string, name: string): Promise<void> => {
    await sendToSnap('createAccountWithSeed', { seed, name });
    window.location.reload();
  }


  const {setLoading:setWcPreloader}=useWcPreloader();

  const selectNetwork = (key: "mainnet" | "testnet"): void => {
    const toSelect = appAvailableNetworks.find((item) => item.name === key);
    networkSwitch.setSwitching(true);
    navigate(DASHBOARD_URL);

    if (toSelect) {
      reefState!.setSelectedNetwork(toSelect);
    }
  };

  const menuItemsView = menuItems.map((item) => {
    let classes = "navigation_menu-items_menu-item";
    if (pathname === item.url) {
      classes += " navigation_menu-items_menu-item--active";
    }
    return (
      <li key={item.title} className={classes}>
        <Link to={item.url} className="navigation_menu-items_menu-item_link">
          {item.title}
        </Link>
      </li>
    );
  });

  const selectedNetwork = useMemo(() => {
    const name = network?.name;

    if (name === "mainnet" || name === "testnet") {
      return name;
    }

    return undefined;
  }, [network]);

  return (
    <div className="nav-content navigation d-flex d-flex-space-between">
      <div className="navigation__wrapper">
        <button
          type="button"
          className="logo-btn"
          onClick={() => {
            navigate("/");
          }}
        >
          {mainnetSelected ? (
            <Uik.ReefLogo className="navigation__logo" />
          ) : (
            <Uik.ReefTestnetLogo className="navigation__logo" />
          )}
        </button>

        {display && (
          <nav className="d-flex justify-content-end d-flex-vert-center">
            <ul className="navigation_menu-items ">{menuItemsView}</ul>
            {accounts && !!accounts.length && network && (
              <Components.AccountSelector
                selExtName={selExtName}
                availableExtensions={availableExtensions}
                selectExtension={selectExtension}
                accounts={accounts}
                selectedSigner={selectedSigner || undefined}
                selectAccount={selectAccount}
                onNetworkSelect={selectNetwork}
                selectedNetwork={selectedNetwork}
                availableNetworks={['mainnet', 'testnet']}
                onRename={renameAccount}
                onExport={exportAccount}
                onImport={importAccount}
                onForget={forgetAccount}
                onUpdateMetadata={showMetadataUpdate ? updateMetadata : undefined}
                onStartAccountCreation={generateSeed}
                onConfirmAccountCreation={createAccount}
                setOpen={setIsAccountSelectorOpen}
                open={isAccountSelectorOpen}
                handleWalletConnect={()=>connectWalletConnect(reefExt.REEF_WALLET_CONNECT_IDENT,setSelExtensionName,setWcPreloader)}
                />
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Nav;
