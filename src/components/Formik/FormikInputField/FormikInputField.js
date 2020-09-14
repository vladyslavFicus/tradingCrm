import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Input from 'components/Input';

class FormikInputField extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    type: PropTypes.string,
    form: PropTypes.shape({
      errors: PropTypes.object.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    type: 'text',
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
      ...input
    } = this.props;

    return (
      <Input
        name={name}
        value={value}
        onChange={onChange}
        error={get(errors, name)}
        {...input}
      />
    );
  }
}

export default FormikInputField;
