import React, { PureComponent, Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Permissions from '../../../../../../../utils/permissions';
import { Route } from '../../../../../../../router';
import PropTypes from '../../../../../../../constants/propTypes';
import GameActivity from '../routes/GameActivity';
import TradingActivity from '../routes/TradingActivity';
import StickyNavigation from '../../../components/StickyNavigation';
import Payments from '../routes/Payments';
import { routes } from '../constants';

class Transactions extends PureComponent {
  static propTypes = {
    currentPermissions: PropTypes.array.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    checkService: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    setRenderActions: PropTypes.func.isRequired,
  };

  state = {
    renderActions: null,
  };

  getChildContext() {
    return {
      setRenderActions: this.setRenderActions,
    };
  }

  get tabs() {
    const {
      currentPermissions,
      match: { url },
      checkService,
    } = this.props;

    return routes
      .map(i => ({ ...i, url: `${url}${i.url}` }))
      .filter(i => (!(i.permissions instanceof Permissions) || i.permissions.check(currentPermissions))
        && (i.service ? checkService(i.service) : true));
  }

  setRenderActions = renderActions => this.setState({ renderActions });

  render() {
    const {
      match: { path },
    } = this.props;
    const { renderActions } = this.state;
    const { tabs } = this;
    let redirectUrl = '';

    if (tabs && tabs.length) {
      [{ url: redirectUrl }] = tabs;
    }

    if (!redirectUrl) {
      return null;
    }

    return (
      <Fragment>
        <StickyNavigation links={tabs}>
          <If condition={renderActions}>
            {renderActions()}
          </If>
        </StickyNavigation>
        <Switch>
          <Route disableScroll path={`${path}/payments/:paymentUUID?`} component={Payments} />
          <Route disableScroll path={`${path}/game-activity`} component={GameActivity} />
          <Route disableScroll path={`${path}/trading-activity`} component={TradingActivity} />
          <Redirect to={redirectUrl} />
        </Switch>
      </Fragment>
    );
  }
}

export default Transactions;
