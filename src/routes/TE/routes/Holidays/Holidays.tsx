import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import HolidaysList from './routes/HolidaysList';
import NewHoliday from './routes/NewHoliday';
import EditHoliday from './routes/EditHoliday';

const Holidays = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={HolidaysList} />
    <Route path={`${path}/new`} component={NewHoliday} />
    <Route path={`${path}/:id`} component={EditHoliday} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Holidays);
