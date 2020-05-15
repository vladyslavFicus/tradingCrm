import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Input from 'components/Input';

class FormikInputField extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    }).isRequired,
    type: PropTypes.string,
    form: PropTypes.shape({
      isSubmitting: PropTypes.bool.isRequired,
      errors: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.arrayOf(PropTypes.objectOf(
            PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.arrayOf(PropTypes.string),
            ]),
          ).isRequired),
        ]),
      ).isRequired,
      touched: PropTypes.object.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    type: undefined,
  };

  render() {
    const {
      type,
      field,
      form: {
        isSubmitting,
        errors,
        touched,
      },
      ...rest
    } = this.props;

    const props = {
      type,
      ...rest,
      ...field,
      ...(touched[field.name] && !isSubmitting),
      error: errors && get(errors, field.name),
    };

    return <Input {...props} />;
  }
}

export default FormikInputField;
