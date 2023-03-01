import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import IpWhitelistFeed from './routes/IpWhitelistFeed';
import IpWhitelistList from './routes/IpWhitelistList';
import './IpWhitelist.scss';

const IpWhitelist = ({ match: { path, url } }: RouteComponentProps) => (
  <div className="IpWhitelist">
    <Switch>
      <Route path={`${path}/list`} component={IpWhitelistList} />
      <Route path={`${path}/feed`} component={IpWhitelistFeed} />
      <Redirect to={`${url}/list`} />
    </Switch>
  </div>
);

export default React.memo(IpWhitelist);
