import React, { memo } from 'react';
import { useField } from 'formik';
import DatePicker from 'components/DatePicker';

const FormikDatePicker = (props) => {
  const [field, meta, helpers] = useField(props);

  return <DatePicker field={{ ...field, ...meta, ...helpers }} {...props} />;
};

export default memo(FormikDatePicker);
