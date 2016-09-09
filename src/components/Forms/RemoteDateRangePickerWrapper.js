import React from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

class RemoteDateRangePickerWrapper extends React.Component {
  constructor(props) {
    super(props);

    /**
     * Dirty hack =)
     */
    moment.updateLocale('en', {
      longDateFormat: {
        L: 'DD.MM.YYYY',
      },
    });

    this.state = {
      focusedInput: null,
    };

    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { startDate, endDate } = this.props;
    const { focusedInput } = this.state;

    return (
      <div>
        <DateRangePicker
          {...this.props}
          onDatesChange={this.props.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    );
  }
}

RemoteDateRangePickerWrapper.propTypes = {
  onDatesChange: React.PropTypes.func,
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
};

export default RemoteDateRangePickerWrapper;
