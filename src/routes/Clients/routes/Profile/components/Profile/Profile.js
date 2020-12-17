/* eslint-disable */

import React, { PureComponent, Fragment, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import BackToTop from 'components/BackToTop';
import HideDetails from 'components/HideDetails';
import Route from 'components/Route';
import ProfileHeader from '../ProfileHeader';
import Information from '../Information';

class Profile extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    profileQuery: PropTypes.query({
      profile: PropTypes.profile,
    }).isRequired,
  };

  render() {
    return (
      <Fragment>
        <div className="profile__info">
          <ProfileHeader
            profile={profileData}
            availableStatuses={this.availableStatuses}
            loaded={!loading}
          />
          <HideDetails>
            <Information profile={profileData} profileLoading={loading} />
          </HideDetails>
        </div>

        <div className="card no-borders">
          <Suspense fallback={null}>
            <Switch>
              <Route disableScroll path={`${path}/profile`} component={ClientView} />
              <Route disableScroll path={`${path}/payments`} component={Payments} />
              <Route disableScroll path={`${path}/trading-activity`} component={TradingActivity} />
              <Route disableScroll path={`${path}/accounts`} component={Accounts} />
              <Route disableScroll path={`${path}/callbacks`} component={ClientCallbacksTab} />
              <Route disableScroll path={`${path}/notes`} component={Notes} />
              <Route disableScroll path={`${path}/files`} component={Files} />
              <Route disableScroll path={`${path}/feed`} component={Feed} />
              <Route disableScroll path={`${path}/referrals`} component={Referrals} />
              <Redirect to={`${path}/profile`} />
            </Switch>
          </Suspense>
        </div>
        <BackToTop />
      </Fragment>
    );
  }
}
