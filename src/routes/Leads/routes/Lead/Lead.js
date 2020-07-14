import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import { getBrand } from 'config';
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
import LeadNotesTab from './routes/LeadNotesTab';
import LeadQuery from './graphql/LeadQuery';
import { leadTabs } from './constants';
import './Lead.scss';

class Lead extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    leadData: PropTypes.query({
      lead: PropTypes.lead,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.object,
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    auth: PropTypes.auth.isRequired,
  }

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
      leadData,
      location,
      match: { params, path, url },
      auth: { department },
    } = this.props;

    const lead = get(leadData, 'data.lead') || {};
    const leadError = leadData.error;
    const isLoading = leadData.loading;

    const isPhoneHidden = getBrand().privatePhoneByDepartment.includes(department);
    const isEmailHidden = getBrand().privateEmailByDepartment.includes(department);

    if (leadError) {
      return <NotFound />;
    }

    if (isLoading) {
      return null;
    }

    return (
      <div className="Lead">
        <div className="Lead__content">
          <LeadHeader lead={lead} isEmailHidden={isEmailHidden} />

          <div className="Lead__info">
            <LeadAccountStatus lead={lead} />
            <LeadRegistrationInfo registrationDate={lead.registrationDate} />
          </div>

          <HideDetails>
            <div className="Lead__details">
              <LeadPersonalInfo
                lead={lead}
                isPhoneHidden={isPhoneHidden}
                isEmailHidden={isEmailHidden}
              />

              <LeadAcquisitionStatus lead={lead} />
              <LeadPinnedNotes uuid={lead.uuid} />
            </div>
          </HideDetails>
        </div>

        <Tabs items={leadTabs} location={location} params={params} />

        <div className="Lead__tab-content">
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
  withStorage(['auth']),
  withRequests({
    leadData: LeadQuery,
  }),
)(Lead);
