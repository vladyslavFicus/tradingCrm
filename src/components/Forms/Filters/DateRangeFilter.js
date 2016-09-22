import React, { PropTypes } from 'react';
import DateRangePicker from 'components/Forms/DateRangePickerWrapper';

const DateRangeFilter = ({ onFilterChange }) => (
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
  />
);

DateRangeFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default DateRangeFilter;
