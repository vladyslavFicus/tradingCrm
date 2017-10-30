import React from 'react';
import PropTypes from 'prop-types';
import Currency from './Currency';
import { currencySettings as currencies } from './constants';

const formatMoney = (amount) => {
  const n = amount.toString();
  const p = n.indexOf('.');
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, ($0, i) => p < 0 || i < p ? ($0 + ' ') : $0);
};


const Amount = ({ tag, className, amount, currency, amountClassName, currencyClassName, id, amountId }) => {
  const parsedAmount = parseFloat(amount).toFixed(2);
  if (isNaN(parsedAmount)) {
    return null;
  }

  let symbolOnLeft = true;
  if (currencies[currency]) {
    symbolOnLeft = currencies[currency].symbolOnLeft;
  }

  const chunks = [
    <Currency key="currency" code={currency} className={currencyClassName} />,
    <span key="amount" className={amountClassName} id={amountId}>
      {formatMoney(parsedAmount)}
    </span>,
  ];

  if (!symbolOnLeft) {
    chunks.reverse();
  }

  return React.createElement(tag, { className, id }, chunks);
};

Amount.defaultProps = {
  tag: 'span',
  className: '',
  amountClassName: '',
  currencyClassName: '',
  id: null,
  amountId: null,
};
Amount.propTypes = {
  tag: PropTypes.string,
  className: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  amountClassName: PropTypes.string,
  currency: PropTypes.string.isRequired,
  currencyClassName: PropTypes.string,
  id: PropTypes.string,
  amountId: PropTypes.string,
};

export default Amount;
