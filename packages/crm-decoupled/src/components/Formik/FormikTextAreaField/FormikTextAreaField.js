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
      initialValues: PropTypes.object,
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
        initialValues,
      },
      ...textarea
    } = this.props;

    const isErrorMessageVisible = get(initialValues, name) === undefined || get(touched, name);

    return (
      <TextArea
        name={name}
        value={value !== null ? value : ''}
        onChange={this.handleChange}
        error={isErrorMessageVisible && get(errors, name)}
        {...textarea}
      />
    );
  }
}

export default FormikTextAreaField;
