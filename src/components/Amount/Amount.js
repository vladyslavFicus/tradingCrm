import React, { Component, PropTypes } from 'react';

class Amount extends Component {
  render() {
    const {
      amount,
      currency,
      className,
      amountClassName,
      currencyClassName,
    } = this.props;

    if (!amount) return null;

    return <tag className={className}>
      <span className={currencyClassName}>{currency}</span>
      <span className={amountClassName}>{parseFloat(amount).toFixed(2)}</span>
    </tag>;
  }
}

Amount.defaultProps = {
  currency: '€',
};

Amount.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired,
  className: PropTypes.string,
  amountClassName: PropTypes.string,
  currencyClassName: PropTypes.string,
};

export default Amount;
