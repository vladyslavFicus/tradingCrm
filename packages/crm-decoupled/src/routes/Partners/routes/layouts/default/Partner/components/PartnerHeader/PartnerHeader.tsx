import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import { Partner } from '__generated__/types';
import Uuid from 'components/Uuid';
import usePartnerHeader from 'routes/Partners/routes/hooks/usePartnerHeader';
import './PartnerHeader.scss';

type Props = {
  partner: Partner,
};

const PartnerHeader = (props: Props) => {
  const {
    partner: {
      fullName,
      country,
      uuid,
    },
  } = props;

  const {
    allowChangePassword,
    isLock,
    handleUnlockPartnerLogin,
    handleOpenChangePasswordModal,
  } = usePartnerHeader(props);

  return (
    <div className="PartnerHeader">
      <div className="PartnerHeader__topic">
        <div className="PartnerHeader__title">{fullName}</div>

        <div className="PartnerHeader__uuid">
          <If condition={!!uuid}>
            <Uuid uuid={uuid} />
          </If>

          <If condition={!!country}>
            <span>- {country}</span>
          </If>
        </div>
      </div>

      <div className="PartnerHeader__actions">
        <If condition={isLock}>
          <Button
            className="PartnerHeader__action"
            data-testid="PartnerHeader-unlockButton"
            onClick={handleUnlockPartnerLogin}
            primary
            small
          >
            {I18n.t('PARTNER_PROFILE.PROFILE.HEADER.UNLOCK')}
          </Button>
        </If>

        <If condition={allowChangePassword}>
          <Button
            className="PartnerHeader__action"
            data-testid="PartnerHeader-changePasswordButton"
            onClick={handleOpenChangePasswordModal}
            secondary
            small
          >
            {I18n.t('PARTNER_PROFILE.CHANGE_PASSWORD')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(PartnerHeader);
