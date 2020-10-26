import React, { memo } from 'react';
import { useField } from 'formik';
import PropTypes from 'constants/propTypes';
import DateRangeGroup from 'components/Forms/DateRangeGroup';

const FormikDateRangeGroup = ({ periodKeys, withFocus, ...props }) => {
  const startField = useField(periodKeys.start).reduce(
    (acc, cur) => ({ ...acc, ...cur }), {},
  );

  const endField = useField(periodKeys.end).reduce(
    (acc, cur) => ({ ...acc, ...cur }), {},
  );

  return (
    <DateRangeGroup
      {...props}
      startField={startField}
      endField={endField}
      isFocusedStartField={withFocus && Boolean(startField.value)}
      isFocusedEndField={withFocus && Boolean(endField.value)}
    />
  );
};

FormikDateRangeGroup.propTypes = {
  periodKeys: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
  withFocus: PropTypes.bool,
};

FormikDateRangeGroup.defaultProps = {
  withFocus: false,
};

export default memo(FormikDateRangeGroup);
