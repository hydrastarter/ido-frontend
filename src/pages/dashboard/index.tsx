import React, { useEffect, useState } from "react";
import Uik from "@reef-defi/ui-kit";
import "./index.css";
import { useQuery } from "@tanstack/react-query";
import { idos, idoType } from "../../assets/ido";
import { IdoCard } from "./IdoCard";

const getAllIdos = async () => {
  const username = "adminUser";
  const password = "password";
  const resp = await fetch("http://3.93.247.188/crowdsale", {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });
  return resp.json();
};

export const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useQuery<idoType[]>({
    queryKey: ["getAllIdos"],
    queryFn: getAllIdos,
  });

  return (
    <div>
      {/*{isLoading && <Uik.Loading text="Loading ..." />}*/}
      {/*{isError && <Uik.Alert type="danger" text="An error has occurred." />}*/}
      {/*{!isLoading && !isError && data && <TabsData allIdos={data} />}*/}
      {<TabsData allIdos={idos} />}
    </div>
  );
};

export const Tab1 = "Active Presales";
export const Tab2 = "Upcoming Presales";
export const Tab3 = "Completed Presales";
export const Tab4 = "My Crowdsale";

const TabsData = ({ allIdos }: { allIdos: idoType[] }) => {
  const [firstTab, setFirstTab] = useState(Tab1);

  const [isSorting, setIsSorting] = useState(false);

  const [activePresales, setActivePresales] = useState<idoType[]>([]);
  const [upcomingPresales, setUpcomingPresales] = useState<idoType[]>([]);
  const [completedPresales, setCompletedPresales] = useState<idoType[]>([]);
  const [myCrowdsales, setMyCrowdsales] = useState<idoType[]>([]);

  const sortAllIdos = async (allTypesOfIdos: idoType[]) => {
    setIsSorting(() => true);

    const idos = allTypesOfIdos;

    let activeIdos = [] as idoType[];
    let upcomingIdos = [] as idoType[];
    let completedIdos = [] as idoType[];
    let myIdos = [] as idoType[];

    const currentTime = Math.floor(+new Date() / 1000);

    for (let ido of idos) {
      const idoStartTime = parseFloat(ido.idoStart);
      const idoEndTime = parseFloat(ido.idoEnd);

      if (idoStartTime < currentTime && idoEndTime > currentTime)
        activeIdos.push(ido);
      else if (idoStartTime > currentTime && idoEndTime > currentTime)
        upcomingIdos.push(ido);
      else completedIdos.push(ido);
    }

    setActivePresales(() => activeIdos);
    setUpcomingPresales(() => upcomingIdos);
    setCompletedPresales(() => completedIdos);
    setMyCrowdsales(() => myIdos);

    setIsSorting(() => false);
  };

  useEffect(() => {
    sortAllIdos(allIdos).catch((e) => {
      setIsSorting(() => false);
      console.log("Error in sortAllIdos: ", e);
    });
  }, [allIdos]);

  return (
    <div className="dashboard-container">
      {isSorting && <Uik.Loading text="Loading ..." />}
      {!isSorting && (
        <>
          <div className="tabs-container">
            <Uik.Tabs
              value={firstTab}
              onChange={(value) => setFirstTab(value)}
              options={[Tab1, Tab2, Tab3, Tab4]}
            />
          </div>
          <div className="idos-container">
            {firstTab === Tab1 &&
              activePresales.map((ido) => (
                <IdoCard
                  key={ido.projectTokenName}
                  ido={ido}
                  typeOfPresale={Tab1}
                />
              ))}

            {firstTab === Tab2 &&
              upcomingPresales.map((ido) => (
                <IdoCard
                  key={ido.projectTokenName}
                  ido={ido}
                  typeOfPresale={Tab2}
                />
              ))}

            {firstTab === Tab3 &&
              completedPresales.map((ido) => (
                <IdoCard
                  key={ido.projectTokenName}
                  ido={ido}
                  typeOfPresale={Tab3}
                />
              ))}

            {firstTab === Tab4 &&
              myCrowdsales.map((ido) => (
                <IdoCard
                  key={ido.projectTokenName}
                  ido={ido}
                  typeOfPresale={Tab4}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};
