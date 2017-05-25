import React, { Component, PropTypes } from 'react';
import Amount from '../../../../../components/Amount';
import { amountTypes } from '../../../constants';

class UnitValue extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
  }

  render() {
    const { value, type, currency } = this.props;

    if (!type) {
      return null;
    }

    if (type === amountTypes.PERCENTAGE) {
      return `${value} %`;
    }

    return <Amount amount={value} currency={currency} />;
  }
}

export default UnitValue;
