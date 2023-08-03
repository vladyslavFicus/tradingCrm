import { useState, useCallback } from 'react';
import I18n from 'i18n-js';
import { getBrand, getBackofficeBrand, getGraphQLUrl, getVersion } from 'config';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import UpdateTradingAccountModal, { UpdateTradingAccountModalProps } from 'modals/UpdateTradingAccountModal';
import UpdateLeverageModal, { UpdateLeverageModalProps } from 'modals/UpdateLeverageModal';
import UpdateTradingAccountPasswordModal, {
  UpdateTradingAccountPasswordModalProps,
} from 'modals/UpdateTradingAccountPasswordModal';
import downloadBlob from 'utils/downloadBlob';
import { useApproveChangingLeverageMutation } from '../graphql/__generated__/ApproveChangingLeverageMutation';
import { useRejectChangingLeverageMutation } from '../graphql/__generated__/RejectChangingLeverageMutation';
import { useToggleDisabledTradingAccountMutation } from '../graphql/__generated__/ToggleDisabledTradingAccountMutation';
import { useTokenRenewMutation } from '../graphql/__generated__/TokenRenewMutation';

type Props = {
  onRefetch: () => void,
};

const useClientTradingAccountsGrid = (props: Props) => {
  const { onRefetch } = props;

  const [reportDownloadingUuid, setReportDownloadingUuid] = useState('');

  const brand = getBrand();
  const columnsOrder = getBackofficeBrand()?.tables?.clientTradingAccounts?.columnsOrder || [];

  // ===== Permissions ===== //
  const permission = usePermission();
  const isReadOnly = permission.allows(permissions.TRADING_ACCOUNT.READ_ONLY);
  const canRenameAccount = permission.allows(permissions.TRADING_ACCOUNT.RENAME_ACCOUNT);
  const updatePasswordPermission = permission.allows(permissions.TRADING_ACCOUNT.UPDATE_PASSWORD);
  const allowDownloadReport = permission.allows(permissions.TRADING_ACCOUNT.DOWNLOAD_REPORT);

  // ===== Modals ===== //
  const updateTradingAccountModal = useModal<UpdateTradingAccountModalProps>(UpdateTradingAccountModal);
  const updateLeverageModal = useModal<UpdateLeverageModalProps>(UpdateLeverageModal);
  const updateTradingAccountPasswordModal = useModal<UpdateTradingAccountPasswordModalProps>(
    UpdateTradingAccountPasswordModal,
  );

  // ===== Requests ===== //
  const [approveChangingLeverageMutation] = useApproveChangingLeverageMutation();
  const [rejectChangingLeverageMutation] = useRejectChangingLeverageMutation();
  const [toggleDisabledTradingAccountMutation] = useToggleDisabledTradingAccountMutation();
  const [tokenRenew] = useTokenRenewMutation();

  // ===== Handlers ===== //
  const handleSetTradingAccountReadonly = useCallback((accountUUID: string, readOnly: boolean) => async () => {
    try {
      await toggleDisabledTradingAccountMutation({ variables: { accountUUID, readOnly } });

      onRefetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [onRefetch, toggleDisabledTradingAccountMutation]);

  const handleRejectChangeLeverage = useCallback(async (accountUUID: string) => {
    try {
      await rejectChangingLeverageMutation({ variables: { accountUUID } });

      onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CANCEL_NOTIFICATION'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [onRefetch, rejectChangingLeverageMutation]);

  const handleApproveChangeLeverage = useCallback(async (accountUUID: string) => {
    try {
      await approveChangingLeverageMutation({ variables: { accountUUID } });

      onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.APPROVE_NOTIFICATION'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [onRefetch, approveChangingLeverageMutation]);

  const handleDownloadReportClick = useCallback(async (accountUUID: string, login: string) => {
    setReportDownloadingUuid(accountUUID);
    try {
      const { token } = (await tokenRenew()).data?.auth.tokenRenew || {};
      const requestUrl = `${getGraphQLUrl()}/accounts/report/${accountUUID}`;
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'x-client-version': getVersion(),
        },
      });
      const blobData = await response.blob();
      downloadBlob(`${login}.xls`, blobData);
    } catch (e) {
      // Do nothing...
    }
    setReportDownloadingUuid('');
  }, [tokenRenew]);

  return {
    reportDownloadingUuid,
    updateTradingAccountPasswordModal,
    canRenameAccount,
    updateTradingAccountModal,
    allowDownloadReport,
    brand,
    updateLeverageModal,
    isReadOnly,
    columnsOrder,
    updatePasswordPermission,
    handleRejectChangeLeverage,
    handleApproveChangeLeverage,
    handleSetTradingAccountReadonly,
    handleDownloadReportClick,
  };
};

export default useClientTradingAccountsGrid;
