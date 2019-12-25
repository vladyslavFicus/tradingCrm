import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import List from '../routes/List';
import OfficeProfile from '../routes/OfficeProfile';

const Offices = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/:id`} component={OfficeProfile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Offices.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Offices;
