import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { eq, get, omit } from 'lodash';
import InputRange from '../../InputRange';

class FormikInputRangeField extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    form: PropTypes.shape({
      setFieldError: PropTypes.func.isRequired,
      setFieldValue: PropTypes.func.isRequired,
      errors: PropTypes.object.isRequired,
      initialValues: PropTypes.object.isRequired,
    }).isRequired,
    errorText: PropTypes.string.isRequired,
    type: PropTypes.string,
    withFocus: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    pattern: PropTypes.string,
  };

  static defaultProps = {
    type: 'text',
    withFocus: false,
    pattern: '[0-9]*',
    min: 1,
    max: 10000,
  };

  isValueExist = () => {
    const { field: { value } } = this.props;

    return value !== undefined && value !== null;
  };

  onChange = (value) => {
    const {
      field: {
        name,
      },
      form: {
        setFieldValue,
      },
    } = this.props;

    setFieldValue(name, value);
  }

  onError = () => {
    const {
      field: {
        name,
      },
      form: {
        setFieldError,
      },
      errorText,
    } = this.props;

    setFieldError(name, errorText);
  }

  render() {
    const {
      field: {
        name,
        value,
      },
      form: {
        errors,
        initialValues,
      },
      withFocus,
      ...input
    } = this.props;

    return (
      <InputRange
        name={name}
        value={value !== null ? value : ''}
        onChange={this.onChange}
        onError={this.onError}
        error={get(errors, name)}
        isFocused={withFocus && this.isValueExist() && eq(get(initialValues, name), value)}
        {...omit(input, ['staticContext'])}
      />
    );
  }
}

export default FormikInputRangeField;
