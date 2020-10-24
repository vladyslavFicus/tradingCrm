import React, { memo } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { useField } from 'formik';
import PropTypes from 'constants/propTypes';
import DateRangeGroup from 'components/Forms/DateRangeGroup';

const FormikDateRangeGroup = ({ periodKeys, withFocus, location, ...props }) => {
  const startField = useField(periodKeys.start).reduce(
    (acc, cur) => ({ ...acc, ...cur }), {},
  );

  const endField = useField(periodKeys.end).reduce(
    (acc, cur) => ({ ...acc, ...cur }), {},
  );

  const isFocusedField = name => (
    withFocus
      ? Boolean(get(location, `state.filters.${name}`) || get(location, `query.filters.${name}`))
      : false
  );

  return (
    <DateRangeGroup
      {...props}
      startField={startField}
      endField={endField}
      isFocusedStartField={isFocusedField(startField.name)}
      isFocusedEndField={isFocusedField(endField.name)}
    />
  );
};

FormikDateRangeGroup.propTypes = {
  ...PropTypes.router,
  periodKeys: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
  withFocus: PropTypes.bool,
};

FormikDateRangeGroup.defaultProps = {
  withFocus: false,
};

export default memo(withRouter(FormikDateRangeGroup));
