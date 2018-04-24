import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Tooltip } from 'reactstrap';
import attributeLabels from './constants';
import './MultiCurrencyPopover.scss';

const MultiCurrencyPopover = ({ placement, isOpen, id, toggle }) => (
  <Tooltip
    placement={placement}
    isOpen={isOpen}
    target={id}
    toggle={toggle}
    className="multi-currency-tooltip"
  >
    <h3 className="tooltip-title">{I18n.t(attributeLabels.title)}</h3>
    <table className="tooltip-content table table-responsive">
      <thead>
        <tr>
          <th>{I18n.t(attributeLabels.currency)}</th>
          <th>{I18n.t(attributeLabels.rate)}</th>
          <th>{I18n.t(attributeLabels.value)}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>rur</td>
          <td>69,500</td>
          <td>6950,00</td>
        </tr>
      </tbody>
    </table>
  </Tooltip>
);

MultiCurrencyPopover.propTypes = {
  isOpen: PropTypes.bool,
  placement: PropTypes.string,
  id: PropTypes.string.isRequired,
  toggle: PropTypes.func,
};
MultiCurrencyPopover.defaultProps = {
  isOpen: false,
  toggle: null,
  placement: 'bottom-end',
};

export default MultiCurrencyPopover;
