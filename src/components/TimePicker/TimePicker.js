import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { limits } from './constants';
import { formatCountValue, getCountsFromString, formatTimeString } from './utils';
import './TimePicker.scss';

class TimePicker extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: '', // /^(\d{1,2}):(\d{1,2})\b/
  };

  static getDerivedStateFromProps({ value }, state) {
    return {
      ...value !== state.value && {
        value,
        ...getCountsFromString(value),
      },
    };
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
  };

  endChangeValue = () => {
    clearTimeout(this.clickDelayTimerId);
    clearInterval(this.tickDelayTimerId);

    this.isMouseUp = true;

    document.body.removeEventListener('mouseup', this.endChangeValue);
  };

  increaseValue = unit => this.setState(({ [unit]: value }) => ({ [unit]: value === limits[unit] ? 0 : value + 1 }));

  decreaseValue = unit => this.setState(({ [unit]: value }) => ({ [unit]: value ? value - 1 : limits[unit] }));

  renderField = (unit, value) => (
    <div className="TimePicker__field">
      <button
        type="button"
        className="TimePicker__field-button"
        onMouseDown={this.startChangeValue(unit, this.increaseValue)}
        onClick={() => this.increaseValue(unit)}
      >
        <i className="fa fa-angle-up" />
      </button>
      <span className="TimePicker__field-count">
        {formatCountValue(value)}
      </span>
      <button
        type="button"
        className="TimePicker__field-button"
        onMouseDown={this.startChangeValue(unit, this.decreaseValue)}
        onClick={() => this.decreaseValue(unit)}
      >
        <i className="fa fa-angle-down" />
      </button>
    </div>
  );

  render() {
    const { hours, minutes } = this.state;

    return (
      <div className="TimePicker">
        {this.renderField('hours', hours)}
        <span className="TimePicker__separator">:</span>
        {this.renderField('minutes', minutes)}
      </div>
    );
  }
}

export default TimePicker;
