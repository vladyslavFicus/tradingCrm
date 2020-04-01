import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'components/Checkbox';

class FormikCheckbox extends PureComponent {
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
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    const {
      field: {
        value,
        name,
      },
      form: {
        isSubmitting,
        errors,
        touched,
        setFieldValue,
      },
      ...rest
    } = this.props;

    const props = {
      name,
      value,
      onChange: () => setFieldValue(name, !value),
      ...rest,
      ...(touched[name] && !isSubmitting),
      error: errors && errors[name],
    };

    return <Checkbox {...props} />;
  }
}

export default FormikCheckbox;
