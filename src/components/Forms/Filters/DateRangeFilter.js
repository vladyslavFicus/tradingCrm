import React, { PropTypes } from 'react';
import DateRangePicker from 'components/Forms/DateRangePickerWrapper';

const DateRangeFilter = ({ onFilterChange, ...rest }) => (
  <DateRangePicker
    withPortal
    allowPastDates
    onDatesChange={({ startDate, endDate }) => {
      if (startDate && endDate) {
        onFilterChange({
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        });
      }
    }}
    {...rest}
  />
);

DateRangeFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default DateRangeFilter;
