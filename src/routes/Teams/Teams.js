import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import TeamsList from './routes/TeamsList';
import TeamProfile from './routes/TeamProfile';

class Teams extends PureComponent {
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
        <Route path={`${path}/list`} component={TeamsList} />
        <Route path={`${path}/:id`} component={TeamProfile} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default Teams;
