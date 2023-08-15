import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '..';

class InputDecimals extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    decimalsLimit: PropTypes.number,
    decimalsWarningMessage: PropTypes.string,
    decimalsLengthDefault: PropTypes.number,
  };

  static defaultProps = {
    value: undefined,
    disabled: false,
    decimalsLimit: undefined,
    decimalsWarningMessage: '',
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
      return { value };
    }
    const stringValue = value.toString();
    const [digits, decimals] = stringValue.split(/[,.]/);
    if (state.blur && (value % 1 !== 0) && decimals.length > decimalsLimit) {
      return {
        value: value.toString().substring(0, digits.length + decimalsLimit + 1),
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

    onChange(value ? parseFloat(value) : null);
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

  handleKeyDown = (e) => {
    const { decimalsLimit } = this.props;
    const { value } = this.state;

    // Check if decimals limit is 0 and user tried to enter dot or comma in input
    // We should prevent enter dot in input and show warning
    if (decimalsLimit === 0 && ['.', ','].includes(e.key)) {
      e.preventDefault();

      this.setValue(value, true);
    }
  };

  render() {
    const {
      onFocus,
      onBlur,
      onChange,
      decimalsLimit,
      decimalsLengthDefault,
      decimalsWarningMessage,
      ...props
    } = this.props;

    const {
      showWarningMessage,
      value,
    } = this.state;

    return (
      <Input
        {...props}
        showWarningMessage={showWarningMessage}
        warningMessage={decimalsWarningMessage}
        value={value}
        onChange={this.handleInputChange}
        onBlur={this.handleInputBlur}
        onFocus={this.handleInputFocus}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

export default InputDecimals;
