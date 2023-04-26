import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { DASHBOARD_URL, ADMIN_URL } from "../urls";
import { Dashboard } from "./dashboard";
import { Admin } from "./admin";

const ContentRouter = (): JSX.Element => (
  <div className="content">
    <Switch>
      <Route exact path={ADMIN_URL} component={Admin} />
      <Route exact path={DASHBOARD_URL} component={Dashboard} />
      <Route path="/" render={() => <Redirect to={DASHBOARD_URL} />} />
    </Switch>
  </div>
);

export default ContentRouter;
