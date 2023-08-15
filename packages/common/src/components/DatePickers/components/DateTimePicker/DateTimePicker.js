import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import './DateTimePicker.scss';

class DateTimePicker extends PureComponent {
  static propTypes = {
    selectedDate: momentPropTypes.momentObj,
    handleTimeChange: PropTypes.func.isRequired,
    labelPrefix: PropTypes.string,
    minTime: PropTypes.string,
    maxTime: PropTypes.string,
  };

  static defaultProps = {
    selectedDate: null,
    labelPrefix: null,
    minTime: null,
    maxTime: null,
  };

  handleTimeChange = (event) => {
    const { value } = event.target;

    const { handleTimeChange, selectedDate } = this.props;

    const [hour, minute] = value.split(':');

    return handleTimeChange(selectedDate.set({ hour, minute }));
  };

  render() {
    const {
      selectedDate,
      labelPrefix,
      minTime,
      maxTime,
    } = this.props;

    // # Get info about selected date in format like: '30 Nov 2020'
    const date = selectedDate ? moment(selectedDate).format('DD MMM YYYY') : '---';
    const time = selectedDate ? moment(selectedDate).format('HH:mm') : '';

    return (
      <div className="DateTimePicker">
        <div className="DateTimePicker__label">
          <If condition={labelPrefix}>
            <span className="DateTimePicker__label-prefix">{labelPrefix}</span>
          </If>

          <span className="DateTimePicker__label-date">{date}</span>
        </div>

        <div className="DateTimePicker__input">
          <input
            type="time"
            onChange={this.handleTimeChange}
            value={time}
            disabled={!time}
            min={minTime}
            max={maxTime}
          />
        </div>
      </div>
    );
  }
}

export default DateTimePicker;
