import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import {
  statuses,
  statusesLabels,
  statusesProps,
  cancellerReason,
} from '../../../../../../constants/bonus';
import Uuid from '../../../../../../components/Uuid';

class BonusStatus extends Component {
  static propTypes = {
    bonus: PropTypes.bonusEntity.isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
  };
  static defaultProps = {
    label: null,
    className: '',
  };

  renderStatus = () => {
    const { bonus } = this.props;
    if (!bonus.state) {
      return bonus.state;
    }

    const label = statusesLabels[bonus.state]
      ? I18n.t(statusesLabels[bonus.state])
      : bonus.state;
    const props = statusesProps[bonus.state] || {};
    let content = null;

    if (bonus.state === statuses.IN_PROGRESS) {
      content = this.renderStatusActive(bonus);
    } else if (bonus.state === statuses.CANCELLED) {
      content = this.renderStatusCancelled(bonus);
    }

    return (
      <div>
        <div {...props}>{label}</div>
        <div className="font-size-10">{content}</div>
      </div>
    );
  };

  renderStatusActive = bonus => bonus.expirationDate
    ? <span>Until {moment(bonus.expirationDate).format('DD.MM.YYYY')}</span>
    : null;

  renderStatusCancelled = (bonus) => {
    return (
      <div className="font-size-10">
        {
          bonus.cancellerUUID &&
          <div>
            by <Uuid uuid={bonus.cancellerUUID} uuidPrefix={cancellerReason.MANUAL_BY_PLAYER ? 'PL' : null} />
          </div>
        }
        {
          bonus.endDate &&
          <div>
            on {moment(bonus.endDate).format('DD.MM.YYYY')}
          </div>
        }
      </div>
    );
  };

  render() {
    const { className, label } = this.props;

    return (
      <div className={className}>
        {
          !!label &&
          <div className="color-default text-uppercase margin-bottom-10">
            {label}
          </div>
        }

        {this.renderStatus()}
      </div>
    );
  }
}

export default BonusStatus;
