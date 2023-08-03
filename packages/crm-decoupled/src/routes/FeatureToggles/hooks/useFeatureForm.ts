import { useCallback, useMemo } from 'react';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import { LevelType } from 'types';
import { parseErrors } from 'apollo';
import { PlatformType__Enum as PlatformType } from '__generated__/types';
import { notify } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { FormValues } from '../types/featureForm';
import { useBrandConfigQuery } from '../graphql/__generated__/BrandConfigQuery';
import { useUpdateBrandConfigMutation } from '../graphql/__generated__/UpdateBrandConfigMutation';

const useFeatureForm = () => {
  const id = v4();

  // ===== Requests ===== //
  const { data, refetch } = useBrandConfigQuery();
  const brandConfig = data?.featureToggles;

  const [updateBrandConfigMutation] = useUpdateBrandConfigMutation();

  const {
    restrictedCountries,
    paymentAmounts,
    profileDepositEnable,
    notificationCleanUpDays,
    hideChangePasswordCp,
    referralEnable,
    platformMaxAccounts,
    paymentDeposits,
    accountAutoCreations,
    affiliateClientAutoLogoutEnable,
    affiliateClientAutoLogoutMinutes,
    version,
  } = brandConfig || {};

  // ===== Modals ===== //
  const confirmUpdateVersionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues) => {
    const { depositButtons, platformMaxAccounts: updatedPlatform, accountAutoCreations: updatedAccounts } = values;
    const depositAmounts = Object.values(depositButtons).filter(deposit => !!deposit);

    const newPlatformMaxAccounts = platformMaxAccounts?.map((platform) => {
      const updatedMaxLiveAccounts = updatedPlatform[platform?.platformType as PlatformType];

      return { platformType: platform?.platformType as PlatformType, maxLiveAccounts: updatedMaxLiveAccounts };
    });

    const updatedAccountAutoCreations = Object.entries(updatedAccounts).map(([key, value]) => {
      const [platformType, accountCurrency] = key.split('-');

      return {
        accountCurrency,
        createOnRegistration: value,
        platformType: platformType as PlatformType,
      };
    });

    try {
      await updateBrandConfigMutation({
        variables: {
          restrictedCountries: values?.restrictedCountries || [],
          version: version || 0,
          paymentAmounts: depositAmounts as Array<number>,
          profileDepositEnable: !!values?.profileDepositEnable,
          hideChangePasswordCp: values?.hideChangePasswordCp,
          referralEnable: values?.referralEnable,
          notificationCleanUpDays: values?.notificationCleanUpDays || 0,
          affiliateClientAutoLogoutEnable: values?.autoLogout,
          affiliateClientAutoLogoutMinutes: values?.autoLogout ? values?.affiliateClientAutoLogoutMinutes : null,
          platformMaxAccounts: newPlatformMaxAccounts || [],
          paymentDeposits: values?.paymentDeposits || [],
          accountAutoCreations: updatedAccountAutoCreations || [],
        },
      });

      await refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.SUCCESS'),
        message: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.SUCCESS'),
      });
    } catch (e: any) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.version.conflict') {
        confirmUpdateVersionModal.show({
          modalTitle: I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_VERSION_MODAL.TITLE'),
          actionText: I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_VERSION_MODAL.TEXT'),
          submitButtonLabel: I18n.t('COMMON.BUTTONS.UPDATE_NOW'),
          onSubmit: async () => {
            await refetch();
          },
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.ERROR'),
        });
      }
    }
  }, [platformMaxAccounts, version]);

  const initialAccountAutoCreations = useMemo(() => accountAutoCreations?.reduce((acc, account) => (
    { ...acc, [`${account?.platformType}-${account?.accountCurrency}`]: account?.createOnRegistration }), {}),
  [accountAutoCreations]);

  const initialPlatformMaxAccounts = useMemo(() => platformMaxAccounts?.reduce((acc, platformAcc) => (
    { ...acc, [platformAcc?.platformType]: platformAcc?.maxLiveAccounts }), {}),
  [platformMaxAccounts]);

  return {
    id,
    restrictedCountries,
    paymentAmounts,
    profileDepositEnable,
    notificationCleanUpDays,
    hideChangePasswordCp,
    referralEnable,
    platformMaxAccounts,
    paymentDeposits,
    accountAutoCreations,
    affiliateClientAutoLogoutEnable,
    affiliateClientAutoLogoutMinutes,
    initialAccountAutoCreations,
    initialPlatformMaxAccounts,
    handleSubmit,
  };
};

export default useFeatureForm;
