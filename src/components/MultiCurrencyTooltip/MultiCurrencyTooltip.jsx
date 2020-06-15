import React from 'react';
import I18n from 'i18n-js';
import { Tooltip } from 'reactstrap';
import { get } from 'lodash';
import PropTypes from '../../constants/propTypes';
import attributeLabels from './constants';
import './MultiCurrencyTooltip.scss';

const MultiCurrencyTooltip = ({ placement, values, rates, isOpen, id, toggle }) => (
  <Tooltip
    placement={placement}
    isOpen={isOpen}
    target={id}
    toggle={toggle}
    className="multi-currency-tooltip"
    hideArrow
  >
    <div className="multi-currency-tooltip__header">
      {I18n.t(attributeLabels.title)}
    </div>
    <table className="multi-currency-tooltip__content table table-responsive">
      <thead>
        <tr>
          <th>{I18n.t(attributeLabels.currency)}</th>
          <th>{I18n.t(attributeLabels.rate)}</th>
          <th>{I18n.t(attributeLabels.value)}</th>
        </tr>
      </thead>
      <tbody>
        <For each="rate" of={rates}>
          <tr key={rate.currency}>
            <td>{rate.currency}</td>
            <td>{rate.amount}</td>
            <td>{get(values.find(({ currency }) => currency === rate.currency), 'amount', 0)}</td>
          </tr>
        </For>
      </tbody>
    </table>
  </Tooltip>
);

MultiCurrencyTooltip.propTypes = {
  rates: PropTypes.arrayOf(PropTypes.price).isRequired,
  values: PropTypes.arrayOf(PropTypes.price).isRequired,
  isOpen: PropTypes.bool,
  placement: PropTypes.string,
  id: PropTypes.string.isRequired,
  toggle: PropTypes.func,
};
MultiCurrencyTooltip.defaultProps = {
  isOpen: false,
  toggle: null,
  placement: 'bottom',
};

export default MultiCurrencyTooltip;
