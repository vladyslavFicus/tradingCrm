import React, { PropTypes } from 'react';
import DateRangePicker from 'components/Forms/DateRangePickerWrapper';

const DateRangeFilter = ({ onFilterChange, startDateFormat, endDateFormat, ...rest }) => (
  <DateRangePicker
    withPortal
    allowPastDates
    onDatesChange={({ startDate, endDate }) => {
      if (startDate && endDate) {
        onFilterChange({
          startDate: startDate.format(startDateFormat),
          endDate: endDate.format(endDateFormat),
        });
      }
    }}
    {...rest}
  />
);

DateRangeFilter.defaultProps = {
  startDateFormat: 'YYYY-MM-DD',
  endDateFormat: 'YYYY-MM-DD',
};
DateRangeFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  startDateFormat: PropTypes.string,
  endDateFormat: PropTypes.string,
};

export default DateRangeFilter;
