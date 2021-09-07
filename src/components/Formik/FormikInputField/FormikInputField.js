import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { eq, get, omit } from 'lodash';
import Input from 'components/Input';

class FormikInputField extends PureComponent {
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
      setErrors: PropTypes.func.isRequired,
    }).isRequired,
    type: PropTypes.string,
    withFocus: PropTypes.bool,
    decimalsLimit: PropTypes.number,
    decimalsWarningMessage: PropTypes.string,
    decimalsLengthDefault: PropTypes.number,
  };

  static defaultProps = {
    type: 'text',
    withFocus: false,
    decimalsLimit: undefined,
    decimalsWarningMessage: '',
    decimalsLengthDefault: undefined,
  };

  state = {
    showWarningMessage: false,
  }

  isValueExist = () => {
    const { field: { value } } = this.props;

    return value !== undefined && value !== null;
  };

  onHandleChange = (value) => {
    const {
      field: { name },
      form: { setFieldValue },
      decimalsLimit,
    } = this.props;

    setFieldValue(name, value);

    if (decimalsLimit && +value !== Math.floor(+value)) {
      this.validationDecimals(decimalsLimit, value);
    }
  }

  onHandleBlur = ({ target: { value } }) => {
    const {
      field: { name },
      form: { setFieldValue },
      decimalsLengthDefault,
    } = this.props;

    if (decimalsLengthDefault) {
      setFieldValue(name, Number(value).toFixed(decimalsLengthDefault));
    }
  }

  validationDecimals = (decimalsLimit, value) => {
    const {
      field: { name },
      form: {
        setFieldValue,
      },
    } = this.props;

    const [digits, decimals] = value.split(/[,.]/);

    if (decimals.length > decimalsLimit) {
      setFieldValue(name, value.substring(0, digits.length + decimalsLimit + 1));
      this.setState({ showWarningMessage: true });
    } else {
      this.setState({ showWarningMessage: false });
    }
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
      <Input
        name={name}
        value={value !== null ? value : ''}
        onChange={this.onHandleChange}
        onBlur={this.onHandleBlur}
        error={get(errors, name)}
        showWarningMessage={this.state.showWarningMessage}
        warningMessage={decimalsWarningMessage}
        isFocused={withFocus && this.isValueExist() && eq(get(initialValues, name), value)}
        {...omit(input, ['staticContext'])}
      />
    );
  }
}

export default FormikInputField;
