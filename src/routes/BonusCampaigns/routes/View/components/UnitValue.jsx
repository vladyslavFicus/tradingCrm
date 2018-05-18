import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Amount from '../../../../../components/Amount';
import { customValueFieldTypes } from '../../../../../constants/form';

class UnitValue extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.number,
    currency: PropTypes.string.isRequired,
  };

  static defaultProps = {
    value: 0,
  };

  render() {
    const { value, type, currency } = this.props;

    if (!type) {
      return null;
    }

    if (type === customValueFieldTypes.PERCENTAGE) {
      return <span>{`${value}%`}</span>;
    }

    return <Amount amount={value} currency={currency} />;
  }
}

export default UnitValue;
