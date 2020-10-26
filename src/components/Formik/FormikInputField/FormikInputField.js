import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
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
    }).isRequired,
    type: PropTypes.string,
    withFocus: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    withFocus: false,
  };

  render() {
    const {
      field: {
        name,
        value,
        onChange,
      },
      form: {
        errors,
      },
      withFocus,
      ...input
    } = this.props;

    return (
      <Input
        name={name}
        value={value !== null ? value : ''}
        onChange={onChange}
        error={get(errors, name)}
        isFocused={withFocus && value}
        {...omit(input, ['staticContext'])}
      />
    );
  }
}

export default FormikInputField;
