import React from "react";
import { Route, Switch } from "react-router-dom";
import { DASHBOARD_URL, ADMIN_URL } from "../urls";
import { Dashboard } from "./dashboard";
import { Admin } from "./admin";

const ContentRouter = (): JSX.Element => (
  <div className="content">
    <Switch>
      <Route exact path={ADMIN_URL} component={Admin} />
      <Route path={DASHBOARD_URL} component={Dashboard} />
    </Switch>
  </div>
);

export default ContentRouter;
