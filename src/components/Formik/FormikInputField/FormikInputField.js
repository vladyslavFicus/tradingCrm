import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input';

class FormikInputField extends PureComponent {
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
      touched: PropTypes.objectOf(PropTypes.bool),
    }).isRequired,
  };

  render() {
    const {
      type,
      field,
      form: {
        isSubmitting,
        errors,
        touched,
      },
      ...rest
    } = this.props;

    const props = {
      type,
      ...rest,
      ...field,
      ...(touched[field.name] && !isSubmitting),
      error: errors && errors[field.name],
    };

    return <Input {...props} />;
  }
}

export default FormikInputField;
