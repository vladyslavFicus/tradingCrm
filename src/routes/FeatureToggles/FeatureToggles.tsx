import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import FeatureForm from './routes/FeatureForm';
import FeatureFeed from './routes/FeatureFeed';
import './FeatureToggles.scss';

const FeatureToggles = ({ match: { path, url } }: RouteComponentProps) => (
  <div className="FeatureToggles">
    <Switch>
      <Route path={`${path}/features`} component={FeatureForm} />
      <Route path={`${path}/feed`} component={FeatureFeed} />
      <Redirect to={`${url}/features`} />
    </Switch>
  </div>
);

export default React.memo(FeatureToggles);
