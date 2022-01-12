import React from 'react';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import Route from 'components/Route';
import IpWhitelistFeed from './components/IpWhitelistFeed';
import IpWhitelistTable from './components/IpWhitelistGrid';

const IpWhitelist = ({ match: { path, url } }: RouteComponentProps) => (
  <div className="IpWhitelist">
    <div className="IpWhitelist__tab-content">
      <Switch>
        <Route path={`${path}/list`} component={IpWhitelistTable} />
        <Route path={`${path}/feed`} component={IpWhitelistFeed} />
        <Redirect to={`${url}/list`} />
      </Switch>
    </div>
  </div>
);

export default IpWhitelist;
