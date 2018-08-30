import React, { Component, Fragment } from 'react';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import { typesLabels } from '../../../../../../../../../../constants/bonus';
import renderLabel from '../../../../../../../../../../utils/renderLabel';

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

    return (
      <Fragment>
        <div className="color-primary font-weight-700 text-uppercase">
          {renderLabel(bonus.bonusType, typesLabels)}
        </div>
        <div className="font-size-11">
          {bonus.optIn ? 'Opt-in' : 'Non Opt-in'}
        </div>
      </Fragment>
    );
  };

  render() {
    const { className, label } = this.props;

    return (
      <div className={className}>
        {!!label && <div className="modal-tab-label">{label}</div>}
        {this.renderType()}
      </div>
    );
  }
}

export default BonusStatus;
