import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
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
        </div>
      </div>
    );
  }
}

export default NotificationItem;
