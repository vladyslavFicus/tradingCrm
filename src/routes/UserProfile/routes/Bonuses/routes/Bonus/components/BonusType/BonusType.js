import React, { Component } from 'react';
import PropTypes from '../../../../../../../../constants/propTypes';
import {
  typesLabels,
  typesProps,
} from '../../../../../../../../constants/bonus';
import renderLabel from '../../../../../../../../utils/renderLabel';

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

  renderType = () => {
    const { bonus } = this.props;
    if (!bonus.bonusType) {
      return bonus.bonusType;
    }

    const props = typesProps[bonus.bonusType] || {};

    return (
      <div>
        <div {...props}>{renderLabel(bonus.bonusType, typesLabels)}</div>
        <div className="font-size-10">
          {bonus.optIn ? 'Opt-in' : 'Non Opt-in'}
        </div>
      </div>
    );
  };

  render() {
    const { className, label } = this.props;

    return (
      <div className={className}>
        {!!label && <div className="color-default text-uppercase margin-bottom-10">
          {label}
        </div>}

        {this.renderType()}
      </div>
    );
  }
}

export default BonusStatus;
