import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import {
  statuses,
  statusesLabels,
  statusesProps,
} from 'constants/bonus';
import moment from 'moment';
import { shortify } from 'utils/uuid';

class BonusStatus extends Component {
  static propTypes = {
    bonus: PropTypes.shape({
      amountToWage: PropTypes.price,
      balance: PropTypes.price,
      bonusLifetime: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
      bonusType: PropTypes.string,
      bonusUUID: PropTypes.string,
      campaignUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      cancellerOperatorUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      cancellerPlayerUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      capping: PropTypes.price,
      createdDate: PropTypes.string,
      currency: PropTypes.string,
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      expirationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      grantedAmount: PropTypes.price,
      id: PropTypes.number,
      label: PropTypes.string,
      operatorUUID: PropTypes.string,
      optIn: PropTypes.bool,
      playerUUID: PropTypes.string,
      priority: PropTypes.number,
      prize: PropTypes.price,
      startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      state: PropTypes.string.isRequired,
      wagered: PropTypes.price,
    }).isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
  };

  static defaultProps = {
    label: null,
    className: '',
  };

  render() {
    const { className, label } = this.props;

    return <div className={className}>
      {!!label && <div className="color-default text-uppercase margin-bottom-10">
        {label}
      </div>}

      {this.renderStatus()}
    </div>;
  }

  renderStatus = () => {
    const { bonus } = this.props;
    if (!bonus.state) {
      return bonus.state;
    }

    const label = statusesLabels[bonus.state] || bonus.state;
    const props = statusesProps[bonus.state] || {};
    let content = null;

    if (bonus.state === statuses.IN_PROGRESS) {
      content = this.renderStatusActive(bonus);
    } else if (bonus.state === statuses.CANCELLED) {
      content = this.renderStatusCancelled(bonus);
    }

    return <div>
      <div {...props}>{label}</div>
      <div className="font-size-10">{content}</div>
    </div>
  };

  renderStatusActive = (bonus) => {
    return bonus.expirationDate
      ? <span>Until {moment(bonus.expirationDate).format('DD.MM.YYYY')}</span>
      : null;
  };

  renderStatusCancelled = (bonus) => {
    const cancelledBy = bonus.cancellerPlayerUUID
      ? shortify(bonus.cancellerPlayerUUID, 'PL')
      : bonus.cancellerOperatorUUID
        ? shortify(bonus.cancellerOperatorUUID, 'OP')
        : 'Unknown';

    return <div className="font-size-10">
      <div>by {cancelledBy}</div>
      {
        bonus.endDate &&
        <div>
          on {moment(bonus.endDate).format('DD.MM.YYYY')}
        </div>
      }
    </div>;
  };
}

export default BonusStatus;
