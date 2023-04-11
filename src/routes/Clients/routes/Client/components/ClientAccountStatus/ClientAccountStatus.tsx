import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { Profile } from '__generated__/types';
import { statuses, statusesLabels, statusActions, actions } from 'constants/user';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import ChangeAccountStatusModal, { ChangeAccountStatusModalProps, FormValues } from 'modals/ChangeAccountStatusModal';
import FailureReasonIcon from 'components/FailureReasonIcon';
import Uuid from 'components/Uuid';
import { useChangeClientStatusMutation } from './graphql/__generated__/ChangeClientStatusMutation';
import './ClientAccountStatus.scss';

type Props = {
  profile: Profile,
};

const ClientAccountStatus = (props: Props) => {
  const { profile: { uuid, status } } = props;

  const { changedAt, changedBy, comment, reason, type } = status || {};

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateAccountStatus = permission.allows(permissions.USER_PROFILE.STATUS);

  // ===== Modals ===== //
  const changeAccountStatusModal = useModal<ChangeAccountStatusModalProps>(ChangeAccountStatusModal);

  // ===== Requests ===== //
  const [changeClientStatusMutation] = useChangeClientStatusMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, action: actions) => {
    try {
      await changeClientStatusMutation({
        variables: {
          uuid,
          status: action,
          reason: values.reason,
          comment: values.comment || null,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.MESSAGE'),
      });

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.MESSAGE'),
      });
    }
  };

  const handleSelectStatus = (reasons: Record<string, string>, action: actions) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: FormValues) => handleSubmit(values, action),
      withComment: true,
    });
  };

  // ===== Renders ===== //
  const renderLabel = () => (
    <div className="ClientAccountStatus__label">
      <div
        className={classNames(
          'ClientAccountStatus__status', {
            'ClientAccountStatus__status--verified': type === statuses.VERIFIED,
            'ClientAccountStatus__status--not-verified': type === statuses.NOT_VERIFIED,
            'ClientAccountStatus__status--blocked': type === statuses.BLOCKED,
          },
        )}
      >
        {I18n.t(statusesLabels[type as statuses])}
      </div>

      <If condition={!!changedAt}>
        <div className="ClientAccountStatus__additional">
          {I18n.t('COMMON.SINCE', { date: moment.utc(changedAt).local().format('DD.MM.YYYY') })}
        </div>
      </If>

      <If condition={!!changedBy}>
        <div className="ClientAccountStatus__additional">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={`${changedBy}`} uuidPrefix="OP" />
        </div>
      </If>
    </div>
  );

  const toggleDropdown = () => setIsDropDownOpen(!isDropDownOpen);

  const statusesOptions = statusActions[type as statuses].filter(action => permission.allows(action.permission));

  return (
    <div
      className={
        classNames('ClientAccountStatus', {
          'ClientAccountStatus--with-open-dropdown': isDropDownOpen,
        })
      }
    >
      <div className="ClientAccountStatus__title">
        {I18n.t('COMMON.ACCOUNT_STATUS')}
      </div>

      <Choose>
        <When condition={allowUpdateAccountStatus && !!statusesOptions.length}>
          <Dropdown isOpen={isDropDownOpen} toggle={toggleDropdown}>
            <DropdownToggle tag="div">
              {renderLabel()}
              <i className="ClientAccountStatus__arrow fa fa-angle-down" />
            </DropdownToggle>

            <DropdownMenu className="ClientAccountStatus__dropdown-menu">
              {
                statusesOptions.map(({ label, reasons, action }) => (
                  <DropdownItem
                    key={action}
                    className="ClientAccountStatus__dropdown-item"
                    onClick={() => handleSelectStatus(reasons, action)}
                  >
                    {I18n.t(label)}
                  </DropdownItem>
                ))
              }
            </DropdownMenu>
          </Dropdown>

          <If condition={type === statuses.BLOCKED}>
            <FailureReasonIcon
              reason={reason || ''}
              statusDate={moment.utc(changedAt).local().format('YYYY-MM-DD HH:mm:ss')}
              statusAuthor={changedBy || ''}
              profileStatusComment={comment || ''}
            />
          </If>
        </When>

        <Otherwise>
          {renderLabel()}
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(ClientAccountStatus);
