import React, { useState } from 'react';
import Hotkeys from 'react-hot-keys';
import I18n from 'i18n-js';
import { Button } from 'components';
import { Config, Utils } from '@crm/common';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import NewOrderModal, { NewOrderModalProps } from 'routes/TE/modals/NewOrderModal';
import FixBalanceModal, { FixBalanceModalProps } from 'routes/TE/modals/FixBalanceModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Account } from '../../AccountProfile';
import { useArchiveMutation } from './graphql/__generated__/ArchiveMutation';
import { useTokenRenewMutation } from './graphql/__generated__/TokenRenewMutation';
import './AccountProfileHeader.scss';

type Props = {
  account: Account,
  handleRefetch: Function,
};

const AccountProfileHeader = (props: Props) => {
  const {
    account: {
      uuid,
      name,
      login,
      enable,
    },
  } = props;

  const [isReportDownloading, setIsReportDownloading] = useState(false);

  const [archive] = useArchiveMutation();
  const [tokenRenew] = useTokenRenewMutation();

  const permission = usePermission();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const fixBalanceModal = useModal<FixBalanceModalProps>(FixBalanceModal);
  const newOrderModal = useModal<NewOrderModalProps>(NewOrderModal);

  const handleNewOrderClick = () => {
    newOrderModal.show({
      login: login.toString(),
      onSuccess: () => Utils.EventEmitter.emit(Utils.ORDER_RELOAD),
    });
  };

  const handleArchiveAccount = async (enabled: boolean) => {
    const { handleRefetch } = props;

    try {
      await archive({
        variables: {
          uuid,
          enabled,
        },
      });

      handleRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.${enabled ? 'UNARCHIVE' : 'ARCHIVE'}`),
      });
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.group.disabled') {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.ACCOUNT_DISABLE_GROUP'),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: error.error === 'error.account.disable.prohibited'
            ? I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.ACCOUNT_DISABLE_PROHIBITED')
            : I18n.t('COMMON.FAILED'),
        });
      }
    }
  };

  const handleArchiveClick = (enabled: boolean) => {
    confirmActionModal.show({
      onSubmit: () => handleArchiveAccount(enabled),
      modalTitle: I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.${enabled ? 'UNARCHIVE' : 'ARCHIVE'}`),
      actionText: I18n.t(
        `TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.${enabled ? 'UNARCHIVE_TEXT' : 'ARCHIVE_TEXT'}`,
      ),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  const handleFixBalanceClick = () => {
    fixBalanceModal.show({ login: login.toString() });
  };

  const handleDownloadReportClick = async () => {
    setIsReportDownloading(true);

    try {
      const { token } = (await tokenRenew()).data?.auth.tokenRenew || {};

      const requestUrl = `${Config.getGraphQLUrl()}/report/${uuid}`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'x-client-version': Config.getVersion(),
        },
      });

      const blobData = await response.blob();

      Utils.downloadBlob(`${login}.xls`, blobData);
    } catch (e) {
      // Do nothing...
    }

    setIsReportDownloading(false);
  };

  return (
    <div className="AccountProfileHeader">
      <div className="AccountProfileHeader__topic">
        <div className="AccountProfileHeader__title">
          <Choose>
            <When condition={!enable}>
              <Badge
                danger
                text={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ARCHIVED')}
              >
                <div>{name}</div>
              </Badge>
            </When>
            <Otherwise>
              <div>{name}</div>
            </Otherwise>
          </Choose>
        </div>

        <div className="AccountProfileHeader__uuid">
          <Uuid uuid={login.toString()} uuidPrefix="TE" />
        </div>
      </div>
      <div className="AccountProfileHeader__actions">
        <If condition={permission.allows(Config.permissions.WE_TRADING.UPDATE_ACCOUNT_ENABLE)}>
          <Button
            className="AccountProfileHeader__action"
            data-testid="AccountProfileHeader-archiveButton"
            onClick={() => handleArchiveClick(!enable)}
            danger
            small
          >
            {I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.${enable ? 'ARCHIVE' : 'UNARCHIVE'}`)}
          </Button>
        </If>

        <If condition={permission.allows(Config.permissions.WE_TRADING.DOWNLOAD_REPORT)}>
          <Button
            className="AccountProfileHeader__action"
            data-testid="AccountProfileHeader-downloadReportButton"
            onClick={handleDownloadReportClick}
            submitting={isReportDownloading}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.DOWNLOAD_REPORT')}
          </Button>
        </If>

        <If
          condition={
          permission.allowsAny([
            Config.permissions.WE_TRADING.CREDIT_IN,
            Config.permissions.WE_TRADING.CREDIT_OUT,
            Config.permissions.WE_TRADING.CORRECTION_IN,
            Config.permissions.WE_TRADING.CORRECTION_OUT,
          ])
          }
        >
          <Button
            className="AccountProfileHeader__action"
            data-testid="AccountProfileHeader-fixBalanceButton"
            onClick={handleFixBalanceClick}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.FIX_BALANCE')}
          </Button>
        </If>

        {/* New order creation is possible only for active account */}
        <If condition={enable && permission.allows(Config.permissions.WE_TRADING.CREATE_ORDER)}>
          {/* Hotkey on F9 button to open new order modal */}
          <Hotkeys
            keyName="f9"
            onKeyUp={handleNewOrderClick}
          />

          <Button
            className="AccountProfileHeader__action"
            data-testid="AccountProfileHeader-newOrderButton"
            onClick={handleNewOrderClick}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NEW_ORDER')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(AccountProfileHeader);
