import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { Constants } from '@crm/common';
import { Profile } from '__generated__/types';
import FailureReasonIcon from 'components/FailureReasonIcon';
import Uuid from 'components/Uuid';
import useClientAccountStatus
  from 'routes/Clients/routes/Client/components/hooks/useClientAccountStatus';
import './ClientAccountStatus.scss';

type Props = {
  profile: Profile,
};

const ClientAccountStatus = (props: Props) => {
  const { profile: { status } } = props;

  const { changedAt, changedBy, comment, reason, type } = status || {};

  const {
    isDropDownOpen,
    allowUpdateAccountStatus,
    statusesOptions,
    handleSelectStatus,
    toggleDropdown,
  } = useClientAccountStatus(props);

  // ===== Renders ===== //
  const renderLabel = () => (
    <div className="ClientAccountStatus__label">
      <div
        className={classNames(
          'ClientAccountStatus__status', {
            'ClientAccountStatus__status--verified': type === Constants.User.statuses.VERIFIED,
            'ClientAccountStatus__status--not-verified': type === Constants.User.statuses.NOT_VERIFIED,
            'ClientAccountStatus__status--blocked': type === Constants.User.statuses.BLOCKED,
          },
        )}
      >
        {I18n.t(Constants.User.statusesLabels[type as Constants.User.statuses])}
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

          <If condition={type === Constants.User.statuses.BLOCKED}>
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
