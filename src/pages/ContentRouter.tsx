import React from "react";
import { Route, Switch } from "react-router-dom";
import { DASHBOARD_URL, ADMIN_URL, CROWDSALE_DETAILS_URL } from "../urls";
// import { Dashboard } from "./dashboard";
// import Crowdsale from './crowdsale'
import { Admin } from "./admin";
import HydraStarterSlide from "./home";
import Footer from "./home/Footer";
import DetailPage from "./detailPage";
const ContentRouter = (): JSX.Element => (
  <div className="content">
    <Switch>
      <Route exact path={CROWDSALE_DETAILS_URL} component={DetailPage} />
      <Route exact path={ADMIN_URL} component={Admin} />
      <Route path={DASHBOARD_URL} component={HydraStarterSlide} />
    </Switch>
    <Footer />

  </div>
);

export default ContentRouter;
