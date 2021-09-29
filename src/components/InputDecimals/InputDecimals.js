import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input';

class InputDecimals extends React.Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    decimalsLimit: PropTypes.number,
    decimalsLengthDefault: PropTypes.number,
  };

  static defaultProps = {
    decimalsLimit: undefined,
    decimalsLengthDefault: undefined,
    onBlur: () => {},
    onFocus: () => {},
  };

  state = {
    value: '',
    showWarningMessage: false,
    blur: false,
  }

  static getDerivedStateFromProps({ value, decimalsLimit, decimalsLengthDefault }, state) {
    if (!value) {
      return state;
    }
    const stringValue = value.toString();
    const [digits, decimals] = stringValue.split(/[,.]/);

    if (state.blur && (value % 1 !== 0) && decimals.length > decimalsLimit) {
      return {
        value: value.substring(0, digits.length + decimalsLimit + 1),
        showWarningMessage: true,
      };
    } if (state.blur) {
      return {
        value: Number(value).toFixed(decimalsLengthDefault),
        showWarningMessage: false,
      };
    }

    return {
      value: state.showWarningMessage ? state.value : value,
    };
  }

  setValue = (value, showWarningMessage) => {
    const { onChange } = this.props;

    this.setState({ value, showWarningMessage });
    onChange(parseFloat(value));
  }

  handleInputChange = (event) => {
    const {
      target: { value },
    } = event;

    const {
      decimalsLimit,
    } = this.props;

    if (decimalsLimit && +value !== Math.floor(value)) {
      this.validationDecimals(decimalsLimit, value);

      return;
    }

    this.setValue(value, false);
  }

  handleInputBlur = (e) => {
    const { onBlur } = this.props;

    this.setState({
      blur: true,
    });

    onBlur(e);
  }

  handleInputFocus = (e) => {
    const { onFocus } = this.props;

    this.setState({
      blur: false,
    });

    onFocus(e);
  }

  validationDecimals = (decimalsLimit, value) => {
    const [digits, decimals] = value.split(/[,.]/);

    if (decimals.length > decimalsLimit) {
      this.setValue(value.substring(0, digits.length + decimalsLimit + 1), true);
    } else {
      this.setValue(value, false);
    }
  }

  render() {
    return (
      <Input
        {...this.props}
        showWarningMessage={this.state.showWarningMessage}
        value={this.state.value}
        onChange={this.handleInputChange}
        onBlur={this.handleInputBlur}
        onFocus={this.handleInputFocus}
      />
    );
  }
}

export default InputDecimals;
