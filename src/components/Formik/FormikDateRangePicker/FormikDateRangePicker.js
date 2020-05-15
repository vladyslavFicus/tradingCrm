import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import DateRangePicker from 'components/DateRangePicker';

const FormikDateRangePicker = ({ periodKeys, ...props }) => {
  const { values: formValues, setFieldValue } = useFormikContext();

  const { start: startKey, end: endKey } = periodKeys;

  return (
    <DateRangePicker
      {...props}
      setValues={(values) => {
        setFieldValue([startKey], values[0]);
        setFieldValue([endKey], values[1]);
      }}
      values={[formValues[startKey], formValues[endKey]]}
    />
  );
};

FormikDateRangePicker.propTypes = {
  periodKeys: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(FormikDateRangePicker);
