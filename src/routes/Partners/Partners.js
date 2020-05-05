import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import PartnersList from './routes/PartnersList';
import Partner from './routes/Partner';

class Partners extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: { path, url },
    } = this.props;

    return (
      <Switch>
        <Route path={`${path}/list`} component={PartnersList} />
        <Route path={`${path}/:id`} component={Partner} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default Partners;
