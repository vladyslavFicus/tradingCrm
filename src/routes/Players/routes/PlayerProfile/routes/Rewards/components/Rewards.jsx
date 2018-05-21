import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Route } from '../../../../../../../router';
import PropTypes from '../../../../../../../constants/propTypes';
import Campaigns from '../routes/Campaigns';
import FreeSpins from '../routes/FreeSpins';
import Bonuses from '../routes/Bonuses';
import { routes } from '../constants';

class Rewards extends PureComponent {
  static propTypes = {
    userRewardsSubTabs: PropTypes.shape({
      tabs: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    currentPermissions: PropTypes.array.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    initSubTabs: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { currentPermissions, initSubTabs, match: { url } } = this.props;

    initSubTabs(currentPermissions, routes.map(i => ({ ...i, url: `${url}${i.url}` })));
  }
  render() {
    const {
      userRewardsSubTabs,
      match: { path },
    } = this.props;

    let redirectUrl = '';

    if (userRewardsSubTabs && !isEmpty(userRewardsSubTabs.tabs)) {
      [{ url: redirectUrl }] = userRewardsSubTabs.tabs;
    }

    if (!redirectUrl) {
      return null;
    }

    return (
      <Switch>
        <Route path={`${path}/bonuses`} component={Bonuses} />
        <Route path={`${path}/free-spins`} component={FreeSpins} />
        <Route path={`${path}/campaigns`} component={Campaigns} />
        <Redirect to={redirectUrl} />
      </Switch>
    );
  }
}

export default Rewards;
