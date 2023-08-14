import React from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { Config, parseErrors, notify, Types, useModal, usePermission } from '@crm/common';
import { Button } from 'components';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { FormValues } from '../../types';
import { useArchiveMutation } from './graphql/__generated__/ArchiveMutation';
import './GroupProfileHeaderEdit.scss';

type Props = {
  onArchived: () => void,
  formik: FormikProps<FormValues>,
};

const GroupProfileHeaderEdit = (props: Props) => {
  const { formik, onArchived } = props;

  const { dirty, isSubmitting, isValid, values } = formik;

  const { groupName, enabled } = values;

  const [archiveGroup] = useArchiveMutation();

  const permission = usePermission();
  const allowUpdateGroupCallback = permission.allows(Config.permissions.WE_TRADING.UPDATE_GROUP_ENABLE);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  // New confirmation instance is needed to show an error when archiving a group
  // since the submit handle works after it is shown again and closes it
  const confirmErrorModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleArchiveAccount = async (_enabled: boolean, force = false) => {
    try {
      await archiveGroup({ variables: { groupName, enabled: _enabled, force } });

      onArchived();

      notify({
        level: Types.LevelType.SUCCESS,
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

        confirmErrorModal.show({
          actionText,
          modalTitle: I18n.t(`TRADING_ENGINE.GROUP.NOTIFICATION.${_enabled ? 'UNARCHIVE' : 'ARCHIVE'}`, { groupName }),
          submitButtonLabel: I18n.t('COMMON.YES'),
          onSubmit: () => handleArchiveAccount(_enabled, true),
        });
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.ARCHIVE_GROUP_ERROR'),
        });
      }
    }
  };

  const handleArchiveClick = (_enabled: boolean) => {
    confirmActionModal.show({
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

        <If condition={!!groupName && allowUpdateGroupCallback}>
          <Button
            className="GroupProfileHeaderEdit__button"
            onClick={() => handleArchiveClick(!enabled)}
            danger={enabled}
            tertiary={!enabled}
            small
          >
            {I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.${enabled ? 'ARCHIVE' : 'UNARCHIVE'}`)}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(GroupProfileHeaderEdit);
