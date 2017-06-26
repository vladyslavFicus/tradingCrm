import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config/index';
import Currency from './Currency';

const formatMoney = (amount) => {
  const n = amount.toString();
  const p = n.indexOf('.');
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, ($0, i) => p < 0 || i < p ? ($0 + ' ') : $0);
};

class Amount extends Component {
  render() {
    const {
      tag,
      className,
      amount,
      currency,
      amountClassName,
      currencyClassName,
    } = this.props;

    const parsedAmount = parseFloat(amount).toFixed(2);
    if (isNaN(parsedAmount)) {
      return null;
    }

    let symbolOnLeft = currency;
    if (config.components.Currency.currencies[currency]) {
      symbolOnLeft = config.components.Currency.currencies[currency];
    }

    const chunks = [
      <Currency key="currency" code={currency} className={currencyClassName} />,
      <span key="amount" className={amountClassName}>
        {formatMoney(parsedAmount)}
      </span>,
    ];

    if (!symbolOnLeft) {
      chunks.reverse();
    }

    return React.createElement(tag, { className }, chunks);
  }
}

Amount.defaultProps = {
  tag: 'span',
};
Amount.propTypes = {
  tag: PropTypes.string,
  className: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  amountClassName: PropTypes.string,
  currency: PropTypes.string.isRequired,
  currencyClassName: PropTypes.string,
};

export default Amount;
