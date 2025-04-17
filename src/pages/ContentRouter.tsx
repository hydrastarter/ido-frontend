import React from "react";
import { Route, Routes } from "react-router-dom";
import { DASHBOARD_URL, ADMIN_URL, CROWDSALE_DETAILS_URL } from "../urls";
import { Dashboard } from "./dashboard";
import Crowdsale from './crowdsale';
import { Admin } from "./admin";

const ContentRouter = () => (
  <div className="content">
    <Routes>
      <Route path={CROWDSALE_DETAILS_URL} element={<Crowdsale />} />
      <Route path={ADMIN_URL} element={<Admin />} />
      <Route path={DASHBOARD_URL} element={<Dashboard />} />
    </Routes>
  </div>
);

export default ContentRouter;
