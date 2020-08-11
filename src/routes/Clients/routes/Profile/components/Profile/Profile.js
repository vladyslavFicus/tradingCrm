import React, { Component, Fragment, Suspense } from 'react';
import { get } from 'lodash';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { compose } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import EventEmitter, { PROFILE_RELOAD, ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
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
import ProfileQuery from './graphql/ProfileQuery';
import UserAcquisitionQuery from './graphql/UserAcquisitionQuery';
import { userProfileTabs } from './constants';

class Profile extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
    }).isRequired,
    profile: PropTypes.profile.isRequired,
    acquisitionQuery: PropTypes.query({
      userHierarchyAcquisitionById: PropTypes.userAcquisition,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.on(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.off(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  onProfileEvent = () => {
    this.props.profile.refetch();
  };

  onAcquisitionStatusChangedEvent = () => {
    this.props.acquisitionQuery.refetch();
  };

  get availableStatuses() {
    const { profile, permission: { permissions } } = this.props;
    const profileStatus = get(profile, 'data.profile.status.type');

    if (!profileStatus) {
      return [];
    }

    return userStatuses[profileStatus]
      .filter(action => (new Permissions([action.permission]))
        .check(permissions));
  }

  render() {
    const {
      profile: {
        data: profileData,
        loading,
        error,
      },
      acquisitionQuery: {
        data: acquisitionData,
      },
      match: { path },
    } = this.props;

    if (error && parseErrors(error).error === 'error.entity.not.found') {
      return <NotFound />;
    }
    const profile = get(profileData, 'profile');
    const acquisition = get(acquisitionData, 'userHierarchyAcquisitionById') || {};
    const lastSignInSessions = get(profile, 'profileView.lastSignInSessions') || [];

    if (loading && !profile) {
      return null;
    }

    return (
      <Fragment>
        <If condition={profile}>
          <Helmet title={`${profile.firstName} ${profile.lastName}`} />
        </If>
        <div className="profile__info">
          <ProfileHeader
            profile={profile}
            availableStatuses={this.availableStatuses}
            loaded={!loading}
          />
          <HideDetails>
            <Information
              profile={profile}
              ips={lastSignInSessions}
              acquisition={acquisition}
              loading={loading && !profile}
            />
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

export default compose(
  withRouter,
  withPermission,
  withRequests({
    profile: ProfileQuery,
    acquisitionQuery: UserAcquisitionQuery,
  }),
)(Profile);
