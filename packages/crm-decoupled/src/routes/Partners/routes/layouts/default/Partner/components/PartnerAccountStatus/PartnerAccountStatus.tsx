import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Partner } from '__generated__/types';
import Uuid from 'components/Uuid';
import { statuses, statusesLabels, statusActions } from 'routes/Partners/constants';
import usePartnerAccountStatus from 'routes/Partners/routes/hooks/usePartnerAccountStatus';
import './PartnerAccountStatus.scss';

type Props = {
  partner: Partner,
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
    onRefetch,
  } = props;

  const {
    allowUpdateAccountStatus,
    isDropDownOpen,
    toggleDropdown,
    handleSelectStatus,
  } = usePartnerAccountStatus({ uuid, onRefetch });

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

export default React.memo(PartnerAccountStatus);
