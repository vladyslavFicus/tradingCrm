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
          PropTypes.object,
          PropTypes.arrayOf(PropTypes.string),
        ]),
      ).isRequired,
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
        setFieldValue,
      },
      ...rest
    } = this.props;

    const props = {
      name,
      value,
      onChange: () => setFieldValue(name, !value),
      ...rest,
      ...!isSubmitting,
      error: errors && errors[name],
    };

    return <Checkbox {...props} />;
  }
}

export default FormikCheckbox;
