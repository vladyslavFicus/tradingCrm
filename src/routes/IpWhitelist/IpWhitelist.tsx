import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import IpWhitelistFeed from './components/IpWhitelistFeed';
import IpWhitelistList from './components/IpWhitelistList';
import './IpWhitelist.scss';

const IpWhitelist = () => {
  const { path, url } = useRouteMatch();

  return (
    <div className="IpWhitelist">
      <Switch>
        <Route path={`${path}/list`} component={IpWhitelistList} />
        <Route path={`${path}/feed`} component={IpWhitelistFeed} />
        <Redirect to={`${url}/list`} />
      </Switch>
    </div>
  );
};

export default React.memo(IpWhitelist);
