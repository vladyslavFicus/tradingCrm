import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import {
  typesLabels,
  typesProps,
} from 'constants/bonus';

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
      state: PropTypes.string,
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

      {this.renderType()}
    </div>;
  }

  renderType = () => {
    const { bonus } = this.props;
    if (!bonus.bonusType) {
      return bonus.bonusType;
    }

    const label = typesLabels[bonus.bonusType] || bonus.bonusType;
    const props = typesProps[bonus.bonusType] || {};

    return <div>
      <div {...props}>{label}</div>
      <div className="font-size-10">
        {bonus.optIn ? 'Opt-in' : 'Non Opt-in'}
      </div>
    </div>
  };
}

export default BonusStatus;
