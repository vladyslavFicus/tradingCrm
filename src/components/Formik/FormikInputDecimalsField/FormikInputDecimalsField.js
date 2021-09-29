import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { eq, get, omit } from 'lodash';
import InputDecimals from 'components/InputDecimals';

class FormikInputDecimalsField extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    form: PropTypes.shape({
      errors: PropTypes.object.isRequired,
      initialValues: PropTypes.object.isRequired,
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
    decimalsWarningMessage: PropTypes.string,
    withFocus: PropTypes.bool,
  };

  static defaultProps = {
    decimalsWarningMessage: '',
    withFocus: false,
  };

  isValueExist = () => {
    const { field: { value } } = this.props;

    return value !== undefined && value !== null;
  };

  handleInputChange = (value) => {
    const { form: { setFieldValue }, field: { name } } = this.props;

    setFieldValue(name, value);
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
      decimalsWarningMessage,
      ...input
    } = this.props;

    return (
      <InputDecimals
        name={name}
        value={value !== null ? value : ''}
        onChange={this.handleInputChange}
        warningMessage={decimalsWarningMessage}
        error={get(errors, name)}
        isFocused={withFocus && this.isValueExist() && eq(get(initialValues, name), value)}
        {...omit(input, ['staticContext'])}
      />
    );
  }
}

export default FormikInputDecimalsField;
