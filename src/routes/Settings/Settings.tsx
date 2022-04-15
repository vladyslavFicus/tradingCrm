import React, { Suspense } from 'react';
import { Switch, Redirect, useRouteMatch } from 'react-router-dom';
import RSocketProvider from 'rsocket';
import Route from 'components/Route';
import AcquisitionStatuses from './routes/AcquisitionStatuses';

const Settings = () => {
  const { path, url } = useRouteMatch();

  return (
    <RSocketProvider>
      <Suspense fallback={null}>
        <Switch>
          <Route path={`${path}/acquisition-statuses`} component={AcquisitionStatuses} />
          <Redirect to={`${url}/acquisition-statuses`} />
        </Switch>
      </Suspense>
    </RSocketProvider>
  );
};

export default React.memo(Settings);
