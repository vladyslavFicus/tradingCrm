import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MultiCurrencyTooltip from '../MultiCurrencyTooltip';
import Amount from '../Amount';
import './MultiCurrencyView.scss';

class MultiCurrencyView extends Component {
  static propTypes = {
    id: PropTypes.string,
    rates: PropTypes.arrayOf(PropTypes.price).isRequired,
    values: PropTypes.arrayOf(PropTypes.price).isRequired,
  };

  static defaultProps = {
    id: null,
  };

  state = {
    isTooltipOpen: false,
  };

  handleTogglePopover = () => {
    this.setState({ isTooltipOpen: !this.state.isTooltipOpen });
  };

  render() {
    const { values, rates, id } = this.props;
    const { isTooltipOpen } = this.state;

    return (
      <div className="multi-currency-view">
        <Amount {...values[0]} />
        <i id={`${id}-right-icon`} className="icon icon-currencies multi-currency-view__icon" />
        <If condition={rates.length}>
          <MultiCurrencyTooltip
            id={`${id}-right-icon`}
            values={values}
            rates={rates}
            isOpen={isTooltipOpen}
            toggle={this.handleTogglePopover}
          />
        </If>
      </div>
    );
  }
}

export default MultiCurrencyView;
