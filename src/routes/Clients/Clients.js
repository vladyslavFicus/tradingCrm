import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import Files from './routes/Files';
import Profile from './routes/Profile';
import ClientsList from './routes/ClientsList';

class Clients extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { match: { path, url } } = this.props;

    return (
      <Switch>
        <Route path={`${path}/list`} component={ClientsList} />
        <Route path={`${path}/kyc-documents`} component={Files} />
        <Route path={`${path}/:id`} component={Profile} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default Clients;
