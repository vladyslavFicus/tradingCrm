import I18n from 'i18n-js';
import { useCallback, useState } from 'react';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { useEnableShowFtdToAffiliateMutation } from '../graphql/__generated__/EnableShowFtdToAffiliateMutation';
import { useDisableShowFtdToAffiliateMutation } from '../graphql/__generated__/DisableShowFtdToAffiliateMutation';

type Props = {
  profileUuid: string,
  showFtdToAffiliate: boolean,
};

type UseAffiliateSettings = {
  showFtdToAffiliate: boolean,
  isToggleDisabled: () => boolean,
  handleDisableShowFTD: () => void,
  handleEnableShowFTD: () => void,
  notifyErrorSwitch: () => void,
};

const useAffiliateSettings = (props: Props): UseAffiliateSettings => {
  const { profileUuid, showFtdToAffiliate: initShowFtdToAffiliate } = props;

  const [showFtdToAffiliate, setShowFtdToAffiliate] = useState(initShowFtdToAffiliate);

  // ===== Permissions ===== //
  const permission = usePermission();
  const isAllowedToDisable = permission.allows(permissions.PAYMENT.DISABLE_SHOW_FTD_TO_AFFILIATE);
  const isAllowedToEnable = permission.allows(permissions.PAYMENT.ENABlE_SHOW_FTD_TO_AFFILIATE);

  // ===== Requests ===== //
  const [enableShowFtdToAffiliateMutation] = useEnableShowFtdToAffiliateMutation();
  const [disableShowFtdToAffiliateMutation] = useDisableShowFtdToAffiliateMutation();

  const notifySuccessSwitch = useCallback(() => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
      message: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.SUCCESS'),
    });
  }, []);

  const notifyErrorSwitch = useCallback(() => {
    notify({
      level: LevelType.ERROR,
      title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
      message: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.ERROR'),
    });
  }, []);

  // ===== Handlers ===== //
  const handleEnableShowFTD = useCallback(async () => {
    await enableShowFtdToAffiliateMutation({ variables: { profileUuid } });

    setShowFtdToAffiliate(true);
    notifySuccessSwitch();
  }, [enableShowFtdToAffiliateMutation, profileUuid]);

  const handleDisableShowFTD = useCallback(async () => {
    await disableShowFtdToAffiliateMutation({ variables: { profileUuid } });

    setShowFtdToAffiliate(false);
    notifySuccessSwitch();
  }, [disableShowFtdToAffiliateMutation, profileUuid]);

  const isToggleDisabled = () => (showFtdToAffiliate && !isAllowedToDisable)
    || (!showFtdToAffiliate && !isAllowedToEnable);

  return {
    showFtdToAffiliate,
    isToggleDisabled,
    handleDisableShowFTD,
    handleEnableShowFTD,
    notifyErrorSwitch,
  };
};

export default useAffiliateSettings;
