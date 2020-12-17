/* eslint-disable */

import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import Helmet from 'react-helmet';
import { withRequests } from 'apollo'; // parseErrors ?
import { withPermission } from 'providers/PermissionsProvider'; // ?
import Permissions from 'utils/permissions'; // ?
import EventEmitter, { CLIENT_RELOAD, ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import BackToTop from 'components/BackToTop';
import HideDetails from 'components/HideDetails';
import ShortLoader from 'components/ShortLoader';
import Route from 'components/Route';
import NotFound from 'routes/NotFound';

import ClientHeader from './components/ClientHeader';
import ClientAccountStatus from './components/ClientAccountStatus';

import ClientLastLogin from './components/ClientLastLogin';
import ClientLastActivity from './components/ClientLastActivity';
import ClientRegistrationInfo from './components/ClientRegistrationInfo';
import ClientReferrals from './components/ClientReferrals';

import ClientAcquisitionStatus from './components/ClientAcquisitionStatus';
import ClientLastIps from './components/ClientLastIps';
import ClientPinnedNotes from './components/ClientPinnedNotes';

import ClientProfileTab from './routes/ClientProfileTab';
import ClientPaymentsTab from './routes/ClientPaymentsTab';
import ClientTradingActivityTab from './routes/ClientTradingActivityTab';
import ClientTradingAccountsTab from './routes/ClientTradingAccountsTab';
import ClientCallbacksTab from './routes/ClientCallbacksTab';
import ClientNotesTab from './routes/ClientNotesTab';
import ClientFilesTab from './routes/ClientFilesTab';
import ClientFeedsTab from './routes/ClientFeedsTab';
import ClientReferralsTab from './routes/ClientReferralsTab';


import { clientTabs } from './constants';
import ClientQuery from './graphql/ClientQuery';
import './Client.scss';


class Client extends PureComponent {
  static propTypes = {
    clientQuery: PropTypes.query({
      profile: PropTypes.profile,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  }

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.onClientEvent);
    EventEmitter.on(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.onClientEvent);
    EventEmitter.off(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
  }

  onClientEvent = () => {
    this.props.clientQuery.refetch();
  };

  onAcquisitionStatusChangedEvent = () => {
    this.props.clientQuery.refetch();
  };

  render() {
    const {
      clientQuery,
      match: { path, url },
    } = this.props;

    const client = clientQuery.data?.profile;
    const clientError = clientQuery.error || false;
    const isLoading = clientQuery.loading;

    const {
      uuid,
      status,
      lastName,
      firstName,
      acquisition,
      profileView,
      registrationDetails,
    } = client || {};

    const {
      online,
      lastActivity,
      lastSignInSessions,
    } = profileView || {};

    if (clientError) {
      return <NotFound />;
    }

    if (!client && isLoading) {
      return <ShortLoader />;
    }

    return (
      <div className="Client">
        <Helmet title={`${firstName} ${lastName}`} />

        <ClientHeader client={client} />

        <div className="Client__content">
          <div className="Client__info">
            <ClientAccountStatus
              clientUuid={uuid}
              status={status}
            />

            {/* ClientBalance */}

            <ClientLastLogin
              lastSignInSession={lastSignInSessions && lastSignInSessions[lastSignInSessions.length -1]}
            />

            <ClientLastActivity
              lastActivity={lastActivity}
              onlineStatus={online}
            />

            <ClientRegistrationInfo registrationDate={registrationDetails?.registrationDate} />

            <ClientReferrals clientUuid={uuid} />
          </div>

          <HideDetails>
            <div className="Client__details">
              {/* ClientPersonalInfo */}
              <ClientAcquisitionStatus clientUuid={uuid} clientAcquisition={acquisition} />
              <ClientLastIps lastSignInSessions={lastSignInSessions || []} />
              <ClientPinnedNotes clientUuid={uuid} />
            </div>
          </HideDetails>
        </div>

        <Tabs items={clientTabs} />

        <div className="Client__tab-content">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/profile`} component={ClientProfileTab} />
              <Route path={`${path}/payments`} component={ClientPaymentsTab} />
              <Route path={`${path}/trading-activity`} component={ClientTradingActivityTab} />
              <Route path={`${path}/accounts`} component={ClientTradingAccountsTab} />
              <Route path={`${path}/callbacks`} component={ClientCallbacksTab} />
              <Route path={`${path}/notes`} component={ClientNotesTab} />
              <Route path={`${path}/files`} component={ClientFilesTab} />
              <Route path={`${path}/feed`} component={ClientFeedsTab} />
              <Route path={`${path}/referrals`} component={ClientReferralsTab} />
              <Redirect to={`${url}/profile`} />
            </Switch>
          </Suspense>
        </div>
        <BackToTop />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    clientQuery: ClientQuery,
  }),
)(Client);