import React, { Component, Fragment, Suspense } from 'react';
import { get } from 'lodash';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
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
} from '../../routes';
import ProfileHeader from '../ProfileHeader';
import Information from '../Information';
import ProfileQuery from './graphql/ProfileQuery';
import { userProfileTabs } from './constants';

class Profile extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
    }).isRequired,
    newProfile: PropTypes.query(PropTypes.newProfile).isRequired,
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
    this.props.newProfile.refetch();
  };

  onAcquisitionStatusChangedEvent = () => {
    this.props.newProfile.refetch();
  };

  get availableStatuses() {
    const { newProfile, permission: { permissions } } = this.props;
    const profileStatus = get(newProfile, 'data.newProfile.data.status.type');

    if (!profileStatus) {
      return [];
    }

    return userStatuses[profileStatus]
      .filter(action => (new Permissions([action.permission]))
        .check(permissions));
  }

  render() {
    if (get(this.props, 'newProfile.data.newProfile.error')) {
      return <NotFound />;
    }

    const {
      newProfile: {
        data,
        loading,
      },
      match: { path },
    } = this.props;

    const newProfileData = get(data, 'newProfile.data');
    const acquisitionData = get(newProfileData, 'acquisition') || {};
    const lastSignInSessions = get(newProfileData, 'profileView.lastSignInSessions') || [];

    if (loading && !newProfileData) {
      return null;
    }

    return (
      <Fragment>
        <If condition={newProfileData}>
          <Helmet title={`${newProfileData.firstName} ${newProfileData.lastName}`} />
        </If>
        <div className="profile__info">
          <ProfileHeader
            newProfile={newProfileData}
            availableStatuses={this.availableStatuses}
            loaded={!loading}
          />
          <HideDetails>
            <Information
              newProfile={newProfileData}
              ips={lastSignInSessions}
              acquisitionData={acquisitionData}
              loading={loading && !newProfileData}
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
    newProfile: ProfileQuery,
  }),
)(Profile);
