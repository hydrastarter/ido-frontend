import React, { useState } from "react";
import Uik from "@reef-defi/ui-kit";
import "./index.css";
import { useQuery } from "@tanstack/react-query";
import { idos } from "../../assets/ido";
import { IdoCard } from "./idoCard";

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
  const [firstTab, setFirstTab] = useState("Active Presales");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllIdos"],
    queryFn: getAllIdos,
  });

  console.log("data: ", data);

  return (
    <div className="dashboard-container">
      <div className="tabs-container">
        <Uik.Tabs
          value={firstTab}
          onChange={(value) => setFirstTab(value)}
          options={[
            "Active Presales",
            "Upcoming Presales",
            "Completed Presales",
            "My Crowdsale",
          ]}
        />
      </div>
      <div className="idos-container">
        {isLoading && <Uik.Loading text="Loading ..." />}
        {isError && <Uik.Alert type="danger" text="An error has occurred." />}
        {!isLoading && !isError && data && <div>YES</div>}
        {idos.slice(0, 1).map((ido) => (
          <IdoCard key={ido.name} ido={ido} />
        ))}
      </div>
    </div>
  );
};
