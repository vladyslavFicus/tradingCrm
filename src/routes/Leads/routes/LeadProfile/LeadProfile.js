import React, { PureComponent, Suspense } from 'react';
import { get } from 'lodash';
import { Switch, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import EventEmitter, { LEAD_PROMOTED, ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import HideDetails from 'components/HideDetails';
import { leadProfileTabs } from '../../constants';
import LeadProfileTab from './routes/LeadProfileTab';
import LeadNotesTab from './routes/LeadNotesTab';
import Information from './components/Information';
import Header from './components/Header';
import {
  LeadProfileQuery,
} from './graphql';

class LeadProfile extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    leadProfileQuery: PropTypes.query({
      leadProfile: PropTypes.response(PropTypes.lead),
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(LEAD_PROMOTED, this.onLeadEvent);
    EventEmitter.on(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(LEAD_PROMOTED, this.onLeadEvent);
    EventEmitter.off(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  onLeadEvent = () => {
    this.props.leadProfileQuery.refetch();
  }

  onAcquisitionStatusChangedEvent = () => {
    this.props.leadProfileQuery.refetch();
  }

  render() {
    const {
      leadProfileQuery: { loading: leadProfileLoading, data: leadProfile },
      location,
      match: { params, path, url },
    } = this.props;

    const leadProfileData = get(leadProfile, 'leadProfile.data') || {};
    const leadProfileError = get(leadProfile, 'leadProfile.error');

    if (leadProfileError) {
      return <NotFound />;
    }

    if (leadProfileLoading) {
      return null;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={leadProfileData}
            loading={leadProfileLoading}
          />
          <HideDetails>
            <Information
              data={leadProfileData}
              loading={leadProfileLoading}
            />
          </HideDetails>
        </div>
        <Tabs items={leadProfileTabs} location={location} params={params} />
        <div className="card no-borders">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/profile`} component={LeadProfileTab} />
              <Route disableScroll path={`${path}/notes`} component={LeadNotesTab} />
              <Redirect to={`${url}/profile`} />
            </Switch>
          </Suspense>
        </div>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    leadProfileQuery: LeadProfileQuery,
  }),
)(LeadProfile);
