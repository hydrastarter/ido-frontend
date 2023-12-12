import React from "react";
import { Route, Switch } from "react-router-dom";
import { DASHBOARD_URL, ADMIN_URL, CROWDSALE_DETAILS_URL,IDO_SALE,NOTFOUND ,DASHBOARD} from "../urls";
// import { Dashboard } from "./dashboard";
// import Crowdsale from './crowdsale'
import { Admin } from "./admin";
import HydraStarterSlide from "./home";
import Footer from "./home/Footer";
import DetailPage from "./detailPage";
import CategoryPage from "./categoryPage";
import pageNotFound from "./default";
import { Dashboard } from "./dashboard";
const ContentRouter = (): JSX.Element => (
  <div className="content">
    <Switch>
      <Route exact path={CROWDSALE_DETAILS_URL} component={DetailPage} />
      <Route exact path={ADMIN_URL} component={Admin} />
      <Route exact path={DASHBOARD_URL} component={HydraStarterSlide} />
      <Route exact path={IDO_SALE} component={CategoryPage} />
      <Route exact path={NOTFOUND} component={pageNotFound} />
      <Route exact path={DASHBOARD} component={Dashboard} />


    </Switch>
    <Footer />

  </div>
);

export default ContentRouter;
