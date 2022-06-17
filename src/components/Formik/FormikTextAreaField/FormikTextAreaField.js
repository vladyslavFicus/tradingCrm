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
      touched: PropTypes.object.isRequired,
      setFieldTouched: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleChange = async (e) => {
    const { field: { onChange, name }, form: { setFieldTouched } } = this.props;
    await onChange(e);
    setFieldTouched(name, true);
  }

  render() {
    const {
      field: {
        name,
        value,
      },
      form: {
        errors,
        touched,
      },
      ...textarea
    } = this.props;

    return (
      <TextArea
        name={name}
        value={value !== null ? value : ''}
        onChange={this.handleChange}
        error={get(touched, name) && get(errors, name)}
        {...textarea}
      />
    );
  }
}

export default FormikTextAreaField;
