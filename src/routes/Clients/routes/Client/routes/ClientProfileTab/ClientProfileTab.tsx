import React from 'react';
import I18n from 'i18n-js';
import { useParams } from 'react-router-dom';
import { getBrand } from 'config';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import TabHeader from 'components/TabHeader';
import ShortLoader from 'components/ShortLoader/ShortLoader';
import NotFound from 'routes/NotFound/NotFound';
import { useClientQuery } from '../../graphql/__generated__/ClientQuery';
import ClientPersonalForm from './components/ClientPersonalForm';
import ClientAddressForm from './components/ClientAddressForm';
import ClientKycForm from './components/ClientKycForm';
import ClientTransferForm from './components/ClientTransferForm';
import ClientContactsForm from './components/ClientContactsForm';
import AffiliateSettings from './components/AffiliateSettings';
import './ClientProfileTab.scss';

const ClientProfileTab = () => {
  const { id: playerUUID } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const { data, loading } = useClientQuery({ variables: { playerUUID }, errorPolicy: 'all' });
  const profile = data?.profile;

  const hasAffiliate = !!profile?.profileView?.affiliate;
  const showFtdToAffiliate = !!profile?.profileView?.affiliate?.ftd?.isVisible;
  const affiliateMinFtdDeposit = profile?.affiliate?.partner?.permission?.minFtdDeposit;

  const { affiliate: { restriction: { minFtdDeposit } } } = getBrand();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowsFtdToAffiliate = permission.allowsAny([
    permissions.PAYMENT.DISABLE_SHOW_FTD_TO_AFFILIATE,
    permissions.PAYMENT.ENABlE_SHOW_FTD_TO_AFFILIATE,
  ]);

  if (loading) {
    return <ShortLoader />;
  }

  if (!profile) {
    return <NotFound />;
  }

  return (
    <div className="ClientProfileTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.TABS.PROFILE')}
        className="ClientProfileTab__header"
      />

      <div className="ClientProfileTab__content">
        <div className="ClientProfileTab__column ClientProfileTab__column--large">
          <ClientPersonalForm profile={profile} />

          <ClientAddressForm profile={profile} />

          <If condition={allowsFtdToAffiliate && hasAffiliate && (affiliateMinFtdDeposit || minFtdDeposit)}>
            <AffiliateSettings
              showFtdToAffiliate={showFtdToAffiliate}
              profileUuid={profile.uuid}
            />
          </If>
        </div>

        <div className="ClientProfileTab__column  ClientProfileTab__column--thin">
          <ClientKycForm profile={profile} />

          <ClientTransferForm profile={profile} />

          <ClientContactsForm profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ClientProfileTab);
