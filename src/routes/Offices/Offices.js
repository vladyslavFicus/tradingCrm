import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import OfficesList from './routes/OfficesList';
import OfficeProfile from './routes/OfficeProfile';

class Offices extends PureComponent {
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
        <Route path={`${path}/list`} component={OfficesList} />
        <Route path={`${path}/:id`} component={OfficeProfile} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default Offices;
