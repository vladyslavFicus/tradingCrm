import React, { useState } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { Partner } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import Uuid from 'components/Uuid';
import permissions from 'config/permissions';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import { statuses, statusesLabels, statusActions } from '../../../../constants';
import { usePartnerAccountStatusMutation } from './graphql/__generated__/PartnerAccountStatusMutation';
import './PartnerAccountStatus.scss';

// TODO After rewriting ChangeAccountStatusModal
// use useModal hook and use FormValues type from ChangeAccountStatusModal
type FormValues = {
  reason: string,
  comment?: string,
};

type Props = {
  partner: Partner,
  modals: {
    changeAccountStatusModal: Modal,
  },
  onRefetch: () => void,
};

const PartnerAccountStatus = (props: Props) => {
  const {
    partner: {
      uuid,
      status: partnerStatus,
      statusChangeDate,
      statusChangeAuthor,
    },
    modals: {
      changeAccountStatusModal,
    },
    onRefetch,
  } = props;

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const permission = usePermission();

  const allowUpdateAccountStatus = permission.allows(permissions.PARTNERS.UPDATE_STATUS);

  // ===== Requests ===== //
  const [partnerAccountStatusMutation] = usePartnerAccountStatusMutation();

  // ===== Handlers ===== //
  const toggleDropdown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleChangeAccountStatus = async ({ reason }: FormValues, status: string) => {
    try {
      await partnerAccountStatusMutation({
        variables: {
          uuid,
          status,
          reason,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.MESSAGE'),
      });

      onRefetch();
      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  };

  const handleSelectStatus = (reasons: Record<string, string>, action: string) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: FormValues) => handleChangeAccountStatus(values, action),
    });
  };

  // ===== Renders ===== //
  const renderLabel = () => (
    <div className="PartnerAccountStatus__label">
      <div
        className={classNames('PartnerAccountStatus__status', {
          'PartnerAccountStatus__status--inactive': partnerStatus === statuses.INACTIVE,
          'PartnerAccountStatus__status--active': partnerStatus === statuses.ACTIVE,
          'PartnerAccountStatus__status--closed': partnerStatus === statuses.CLOSED,
        })}
      >
        {I18n.t(statusesLabels[partnerStatus as statuses])}
      </div>

      <If condition={partnerStatus === statuses.ACTIVE && !!statusChangeDate}>
        <div className="PartnerAccountStatus__additional">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate || '').local().format('DD.MM.YYYY') })}
        </div>
      </If>

      <If condition={partnerStatus === statuses.CLOSED && !!statusChangeAuthor}>
        <div className="PartnerAccountStatus__additional">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor || ''} uuidPrefix="OP" />
        </div>
      </If>

      <If condition={partnerStatus === statuses.CLOSED && !!statusChangeDate}>
        <div className="PartnerAccountStatus__additional">
          {I18n.t('COMMON.ON')} {moment.utc(statusChangeDate || '').local().format('DD.MM.YYYY')}
        </div>
      </If>
    </div>
  );

  return (
    <div
      className={
        classNames('PartnerAccountStatus', {
          'PartnerAccountStatus--with-open-dropdown': isDropDownOpen,
        })
      }
    >
      <div className="PartnerAccountStatus__title">
        {I18n.t('COMMON.ACCOUNT_STATUS')}
      </div>

      <Choose>
        <When condition={allowUpdateAccountStatus}>
          <Dropdown
            isOpen={isDropDownOpen}
            toggle={toggleDropdown}
          >
            <DropdownToggle tag="div">
              {renderLabel()}
              <i className="PartnerAccountStatus__arrow fa fa-angle-down" />
            </DropdownToggle>

            <DropdownMenu className="PartnerAccountStatus__dropdown-menu">
              {
                statusActions
                  .filter(statusAction => statusAction.status !== partnerStatus)
                  .map(({ label, reasons, action }) => (
                    <DropdownItem
                      key={action}
                      className="PartnerAccountStatus__dropdown-item"
                      onClick={() => handleSelectStatus(reasons, action)}
                    >
                      {I18n.t(label)}
                    </DropdownItem>
                  ))
              }
            </DropdownMenu>
          </Dropdown>
        </When>

        <Otherwise>
          {renderLabel()}
        </Otherwise>
      </Choose>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    changeAccountStatusModal: ChangeAccountStatusModal,
  }),
)(PartnerAccountStatus);
