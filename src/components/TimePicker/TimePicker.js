import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { limits } from './constants';
import { formatCountValue, getCountsFromString, formatTimeString } from './utils';
import './TimePicker.scss';

class TimePicker extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    value: '', // accepts string according to pattern /^(\d{1,2}):(\d{1,2})\b/
  };

  static getDerivedStateFromProps({ value }, state) {
    if (value !== state.value) {
      return {
        value,
        ...getCountsFromString(value),
      };
    }

    return null;
  }

  state = {
    value: null,
    hours: 0,
    minutes: 0,
  };

  componentDidUpdate() {
    if (this.isMouseUp) {
      const { value, onChange } = this.props;

      const stateValue = formatTimeString(this.state);

      if (formatTimeString(getCountsFromString(value)) !== stateValue) {
        onChange(stateValue);
      }
    }
  }

  startChangeValue = (unit, method) => () => {
    this.clickDelayTimerId = setTimeout(() => {
      this.tickDelayTimerId = setInterval(method, 70, unit);
    }, 500);

    this.isMouseUp = false;

    document.body.addEventListener('mouseup', this.endChangeValue);
    document.body.addEventListener('touchend', this.endChangeValue);
  };

  endChangeValue = () => {
    clearTimeout(this.clickDelayTimerId);
    clearInterval(this.tickDelayTimerId);

    this.isMouseUp = true;

    document.body.removeEventListener('mouseup', this.endChangeValue);
    document.body.removeEventListener('touchend', this.endChangeValue);
  };

  increaseValue = unit => this.setState(({ [unit]: value }) => ({ [unit]: value === limits[unit] ? 0 : value + 1 }));

  decreaseValue = unit => this.setState(({ [unit]: value }) => ({ [unit]: value ? value - 1 : limits[unit] }));

  renderCount = (unit, value) => (
    <div className="TimePicker__count">
      <button
        type="button"
        className="TimePicker__count-button"
        onMouseDown={this.startChangeValue(unit, this.increaseValue)}
        onClick={() => this.increaseValue(unit)}
      >
        <i className="fa fa-angle-up" />
      </button>
      <span className="TimePicker__count-value">
        {formatCountValue(value)}
      </span>
      <button
        type="button"
        className="TimePicker__count-button"
        onMouseDown={this.startChangeValue(unit, this.decreaseValue)}
        onClick={() => this.decreaseValue(unit)}
      >
        <i className="fa fa-angle-down" />
      </button>
    </div>
  );

  render() {
    const { label } = this.props;
    const { hours, minutes } = this.state;

    return (
      <div className="TimePicker">
        <If condition={label}>
          <div className="TimePicker__label">{label}</div>
        </If>
        <div className="TimePicker__field">
          {this.renderCount('hours', hours)}
          <span className="TimePicker__separator">:</span>
          {this.renderCount('minutes', minutes)}
        </div>
      </div>
    );
  }
}

export default TimePicker;
