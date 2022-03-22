import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import { ReactComponent as AccountIcon } from './img/account.svg';
import { ReactComponent as CallbackIcon } from './img/callback.svg';
import { ReactComponent as ClientIcon } from './img/client.svg';
import { ReactComponent as DepositIcon } from './img/deposit.svg';
import { ReactComponent as KycIcon } from './img/kyc.svg';
import { ReactComponent as TradingIcon } from './img/trading.svg';
import { ReactComponent as WithdrawalIcon } from './img/withdrawal.svg';
import './NotificationItem.scss';

class NotificationItem extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    subtype: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    details: PropTypes.object,
  };

  static defaultProps = {
    details: {},
  };

  renderIcon() {
    let icon = null;

    switch (this.props.type) {
      case 'ACCOUNT':
        icon = <AccountIcon />;
        break;
      case 'CALLBACK':
        icon = <CallbackIcon />;
        break;
      case 'CLIENT':
        icon = <ClientIcon />;
        break;
      case 'DEPOSIT':
        icon = <DepositIcon />;
        break;
      case 'KYC':
        icon = <KycIcon />;
        break;
      case 'TRADING':
        icon = <TradingIcon />;
        break;
      case 'WITHDRAWAL':
        icon = <WithdrawalIcon />;
        break;
      case 'AUTH':
        icon = <ClientIcon />;
        break;
      default:
        break;
    }

    return icon;
  }

  render() {
    const {
      type,
      subtype,
      priority,
      details,
    } = this.props;

    return (
      <div className={classNames('NotificationItem', {
        'NotificationItem--low': priority === 'LOW',
        'NotificationItem--medium': priority === 'MEDIUM',
        'NotificationItem--high': priority === 'HIGH',
      })}
      >
        <div className="NotificationItem__icon-container">
          {this.renderIcon()}
        </div>
        <div>
          <div className="NotificationItem__title-container">
            <div className={classNames('NotificationItem__priority', {
              'NotificationItem__priority--low': priority === 'LOW',
              'NotificationItem__priority--medium': priority === 'MEDIUM',
              'NotificationItem__priority--high': priority === 'HIGH',
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
          <If condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}>
            <div className="NotificationItem__subtitle">{details.amount} {details.currency}</div>
          </If>

          <If condition={type === 'ACCOUNT'}>
            <PlatformTypeBadge center position="left" platformType={details.platformType}>
              <div className="NotificationItem__subtitle">{details.login}</div>
            </PlatformTypeBadge>
          </If>

          <If condition={type === 'CALLBACK'}>
            <div className="NotificationItem__subtitle">
              {I18n.t('NOTIFICATION_CENTER.DETAILS.CALLBACK_TIME', {
                time: moment.utc(details.callbackTime).local().format('HH:mm'),
              })}
            </div>
          </If>

          <If condition={subtype === 'BULK_CLIENTS_ASSIGNED'}>
            <div className="NotificationItem__subtitle">
              {I18n.t('NOTIFICATION_CENTER.DETAILS.CLIENTS_COUNT', { clientsCount: details.clientsCount })}
            </div>
          </If>

          <If condition={subtype === 'PASSWORD_EXPIRATION_NOTIFICATION'}>
            <div className="NotificationItem__subtitle">
              {I18n.t('NOTIFICATION_CENTER.DETAILS.PASSWORD_EXPIRATION', {
                date: moment.utc(details.expirationTime).local().format('DD.MM.YYYY'),
              })}
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default NotificationItem;
