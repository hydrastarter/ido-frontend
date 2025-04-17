import React, { useContext, useMemo } from "react";
import {
  Components,
} from "@reef-chain/react-lib";
import {network as reefNw} from "@reef-chain/util-lib";
import "./Nav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Uik from "@reef-chain/ui-kit";
import { saveSignerLocalPointer } from "../store/internalStore";
import { ADMIN_URL, DASHBOARD_URL } from "../urls";
import { appAvailableNetworks } from "../environment";
import NetworkSwitch from "../context/NetworkSwitch";
import ReefSigners from "../context/ReefSigners";

export interface Nav {
  display: boolean;
}

const Nav = ({ display }: Nav): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedSigner,network,accounts,reefState } = useContext(ReefSigners);
  const mainnetSelected =
    network == null || network?.rpcUrl === reefNw.AVAILABLE_NETWORKS.mainnet.rpcUrl;
  const menuItems = [
    { title: "Dashboard", url: DASHBOARD_URL },
    { title: "Launch IDO", url: ADMIN_URL },
  ];
  const networkSwitch = useContext(NetworkSwitch);

  const selectAccount = (index: number): void => {
    saveSignerLocalPointer(index);
    reefState!.setSelectedAddress(
      index != null ? accounts?.[index].address : undefined
    );
  };

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
                accounts={accounts}
                selectedSigner={selectedSigner || undefined}
                selectAccount={selectAccount}
                onNetworkSelect={selectNetwork}
                selectedNetwork={selectedNetwork}
                availableNetworks={['mainnet', 'testnet']}/>
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Nav;
