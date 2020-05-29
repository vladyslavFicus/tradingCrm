import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import DateRangeGroup from 'components/Forms/DateRangeGroup';

const FormikDateRangeGroup = ({ periodKeys, ...props }) => {
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
    />
  );
};

FormikDateRangeGroup.propTypes = {
  periodKeys: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(FormikDateRangeGroup);
