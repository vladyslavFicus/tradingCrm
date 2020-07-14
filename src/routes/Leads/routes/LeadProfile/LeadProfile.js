import React, { PureComponent, Suspense } from 'react';
import { get } from 'lodash';
import { Switch, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
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
    leadData: PropTypes.query({
      lead: PropTypes.lead,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    auth: PropTypes.auth.isRequired,
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
      auth: { department },
    } = this.props;

    const lead = get(leadData, 'data.lead') || {};

    if (leadData.error) {
      return <NotFound />;
    }

    if (isLoading) {
      return null;
    }

    const isPhoneHidden = getBrand().privatePhoneByDepartment.includes(department);
    const isEmailHidden = getBrand().privateEmailByDepartment.includes(department);

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={lead}
            loading={isLoading}
            isEmailHidden={isEmailHidden}
          />
          <HideDetails>
            <Information
              data={lead}
              loading={isLoading}
              isPhoneHidden={isPhoneHidden}
              isEmailHidden={isEmailHidden}
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
  withStorage(['auth']),
  withRequests({
    leadData: LeadProfileQuery,
  }),
)(LeadProfile);
