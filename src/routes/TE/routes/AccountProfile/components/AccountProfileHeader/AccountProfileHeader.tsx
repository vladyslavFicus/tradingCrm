import React, { useState } from 'react';
import compose from 'compose-function';
import Hotkeys from 'react-hot-keys';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { Modal, Notify, LevelType } from 'types';
import { withNotifications } from 'hoc';
import { getGraphQLUrl, getVersion } from 'config';
import { useModal } from 'providers/ModalProvider';
import withModals from 'hoc/withModals';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import permissions from 'config/permissions';
import { CONDITIONS } from 'utils/permissions';
import downloadBlob from 'utils/downloadBlob';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import PermissionContent from 'components/PermissionContent';
import NewOrderModal from 'routes/TE/modals/NewOrderModal';
import FixBalanceModal from 'routes/TE/modals/FixBalanceModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Account } from '../../AccountProfile';
import { useArchiveMutation } from './graphql/__generated__/ArchiveMutation';
import { useTokenRenewMutation } from './graphql/__generated__/TokenRenewMutation';
import './AccountProfileHeader.scss';

type Props = {
  modals: {
    newOrderModal: Modal,
    fixBalanceModal: Modal,
  },
  account: Account,
  notify: Notify,
  handleRefetch: Function,
}

const AccountProfileHeader = (props: Props) => {
  const {
    account: {
      uuid,
      name,
      login,
      enable,
    },
    modals: {
      newOrderModal,
      fixBalanceModal,
    },
  } = props;

  const [isReportDownloading, setIsReportDownloading] = useState(false);

  const [archive] = useArchiveMutation();
  const [tokenRenew] = useTokenRenewMutation();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleNewOrderClick = () => {
    newOrderModal.show({
      login: login.toString(),
      onSuccess: () => EventEmitter.emit(ORDER_RELOAD),
    });
  };

  const handleArchiveAccount = async (enabled: boolean) => {
    const {
      notify,
      handleRefetch,
    } = props;

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

      const requestUrl = `${getGraphQLUrl()}/report/${uuid}`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'x-client-version': getVersion(),
        },
      });

      const blobData = await response.blob();

      downloadBlob(`${login}.xls`, blobData);
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
        <PermissionContent permissions={permissions.WE_TRADING.UPDATE_ACCOUNT_ENABLE}>
          <Button
            data-testid="archiveButton"
            className="AccountProfileHeader__action"
            onClick={() => handleArchiveClick(!enable)}
            danger
            small
          >
            {I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.${enable ? 'ARCHIVE' : 'UNARCHIVE'}`)}
          </Button>
        </PermissionContent>

        <PermissionContent permissions={permissions.WE_TRADING.DOWNLOAD_REPORT}>
          <Button
            data-testid="downloadReportButton"
            className="AccountProfileHeader__action"
            onClick={handleDownloadReportClick}
            submitting={isReportDownloading}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.DOWNLOAD_REPORT')}
          </Button>
        </PermissionContent>

        <PermissionContent
          permissions={[
            permissions.WE_TRADING.CREDIT_IN,
            permissions.WE_TRADING.CREDIT_OUT,
            permissions.WE_TRADING.CORRECTION_IN,
            permissions.WE_TRADING.CORRECTION_OUT,
          ]}
          permissionsCondition={CONDITIONS.OR}
        >
          <Button
            data-testid="fixBalanceButton"
            className="AccountProfileHeader__action"
            onClick={handleFixBalanceClick}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.FIX_BALANCE')}
          </Button>
        </PermissionContent>

        {/* New order creation is possible only for active account */}
        <If condition={enable}>
          <PermissionContent permissions={permissions.WE_TRADING.CREATE_ORDER}>
            {/* Hotkey on F9 button to open new order modal */}
            <Hotkeys
              keyName="f9"
              onKeyUp={handleNewOrderClick}
            />

            <Button
              data-testid="newOrderButton"
              className="AccountProfileHeader__action"
              onClick={handleNewOrderClick}
              tertiary
              small
            >
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NEW_ORDER')}
            </Button>
          </PermissionContent>
        </If>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    newOrderModal: NewOrderModal,
    fixBalanceModal: FixBalanceModal,
  }),
)(AccountProfileHeader);
