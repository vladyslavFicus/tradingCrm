import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FormikInputField from '../../FormikInputField';

class FormikInputDecimalsField extends PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      setFieldValue: PropTypes.func.isRequired,
      values: PropTypes.object.isRequired,
    }).isRequired,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    decimalsLimit: PropTypes.number,
    decimalsWarningMessage: PropTypes.string,
    decimalsLengthDefault: PropTypes.number,
  };

  static defaultProps = {
    decimalsLimit: undefined,
    decimalsWarningMessage: '',
    decimalsLengthDefault: undefined,
  };

  state = {
    showWarningMessage: false,
  }

  handleInputChange = (event) => {
    const {
      target: { value },
    } = event;

    const {
      field: { name },
      form: { setFieldValue },
      decimalsLimit,
    } = this.props;

    if (decimalsLimit && +value !== Math.floor(value)) {
      this.validationDecimals(decimalsLimit, value);

      return;
    }

    setFieldValue(name, value);
  }

  handleInputBlur = ({ target: { value } }) => {
    const {
      field: { name },
      form: { setFieldValue },
      decimalsLengthDefault,
    } = this.props;

    if (decimalsLengthDefault && value) {
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
      setFieldValue(name, value);
      this.setState({ showWarningMessage: false });
    }
  }

  render() {
    return (
      <FormikInputField
        onChange={e => this.handleInputChange(e)}
        onBlur={e => this.handleInputBlur(e)}
        warningMessage={this.props.decimalsWarningMessage}
        showWarningMessage={this.state.showWarningMessage}
        {...this.props}
      />
    );
  }
}

export default FormikInputDecimalsField;
