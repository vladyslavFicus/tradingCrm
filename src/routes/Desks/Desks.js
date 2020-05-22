import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import DesksList from './routes/DesksList';
import DeskProfile from './routes/DeskProfile';

class Desks extends PureComponent {
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
        <Route path={`${path}/list`} component={DesksList} />
        <Route path={`${path}/:id`} component={DeskProfile} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default Desks;
