import React from 'react';
import PropTypes from 'prop-types';

export default function withReduxFormValues(WrappedComponent) {
  const ReduxFormValuesWrapper = (props, context) => (
    <WrappedComponent {...props} formValues={context._reduxForm.getValues()} />
  );
  ReduxFormValuesWrapper.contextTypes = {
    _reduxForm: PropTypes.shape({
      getValues: PropTypes.func.isRequired,
    }).isRequired,
  };

  return ReduxFormValuesWrapper;
}
