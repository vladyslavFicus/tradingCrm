import React from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

function withReduxFormName(WrappedComponent) {
  function GetReduxFormNameWrapper(props, context) {
    return <WrappedComponent {...props} formName={context._reduxForm.form} />;
  }

  GetReduxFormNameWrapper.contextTypes = {
    _reduxForm: PropTypes.shape({
      form: PropTypes.string.isRequired,
    }).isRequired,
  };

  return GetReduxFormNameWrapper;
}

export default function withReduxFormValues(WrappedComponent) {
  return compose(
    withReduxFormName,
    connect((state, ownProps) => ({
      formValues: getFormValues(ownProps.formName)(state),
    })),
  )(WrappedComponent);
}
