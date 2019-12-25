import React, { PureComponent, Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import Route from 'components/Route';
import PropTypes from 'constants/propTypes';
import StickyNavigation from '../../../components/StickyNavigation';
import TradingAccounts from '../routes/TradingAccounts';
import { routes } from '../constants';

class Accounts extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
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
      match: { url },
      permission: {
        permissions,
      },
    } = this.props;

    return routes
      .map(i => ({ ...i, url: `${url}${i.url}` }))
      .filter(i => (!(i.permissions instanceof Permissions) || i.permissions.check(permissions)));
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
          <Route disableScroll path={`${path}/trading-accounts`} component={TradingAccounts} />
          <Redirect to={redirectUrl} />
        </Switch>
      </Fragment>
    );
  }
}

export default withPermission(Accounts);
