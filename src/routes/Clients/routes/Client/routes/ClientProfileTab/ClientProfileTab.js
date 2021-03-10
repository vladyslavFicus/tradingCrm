import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import TabHeader from 'components/TabHeader';
import ClientPersonalForm from './components/ClientPersonalForm';
import ClientAddressForm from './components/ClientAddressForm';
import ClientKycForm from './components/ClientKycForm';
import ClientTransferForm from './components/ClientTransferForm';
import ClientContactsForm from './components/ClientContactsForm';
import ClientQuery from './graphql/ClientQuery';
import './ClientProfileTab.scss';

class ClientProfileTab extends PureComponent {
  static propTypes = {
    clientQuery: PropTypes.query({
      profile: PropTypes.profile,
    }).isRequired,
  };

  render() {
    const { clientQuery } = this.props;

    const clientData = clientQuery.data?.profile || {};

    return (
      <div className="ClientProfileTab">
        <TabHeader
          title={I18n.t('CLIENT_PROFILE.TABS.PROFILE')}
          className="ClientProfileTab__header"
        />

        <div className="ClientProfileTab__content">
          <div className="ClientProfileTab__column ClientProfileTab__column--large">
            <ClientPersonalForm clientData={clientData} />
            <ClientAddressForm clientData={clientData} />
          </div>

          <div className="ClientProfileTab__column  ClientProfileTab__column--thin">
            <ClientKycForm clientData={clientData} />
            <ClientTransferForm clientData={clientData} />
            <ClientContactsForm clientData={clientData} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRequests({
  clientQuery: ClientQuery,
})(ClientProfileTab);
