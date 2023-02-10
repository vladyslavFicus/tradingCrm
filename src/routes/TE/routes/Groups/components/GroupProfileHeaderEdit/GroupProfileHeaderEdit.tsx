import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { parseErrors } from 'apollo';
import { LevelType, Modal, Notify } from 'types';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Button } from 'components/Buttons';
import { withModals, withNotifications } from 'hoc';
import { FormValues } from '../../types';
import { useArchiveMutation } from './graphql/__generated__/ArchiveMutation';
import './GroupProfileHeaderEdit.scss';

type Props = {
  notify: Notify,
  onArchived: () => void,
  formik: FormikProps<FormValues>,
  modals: {
    confirmationModal: Modal,
    confirmationOpenOrderModal: Modal,
  },
}

const GroupProfileHeaderEdit = (props: Props) => {
  const {
    formik,
    modals: {
      confirmationModal,
      confirmationOpenOrderModal,
    },
    notify,
    onArchived,
  } = props;

  const { dirty, isSubmitting, isValid, values } = formik;

  const { groupName, enabled } = values;

  const [archiveGroup] = useArchiveMutation();

  const handleArchiveAccount = async (_enabled: boolean, force = false) => {
    try {
      await archiveGroup({ variables: { groupName, enabled: _enabled, force } });

      onArchived();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t(`TRADING_ENGINE.GROUP.NOTIFICATION.${_enabled ? 'UNARCHIVED' : 'ARCHIVED'}`),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.group.has.active.accounts') {
        const {
          ordersCount,
          accountsCount,
        } = error.errorParameters;

        const actionText = Number(ordersCount) > 0
          ? I18n.t('TRADING_ENGINE.GROUP.GROUPS_HAS_ACTIVE_ACCOUNTS_AND_OPEN_ORDERS', { accountsCount, ordersCount })
          : I18n.t('TRADING_ENGINE.GROUP.GROUPS_HAS_ACTIVE_ACCOUNTS', { accountsCount });

        confirmationOpenOrderModal.show({
          actionText,
          modalTitle: I18n.t(`TRADING_ENGINE.GROUP.NOTIFICATION.${_enabled ? 'UNARCHIVE' : 'ARCHIVE'}`, { groupName }),
          submitButtonLabel: I18n.t('COMMON.YES'),
          onSubmit: () => handleArchiveAccount(_enabled, true),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.ARCHIVE_GROUP_ERROR'),
        });
      }
    }
  };

  const handleArchiveClick = (_enabled: boolean) => {
    confirmationModal.show({
      onSubmit: () => handleArchiveAccount(_enabled),
      modalTitle: I18n.t(`TRADING_ENGINE.GROUP.NOTIFICATION.${_enabled ? 'UNARCHIVE' : 'ARCHIVE'}`, { groupName }),
      actionText: I18n.t(
        `TRADING_ENGINE.GROUP.NOTIFICATION.${_enabled ? 'UNARCHIVE_TEXT' : 'ARCHIVE_TEXT'}`,
      ),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="GroupProfileHeaderEdit">
      <ReactPlaceholder
        ready={groupName !== undefined}
        customPlaceholder={(
          <div>
            <TextRow
              className="animated-background"
              style={{ width: '220px', height: '20px' }}
            />
          </div>
        )}
      >
        <div className="GroupProfileHeaderEdit__title">
          {groupName}
        </div>
      </ReactPlaceholder>

      <div className="GroupProfileHeaderEdit__actions">
        <Button
          small
          primary
          disabled={!dirty || isSubmitting || !isValid}
          type="submit"
          className="GroupProfileHeaderEdit__button"
        >
          {I18n.t('COMMON.SAVE')}
        </Button>

        <If condition={!!groupName}>
          <PermissionContent permissions={permissions.WE_TRADING.UPDATE_GROUP_ENABLE}>
            <Button
              className="GroupProfileHeaderEdit__button"
              onClick={() => handleArchiveClick(!enabled)}
              danger={enabled}
              tertiary={!enabled}
              small
            >
              {I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.${enabled ? 'ARCHIVE' : 'UNARCHIVE'}`)}
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
    confirmationModal: ConfirmActionModal,
    confirmationOpenOrderModal: ConfirmActionModal,
  }),
)(GroupProfileHeaderEdit);
