import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input';

class InputRange extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    onError: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    pattern: PropTypes.string,
  };

  static defaultProps = {
    onChange: () => {},
    onError: () => {},
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
      onChange,
      onError,
      min,
      max,
    } = this.props;

    if (!valid) {
      return;
    }

    const inputValue = parseInt(value, 10);

    if (((inputValue <= max && inputValue >= min) || !value)) {
      onChange(value !== '' ? inputValue : value);
    } else if ((inputValue > max || inputValue < min) && onError) {
      onError();
    }
  }

  render() {
    return (
      <Input {...this.props} onChange={this.handleInputChange} />
    );
  }
}

export default InputRange;
