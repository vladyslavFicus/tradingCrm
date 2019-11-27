/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';

class InputField extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    }).isRequired,
    form: PropTypes.shape({
      isSubmitting: PropTypes.bool.isRequired,
      errors: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]),
      ).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      value: PropTypes.string,
      touched: PropTypes.bool,
      error: PropTypes.string,
    }),
  };

  static defaultProps = {
    meta: {},
  };

  render() {
    const {
      type,
      field,
      form: {
        isSubmitting,
        errors,
      },
      meta: {
        touched,
      },
      ...rest
    } = this.props;

    const props = {
      type,
      ...rest,
      ...field,
      ...(touched && !isSubmitting),
      error: errors && errors[field.name],
    };

    return <Input {...props} />;
  }
}

export default InputField;
