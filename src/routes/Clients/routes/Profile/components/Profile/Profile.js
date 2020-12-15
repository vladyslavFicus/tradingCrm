/* eslint-disable */

import React, { PureComponent, Fragment, Suspense } from 'react';
import { get } from 'lodash';
import { Switch, Redirect } from 'react-router-dom';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import {
  statusActions as userStatuses,
} from 'constants/user';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import BackToTop from 'components/BackToTop';
import HideDetails from 'components/HideDetails';
import Route from 'components/Route';
import NotFound from 'routes/NotFound';
import {
  ClientView,
  Payments,
  TradingActivity,
  Accounts,
  Notes,
  Files,
  Feed,
  ClientCallbacksTab,
  Referrals,
} from '../../routes';
import ProfileHeader from '../ProfileHeader';
import Information from '../Information';
import { userProfileTabs } from './constants';

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

  get availableStatuses() {
    const { profileQuery, permission: { permissions } } = this.props;
    const profileStatus = get(profileQuery, 'data.profile.status.type');

    if (!profileStatus) {
      return [];
    }

    return userStatuses[profileStatus]
      .filter(action => (new Permissions([action.permission]))
        .check(permissions));
  }

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

        <Tabs items={userProfileTabs} />

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
