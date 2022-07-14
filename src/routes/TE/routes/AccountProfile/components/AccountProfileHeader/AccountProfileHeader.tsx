import React from 'react';
import compose from 'compose-function';
import Hotkeys from 'react-hot-keys';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { Modal, Notify, LevelType } from 'types';
import withModals from 'hoc/withModals';
import { withNotifications } from 'hoc';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import permissions from 'config/permissions';
import { CONDITIONS } from 'utils/permissions';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import PermissionContent from 'components/PermissionContent';
import NewOrderModal from 'routes/TE/modals/NewOrderModal';
import FixBalanceModal from 'routes/TE/modals/FixBalanceModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Account } from '../../AccountProfile';
import { useArchiveMutation } from './graphql/__generated__/ArchiveMutation';
import './AccountProfileHeader.scss';

type Props = {
  modals: {
    newOrderModal: Modal,
    confirmationModal: Modal,
    fixBalanceModal: Modal,
  }
  account: Account,
  notify: Notify,
  handleRefetch: Function,
}

const AccountProfileHeader = (props: Props) => {
  const {
    account: {
      name,
      login,
      enable,
    },
    modals: {
      confirmationModal,
      newOrderModal,
      fixBalanceModal,
    },
  } = props;

  const [archive] = useArchiveMutation();

  const handleNewOrderClick = () => {
    newOrderModal.show({
      login: login.toString(),
      onSuccess: () => EventEmitter.emit(ORDER_RELOAD),
    });
  };

  const handleArchiveAccount = async (enabled: boolean) => {
    const {
      account: {
        uuid,
      },
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

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: error.error === 'error.account.disable.prohibited'
          ? I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.ACCOUNT_DISABLE_PROHIBITED')
          : I18n.t('COMMON.FAILED'),
      });
    }
  };

  const handleArchiveClick = (enabled: boolean) => {
    confirmationModal.show({
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
          <Uuid uuid={login.toString()} uuidPrefix="WT" />
        </div>
      </div>

      <div className="AccountProfileHeader__actions">
        <PermissionContent permissions={permissions.WE_TRADING.UPDATE_ACCOUNT_ENABLE}>
          <Button
            className="AccountProfileHeader__action"
            onClick={() => handleArchiveClick(!enable)}
            commonOutline
            danger
            small
          >
            {I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.${enable ? 'ARCHIVE' : 'UNARCHIVE'}`)}
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
            className="AccountProfileHeader__action"
            onClick={handleFixBalanceClick}
            commonOutline
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
              className="AccountProfileHeader__action"
              onClick={handleNewOrderClick}
              commonOutline
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
    confirmationModal: ConfirmActionModal,
    fixBalanceModal: FixBalanceModal,
  }),
)(AccountProfileHeader);
