import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import AccountProfileHeader from './components/AccountProfileHeader';
import AccountProfileStatus from './components/AccountProfileStatus';
import AccountProfileGroup from './components/AccountProfileGroup';
import AccountProfileLeverage from './components/AccountProfileLeverage';
import AccountProfileRegistered from './components/AccountProfileRegistered';
import AccountProfileOrdersGrid from './routes/AccountProfileOrdersGrid';
import { accountProfileTabs } from './constants';
import './TradingEngineAccountProfile.scss';

class TradingEngineAccountProfile extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  }

  render() {
    const {
      match: { path, url },
    } = this.props;

    return (
      <div className="TradingEngineAccountProfile">
        <Helmet title="Account profile" />

        <AccountProfileHeader />

        <div className="TradingEngineAccountProfile__content">
          <div className="TradingEngineAccountProfile__info">
            <AccountProfileStatus />
            <AccountProfileGroup />
            <AccountProfileLeverage />
            <AccountProfileRegistered />
          </div>
        </div>

        <Tabs items={accountProfileTabs} />

        <div className="TradingEngineAccountProfile__tab-content">
          <Switch>
            <Route path={`${path}/orders`} component={AccountProfileOrdersGrid} />
            <Route path={`${path}/exposure`} component={() => null} />
            <Redirect to={`${url}/orders`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default TradingEngineAccountProfile;
