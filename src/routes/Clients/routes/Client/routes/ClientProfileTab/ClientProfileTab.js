import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { getBrand } from 'config';
import permissions from 'config/permissions';
import { CONDITIONS } from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import TabHeader from 'components/TabHeader';
import PermissionContent from 'components/PermissionContent';
import ClientPersonalForm from './components/ClientPersonalForm';
import ClientAddressForm from './components/ClientAddressForm';
import ClientKycForm from './components/ClientKycForm';
import ClientTransferForm from './components/ClientTransferForm';
import ClientContactsForm from './components/ClientContactsForm';
import AffiliateSettings from './components/AffiliateSettings';
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
    const showFtdToAffiliate = clientData.profileView?.paymentDetails?.showFtdToAffiliate;
    const affiliateMinFtdDeposit = clientData.affiliate?.partner?.permission?.minFtdDeposit;
    const { affiliate: { restriction: { minFtdDeposit } } } = getBrand();

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
            <PermissionContent
              permissionsCondition={CONDITIONS.OR}
              permissions={[
                permissions.PAYMENT.DISABLE_SHOW_FTD_TO_AFFILIATE, permissions.PAYMENT.ENABlE_SHOW_FTD_TO_AFFILIATE]}
            >
              <If
                condition={
                  typeof showFtdToAffiliate === 'boolean'
                  && clientData?.affiliate
                  && (minFtdDeposit || affiliateMinFtdDeposit)
                }
              >
                <AffiliateSettings
                  showFtdToAffiliate={showFtdToAffiliate}
                  profileUuid={clientData?.uuid}
                />
              </If>
            </PermissionContent>
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
