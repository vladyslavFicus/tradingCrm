import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FormikInputField from '../../FormikInputField';

class FormikInputRangeField extends PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      setFieldValue: PropTypes.func.isRequired,
      setFieldError: PropTypes.func.isRequired,
      values: PropTypes.object.isRequired,
    }).isRequired,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    errorText: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    pattern: PropTypes.string,
  };

  static defaultProps = {
    pattern: '[0-9]*',
    min: 1,
    max: 10000,
  };

  handleInputChange = (event) => {
    const {
      target: {
        value,
        validity: { valid },
      },
    } = event;
    const {
      min,
      max,
      field: {
        name,
      },
      form: {
        setFieldValue,
        setFieldError,
      },
      errorText,
    } = this.props;

    if (!valid) {
      return;
    }

    const inputValue = parseInt(value, 10);

    if (((inputValue <= max && inputValue >= min) || !value)) {
      setFieldValue(name, value);
    } else if (inputValue > max || inputValue < min) {
      setFieldError(name, errorText);
    }
  }


  render() {
    return (
      <FormikInputField
        onChange={e => this.handleInputChange(e)}
        {...this.props}
      />
    );
  }
}

export default FormikInputRangeField;
