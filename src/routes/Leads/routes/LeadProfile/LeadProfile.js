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
import LeadFeedsTab from './routes/LeadFeedsTab';
import LeadNotesTab from './routes/LeadNotesTab';
import Information from './components/Information';
import Header from './components/Header';
import {
  LeadProfileQuery,
} from './graphql';

class LeadProfile extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    leadData: PropTypes.query({
      lead: PropTypes.lead,
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
    this.props.leadData.refetch();
  }

  onAcquisitionStatusChangedEvent = () => {
    this.props.leadData.refetch();
  }

  render() {
    const {
      location,
      leadData,
      leadData: { loading: isLoading },
      match: { params, path, url },
    } = this.props;

    const lead = get(leadData, 'data.lead') || {};

    if (leadData.error) {
      return <NotFound />;
    }

    if (isLoading) {
      return null;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={lead}
            loading={isLoading}
          />
          <HideDetails>
            <Information
              data={lead}
              loading={isLoading}
            />
          </HideDetails>
        </div>
        <Tabs items={leadProfileTabs} location={location} params={params} />
        <div className="card no-borders">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/profile`} component={LeadProfileTab} />
              <Route disableScroll path={`${path}/notes`} component={LeadNotesTab} />
              <Route disableScroll path={`${path}/feeds`} component={LeadFeedsTab} />
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
    leadData: LeadProfileQuery,
  }),
)(LeadProfile);
