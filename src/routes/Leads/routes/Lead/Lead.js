import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import NotFound from 'routes/NotFound';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import HideDetails from 'components/HideDetails';
import EventEmitter, { LEAD_PROMOTED, ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import LeadHeader from './components/LeadHeader';
import LeadAccountStatus from './components/LeadAccountStatus';
import LeadAcquisitionStatus from './components/LeadAcquisitionStatus';
import LeadRegistrationInfo from './components/LeadRegistrationInfo';
import LeadPersonalInfo from './components/LeadPersonalInfo';
import LeadPinnedNotes from './components/LeadPinnedNotes';
import LeadProfileTab from './routes/LeadProfileTab';
import LeadFeedsTab from './routes/LeadFeedsTab';
import LeadNotesTab from './routes/LeadNotesTab';
import { leadTabs } from './constants';
import LeadQuery from './graphql/LeadQuery';
import './Lead.scss';

class Lead extends PureComponent {
  static propTypes = {
    leadQuery: PropTypes.query({
      lead: PropTypes.lead,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
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
    this.props.leadQuery.refetch();
  }

  onAcquisitionStatusChangedEvent = () => {
    this.props.leadQuery.refetch();
  }

  render() {
    const {
      leadQuery,
      match: { path, url },
    } = this.props;

    const lead = leadQuery.data?.lead || {};
    const leadError = leadQuery.error;
    const isLoading = leadQuery.loading;

    if (leadError) {
      return <NotFound />;
    }

    if (isLoading) {
      return null;
    }

    return (
      <div className="Lead">
        <LeadHeader lead={lead} />

        <div className="Lead__content">
          <div className="Lead__info">
            <LeadAccountStatus lead={lead} />
            <LeadRegistrationInfo registrationDate={lead.registrationDate} />
          </div>

          <HideDetails>
            <div className="Lead__details">
              <LeadPersonalInfo lead={lead} />

              <LeadAcquisitionStatus lead={lead} />
              <LeadPinnedNotes uuid={lead.uuid} />
            </div>
          </HideDetails>
        </div>

        <Tabs items={leadTabs} />

        <div className="Lead__tab-content">
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
    leadQuery: LeadQuery,
  }),
)(Lead);
