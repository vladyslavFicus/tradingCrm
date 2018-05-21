import React, { PureComponent, Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import StickyNavigation from '../../../components/StickyNavigation';
import { Route } from '../../../../../../../router';
import PropTypes from '../../../../../../../constants/propTypes';
import Campaigns from '../routes/Campaigns';
import FreeSpins from '../routes/FreeSpins';
import Bonuses from '../routes/Bonuses';
import Permissions from '../../../../../../../utils/permissions';
import { routes } from '../constants';

class Rewards extends PureComponent {
  static propTypes = {
    currentPermissions: PropTypes.array.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
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
    const { currentPermissions, match: { url } } = this.props;

    return routes
      .map(i => ({ ...i, url: `${url}${i.url}` }))
      .filter(i => !(i.permissions instanceof Permissions) || i.permissions.check(currentPermissions));
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
          <Route path={`${path}/bonuses`} component={Bonuses} />
          <Route path={`${path}/free-spins`} component={FreeSpins} />
          <Route path={`${path}/campaigns`} component={Campaigns} />
          <Redirect to={redirectUrl} />
        </Switch>
      </Fragment>
    );
  }
}

export default Rewards;
