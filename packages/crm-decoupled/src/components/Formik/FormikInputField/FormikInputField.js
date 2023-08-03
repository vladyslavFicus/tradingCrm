import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { eq, get, omit } from 'lodash';
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
      initialValues: PropTypes.object,
      touched: PropTypes.object.isRequired,
      setFieldTouched: PropTypes.func.isRequired,
    }).isRequired,
    type: PropTypes.string,
    withFocus: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    withFocus: false,
  };

  isValueExist = () => {
    const { field: { value } } = this.props;

    return value !== undefined && value !== null;
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
        initialValues,
        touched,
      },
      withFocus,
      ...input
    } = this.props;

    const isErrorMessageVisible = get(initialValues, name) === undefined || get(touched, name);

    return (
      <Input
        name={name}
        value={value !== null ? value : ''}
        error={isErrorMessageVisible && get(errors, name)}
        isFocused={withFocus && this.isValueExist() && eq(get(initialValues, name), value)}
        onChange={this.handleChange}
        {...omit(input, ['staticContext'])}
      />
    );
  }
}

export default FormikInputField;
