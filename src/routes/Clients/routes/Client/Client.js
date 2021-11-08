import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import Helmet from 'react-helmet';
import { withRequests, hasErrorPath } from 'apollo';
import Trackify from '@hrzn/trackify';
import EventEmitter, { CLIENT_RELOAD, ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import Tabs from 'components/Tabs';
import BackToTop from 'components/BackToTop';
import HideDetails from 'components/HideDetails';
import ShortLoader from 'components/ShortLoader';
import Route from 'components/Route';
import PermissionContent from 'components/PermissionContent';
import NotFound from 'routes/NotFound';
import ClientHeader from './components/ClientHeader';
import ClientAccountStatus from './components/ClientAccountStatus';
import ClientBalance from './components/ClientBalance';
import ClientLastLogin from './components/ClientLastLogin';
import ClientLastActivity from './components/ClientLastActivity';
import ClientRegistrationInfo from './components/ClientRegistrationInfo';
import ClientReferrals from './components/ClientReferrals';
import ClientPersonalInfo from './components/ClientPersonalInfo';
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
      params: PropTypes.object,
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props;

    EventEmitter.on(CLIENT_RELOAD, this.onClientEvent);
    EventEmitter.on(ACQUISITION_STATUS_CHANGED, this.onAcquisitionStatusChangedEvent);
    Trackify.page({
      eventAction: 'PROFILE_OPENED',
      eventLabel: id,
    });
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
    const clientError = hasErrorPath(clientQuery.error, 'profile');
    const isLoading = clientQuery.loading;

    const {
      uuid,
      status,
      lastName,
      firstName,
      acquisition,
      profileView,
      tradingAccounts,
      registrationDetails,
    } = client || {};

    const {
      online,
      balance,
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

            <ClientBalance
              clientUuid={uuid}
              registrationDate={registrationDetails?.registrationDate}
              tradingAccounts={tradingAccounts || []}
              balance={balance}
            />

            <ClientLastLogin
              lastSignInSession={lastSignInSessions && lastSignInSessions[lastSignInSessions.length - 1]}
            />

            <ClientLastActivity
              lastActivity={lastActivity}
              onlineStatus={online}
            />

            <ClientRegistrationInfo registrationDate={registrationDetails?.registrationDate} />

            <PermissionContent permissions={permissions.USER_PROFILE.REFERRER_STATISTICS}>
              <ClientReferrals clientUuid={uuid} />
            </PermissionContent>
          </div>

          <HideDetails>
            <div className="Client__details">
              <ClientPersonalInfo clientInfo={client} />

              <ClientAcquisitionStatus
                clientUuid={uuid}
                clientAcquisition={acquisition}
              />

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
