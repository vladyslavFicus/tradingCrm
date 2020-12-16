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

    const clientLastSignInSessions = client?.profileView?.lastSignInSessions || [];

    if (clientError) {
      return <NotFound />;
    }

    if (!client && isLoading) {
      return <ShortLoader />;
    }

    return (
      <div className="Client">
        <Helmet title={`${client.firstName} ${client.lastName}`} />

        <ClientHeader client={client} />

        <div className="Client__content">
          <div className="Client__info">
            <ClientAccountStatus client={client} />
            {/* ClientBalance */}
            <ClientLastLogin lastSignInSession={clientLastSignInSessions[clientLastSignInSessions.length - 1]} />
            {/* ClientLastActivity */}
            {/* ClientRegistrationInfo */}
            {/* ClientReferrals */}
          </div>

          <div className="Client__details">
            {/* ClientPersonalInfo */}
            {/* ClientAcquisitionStatus */}
            {/* ClientLast10Ips */}
            {/* ClientPinnedNotes */}
          </div>

          {/* <HideDetails>

          </HideDetails> */}
        </div>

        {/* <Tabs items={}/> */}

        <div className="Client__tab-content">
          {/* <Suspense fallback={null}>
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
              <Redirect to={`${url}/profile`} />
            </Switch>
          </Suspense> */}
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