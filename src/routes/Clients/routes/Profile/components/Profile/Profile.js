import React, { PureComponent, Fragment, Suspense } from 'react';
import { get } from 'lodash';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import compose from 'compose-function';
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

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.on(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.off(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  onProfileEvent = () => {
    this.props.profileQuery.refetch();
  };

  onAcquisitionStatusChangedEvent = () => {
    this.props.profileQuery.refetch();
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
    const {
      profileQuery: {
        data,
        loading,
        error,
      },
      match: { path },
    } = this.props;

    if (error && parseErrors(error).error === 'error.entity.not.found') {
      return <NotFound />;
    }
    const profileData = get(data, 'profile');

    if (loading && !profileData) {
      return null;
    }

    return (
      <Fragment>
        <If condition={profileData}>
          <Helmet title={`${profileData.firstName} ${profileData.lastName}`} />
        </If>
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

export default compose(
  withRouter,
  withPermission,
  withRequests({
    profileQuery: ProfileQuery,
  }),
)(Profile);
