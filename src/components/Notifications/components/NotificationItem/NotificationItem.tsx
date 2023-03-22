import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import { TypeIcons, TypePriorities, Subtypes, DetailsType } from './types';
import { ReactComponent as AccountIcon } from './img/account.svg';
import { ReactComponent as CallbackIcon } from './img/callback.svg';
import { ReactComponent as ClientIcon } from './img/client.svg';
import { ReactComponent as DepositIcon } from './img/deposit.svg';
import { ReactComponent as KycIcon } from './img/kyc.svg';
import { ReactComponent as TradingIcon } from './img/trading.svg';
import { ReactComponent as WithdrawalIcon } from './img/withdrawal.svg';
import './NotificationItem.scss';

type Props = {
  type: string,
  subtype: string,
  priority: string,
  details?: DetailsType,
};

const NotificationItem = (props: Props) => {
  const {
    type,
    subtype,
    priority,
    details,
  } = props;

  const renderIcon = () => {
    let icon = null;

    switch (type) {
      case TypeIcons.ACCOUNT:
        icon = <AccountIcon />;
        break;
      case TypeIcons.CALLBACK:
        icon = <CallbackIcon />;
        break;
      case TypeIcons.CLIENT:
        icon = <ClientIcon />;
        break;
      case TypeIcons.DEPOSIT:
        icon = <DepositIcon />;
        break;
      case TypeIcons.KYC:
        icon = <KycIcon />;
        break;
      case TypeIcons.TRADING:
        icon = <TradingIcon />;
        break;
      case TypeIcons.WITHDRAWAL:
        icon = <WithdrawalIcon />;
        break;
      case TypeIcons.AUTH:
        icon = <ClientIcon />;
        break;
      default:
        break;
    }

    return icon;
  };

  return (
    <div className={classNames('NotificationItem', {
      'NotificationItem--low': priority === TypePriorities.LOW,
      'NotificationItem--medium': priority === TypePriorities.MEDIUM,
      'NotificationItem--high': priority === TypePriorities.HIGH,
    })}
    >
      <div className="NotificationItem__icon-container">
        {renderIcon()}
      </div>

      <div>
        <div className="NotificationItem__title-container">
          <div className={classNames('NotificationItem__priority', {
            'NotificationItem__priority--low': priority === TypePriorities.LOW,
            'NotificationItem__priority--medium': priority === TypePriorities.MEDIUM,
            'NotificationItem__priority--high': priority === TypePriorities.HIGH,
          })}
          >
            {priority}
          </div>

          <div className="NotificationItem__title">
            {I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`).toUpperCase()}
          </div>
        </div>

        <div className="NotificationItem__body">
          {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
        </div>

        {/* Render custom details for individual type or subtype */}
        <If condition={type === TypeIcons.WITHDRAWAL || type === TypeIcons.DEPOSIT}>
          <div className="NotificationItem__subtitle">{details?.amount || ''} {details?.currency || ''}</div>
        </If>

        <If condition={type === TypeIcons.ACCOUNT}>
          <PlatformTypeBadge center position="left" platformType={details?.platformType || ''}>
            <div className="NotificationItem__subtitle">{details?.login || ''}</div>
          </PlatformTypeBadge>
        </If>

        <If condition={type === TypeIcons.CALLBACK}>
          <div className="NotificationItem__subtitle">
            {I18n.t('NOTIFICATION_CENTER.DETAILS.CALLBACK_TIME', {
              time: moment.utc(details?.callbackTime || '').local().format('HH:mm'),
            })}
          </div>
        </If>

        <If condition={subtype === Subtypes.BULK_CLIENTS_ASSIGNED}>
          <div className="NotificationItem__subtitle">
            {I18n.t('NOTIFICATION_CENTER.DETAILS.CLIENTS_COUNT', { clientsCount: details?.clientsCount || '' })}
          </div>
        </If>

        <If condition={subtype === Subtypes.PASSWORD_EXPIRATION_NOTIFICATION}>
          <div className="NotificationItem__subtitle">
            {I18n.t('NOTIFICATION_CENTER.DETAILS.PASSWORD_EXPIRATION', {
              date: moment.utc(details?.expirationTime || '').local().format('DD.MM.YYYY'),
            })}
          </div>
        </If>
      </div>
    </div>
  );
};

export default React.memo(NotificationItem);
