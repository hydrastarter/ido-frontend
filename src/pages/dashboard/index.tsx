import React, { useContext, useEffect, useState } from "react";
import Uik from "@reef-chain/ui-kit";
import "./index.css";
import { idoType } from "../../assets/ido";
import { IdoCard } from "./IdoCard";
import { appState, hooks,  ReefSigner } from "@reef-chain/react-lib";
import BigNumber from "bignumber.js";
import { Crowdsale } from "../../abis/Crowdsale";
import { Contract } from "ethers";
import { AvailableNetworks, getNetworkCrowdsaleUrl } from "../../environment";
import ReefSigners from "../../context/ReefSigners";

export const Dashboard: React.FC = () => {
  const [allIdos, setAllIdos] = useState<idoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState({
    status:false,
    message:undefined
  });
  const { selectedSigner,network:selectedNetwork } = useContext(ReefSigners);

  const getAllIdos = async (networkName: AvailableNetworks) => {
    setIsLoading(() => true);
    const username = "adminUser";
    const password = "password";
    const resp = await fetch(getNetworkCrowdsaleUrl(networkName), {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
    const res = await resp.json();
    setAllIdos(res.data);
    setIsLoading(() => false);
  };

  useEffect(() => {
    if (!selectedNetwork) {
      return;
    }
    getAllIdos(selectedNetwork.name).catch((e) => {
      setIsLoading(() => false);
      setErrorStatus({
        status:true,
        message:e.message
      });
      console.log("Error in getAllIdos: ", e);
    });
  }, [selectedNetwork]);


  return (
    <div style={{ width: "100%" }}>
      {isLoading ? 
      <div className="loader">
        <Uik.Loading text="fetching all IDOs"/>
      </div>
      : !isLoading && allIdos&& allIdos?.length==0 ? <Uik.Text text={"No IDOs found"} type="light"/>: errorStatus.status ?
      <div className="error-block">
        <Uik.Text className="error-block-title" text={"Encountered an error"} type="light"/>
        <Uik.Text className="error-block-desc" text={errorStatus.message} type="light" />
      </div>:allIdos && <TabsData allIdos={allIdos} />}
    </div>
  );
};

const Tabs = [
  "Active Presales",
  "Upcoming Presales",
  "Completed Presales",
  "My Crowdsale"
]

const TabsData = ({ allIdos }: { allIdos: idoType[] }) => {
  const [selectedTab, setSelectedTab] = useState(Tabs[0]);
  const [activePresales, setActivePresales] = useState<idoType[]>([]);
  const [upcomingPresales, setUpcomingPresales] = useState<idoType[]>([]);
  const [completedPresales, setCompletedPresales] = useState<idoType[]>([]);
  const [myCrowdsales, setMyCrowdsales] = useState<idoType[]>([]);
  
  const TabsIdent = [
    activePresales,
    upcomingPresales,
    completedPresales,
    myCrowdsales
  ]

  const { selectedSigner } = useContext(ReefSigners);

  const sortAllIdos = async (
    allTypesOfIdos: idoType[],
    selectedSigner: ReefSigner
  ) => {
    const idos = allTypesOfIdos;
    if (idos && idos.length > 0) {
      let activeIdos = [] as idoType[];
      let upcomingIdos = [] as idoType[];
      let completedIdos = [] as idoType[];
      let myIdos = [] as idoType[];

      const currentTime = Math.floor(+new Date() / 1000);

      for (let ido of idos) {
        const idoStartTime = parseFloat(ido.crowdsaleStartTime);
        const idoEndTime = parseFloat(ido.crowdsaleEndTime);

        if (idoStartTime < currentTime && idoEndTime > currentTime)
          activeIdos.push(ido);
        else if (idoStartTime > currentTime && idoEndTime > currentTime)
          upcomingIdos.push(ido);
        else completedIdos.push(ido);

        try {
          const crowdsaleContract = new Contract(
            ido.crowdsaleAddress,
            Crowdsale,
            //@ts-ignore
            selectedSigner.signer
          );

          const vestingScheduleForBeneficiary =
            await crowdsaleContract.vestingScheduleForBeneficiary(
              selectedSigner.evmAddress
            );

          const amount = vestingScheduleForBeneficiary[0]; // total invested
          const amountInString = amount.toString();
          if (new BigNumber(amountInString).isGreaterThan(0)) myIdos.push(ido);
        } catch (e) {
          console.log("Error while checking for my crowdsale", e);
        }
      }

      setActivePresales(() => activeIdos);
      setUpcomingPresales(() => upcomingIdos);
      setCompletedPresales(() => completedIdos);
      setMyCrowdsales(() => myIdos);
    }
  };

  useEffect(() => {
    if (selectedSigner) {
      sortAllIdos(allIdos, selectedSigner).catch((e) => {
        console.log("Error in sortAllIdos: ", e);
      });
    }
  }, [allIdos, selectedSigner]);

  const getTabsContainer = () => {
    const currentTabData = TabsIdent[Tabs.indexOf(selectedTab)];
    if (currentTabData && currentTabData.length > 0) {
      return currentTabData.map((ido) => (
        <IdoCard key={ido.id} ido={ido} typeOfPresale={selectedTab} />
      ));
    } else {
      return <Uik.Text text="No IDOs" type="light"/>;
    }
  };
  

  return (
    <div className="dashboard-container">
      <>
        <div className="tabs-container">
          <Uik.Tabs
            value={selectedTab}
            onChange={(value) => setSelectedTab(value)}
            options={Tabs}
          />
        </div>
        <div className="idos-container">
          {getTabsContainer()}
        </div>
      </>
      {/* )} */}
    </div>
  );
};
