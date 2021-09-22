import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import TextArea from 'components/TextArea';

class FormikTextAreaField extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    form: PropTypes.shape({
      errors: PropTypes.object.isRequired,
    }).isRequired,
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
      ...textarea
    } = this.props;

    return (
      <TextArea
        name={name}
        value={value !== null ? value : ''}
        onChange={onChange}
        error={get(errors, name)}
        {...textarea}
      />
    );
  }
}

export default FormikTextAreaField;
