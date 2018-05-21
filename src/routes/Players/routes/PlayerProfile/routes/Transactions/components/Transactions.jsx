import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Route } from '../../../../../../../router';
import PropTypes from '../../../../../../../constants/propTypes';
import GameActivity from '../routes/GameActivity';
import Payments from '../routes/Payments';
import { routes } from '../constants';

class Transactions extends PureComponent {
  static propTypes = {
    userTransactionsSubTabs: PropTypes.shape({
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
      userTransactionsSubTabs,
      match: { path },
    } = this.props;

    let redirectUrl = '';

    if (userTransactionsSubTabs && !isEmpty(userTransactionsSubTabs.tabs)) {
      [{ url: redirectUrl }] = userTransactionsSubTabs.tabs;
    }

    if (!redirectUrl) {
      return null;
    }

    return (
      <Switch>
        <Route path={`${path}/payments`} component={Payments} />
        <Route path={`${path}/game-activity`} component={GameActivity} />
        <Redirect to={redirectUrl} />
      </Switch>
    );
  }
}

export default Transactions;
