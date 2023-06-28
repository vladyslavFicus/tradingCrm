import React, { useState } from 'react';
import I18n from 'i18n-js';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import ReactSwitch from 'components/ReactSwitch';
import { useEnableShowFtdToAffiliateMutation } from './graphql/__generated__/EnableShowFtdToAffiliateMutation';
import { useDisableShowFtdToAffiliateMutation } from './graphql/__generated__/DisableShowFtdToAffiliateMutation';
import './AffiliateSettings.scss';

type Props = {
  profileUuid: string,
  showFtdToAffiliate: boolean,
};

const AffiliateSettings = (props: Props) => {
  const { profileUuid, showFtdToAffiliate: initShowFtdToAffiliate } = props;

  const [showFtdToAffiliate, setShowFtdToAffiliate] = useState(initShowFtdToAffiliate);

  // ===== Permissions ===== //
  const permission = usePermission();
  const isAllowedToDisable = permission.allows(permissions.PAYMENT.DISABLE_SHOW_FTD_TO_AFFILIATE);
  const isAllowedToEnable = permission.allows(permissions.PAYMENT.ENABlE_SHOW_FTD_TO_AFFILIATE);

  // ===== Requests ===== //
  const [enableShowFtdToAffiliateMutation] = useEnableShowFtdToAffiliateMutation();
  const [disableShowFtdToAffiliateMutation] = useDisableShowFtdToAffiliateMutation();

  const notifySuccessSwitch = () => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
      message: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.SUCCESS'),
    });
  };

  const notifyErrorSwitch = () => {
    notify({
      level: LevelType.ERROR,
      title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
      message: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.ERROR'),
    });
  };

  // ===== Handlers ===== //
  const handleEnableShowFTD = async () => {
    await enableShowFtdToAffiliateMutation({ variables: { profileUuid } });

    setShowFtdToAffiliate(true);
    notifySuccessSwitch();
  };

  const handleDisableShowFTD = async () => {
    await disableShowFtdToAffiliateMutation({ variables: { profileUuid } });

    setShowFtdToAffiliate(false);
    notifySuccessSwitch();
  };

  const isToggleDisabled = () => (showFtdToAffiliate && !isAllowedToDisable)
    || (!showFtdToAffiliate && !isAllowedToEnable);

  return (
    <div className="AffiliateSettings">
      <div className="AffiliateSettings__title">
        {I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.TITLE')}
      </div>

      <ReactSwitch
        on={showFtdToAffiliate}
        stopPropagation
        disabled={isToggleDisabled()}
        className="AffiliateSettings__switcher"
        data-testid="AffiliateSettings-ftdToAffiliateSwitch"
        label={I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.LABEL')}
        labelPosition="right"
        onClick={showFtdToAffiliate ? handleDisableShowFTD : handleEnableShowFTD}
        onError={notifyErrorSwitch}
      />
    </div>
  );
};

export default React.memo(AffiliateSettings);
