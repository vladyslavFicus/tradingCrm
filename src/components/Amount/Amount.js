import React, { Component, PropTypes } from 'react';

const currencyMap = {
  EUR: '€',
  USD: '$',
};

class Amount extends Component {
  render() {
    const {
      amount,
      currency,
      className,
      amountClassName,
      currencyClassName,
    } = this.props;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return null;

    return <span className={className}>
      <span className={currencyClassName}>{currencyMap[currency] || currency}</span>
      <span className={amountClassName}>{parsedAmount.toFixed(2)}</span>
    </span>;
  }
}

Amount.defaultProps = {
  currency: 'EUR',
};

Amount.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string,
  className: PropTypes.string,
  amountClassName: PropTypes.string,
  currencyClassName: PropTypes.string,
};

export default Amount;
