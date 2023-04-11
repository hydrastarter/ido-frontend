import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DASHBOARD_URL } from '../urls';
import HelloWorld from '../auroblocks/HelloWorld';

const ContentRouter = (): JSX.Element => (
  <div className="content">
    <Switch>
      <Route exact path={DASHBOARD_URL} component={HelloWorld} />
      <Route path="/" render={() => (<Redirect to={DASHBOARD_URL} />)} />
    </Switch>
  </div>
);

export default ContentRouter;
