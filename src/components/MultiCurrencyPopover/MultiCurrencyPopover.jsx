import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import attributeLabels from './constants';
import './MultiCurrencyPopover.scss';

const MultiCurrencyPopover = ({ placement, isOpen, id, toggle }) => (
  <Popover
    placement={placement}
    isOpen={isOpen}
    target={id}
    toggle={toggle}
    className="multi-currency-popover"
  >
    <PopoverTitle>
      {I18n.t(attributeLabels.title)}
    </PopoverTitle>
    <PopoverContent>
      <table className="table table-responsive">
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
    </PopoverContent>
  </Popover>
);

MultiCurrencyPopover.propTypes = {
  isOpen: PropTypes.bool,
  placement: PropTypes.string,
  id: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
};
MultiCurrencyPopover.defaultProps = {
  isOpen: false,
  placement: 'bottom',
};

export default MultiCurrencyPopover;
