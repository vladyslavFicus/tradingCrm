import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Input from 'components/Input';

class FormikInputField extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    form: PropTypes.shape({
      errors: PropTypes.object.isRequired,
    }).isRequired,
  };

  render() {
    const {
      field,
      form: {
        errors,
      },
      ...input
    } = this.props;

    return <Input field={field} error={get(errors, field.name)} {...input} />;
  }
}

export default FormikInputField;
