import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { DatePicker } from 'components/DatePickers';

class FormikDatePicker extends PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      initialValues: PropTypes.object,
      errors: PropTypes.object,
      setFieldValue: PropTypes.func,
    }).isRequired,
    field: PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    withFocus: PropTypes.bool,
  };

  static defaultProps = {
    withFocus: false,
  };

  getPickerFocusState = () => {
    const {
      form: { initialValues },
      field: { name, value },
      withFocus,
    } = this.props;

    return withFocus && initialValues[name] && initialValues[name] === value;
  }

  render() {
    const {
      form: { setFieldValue, errors },
      field: { name, value },
      withFocus,
      ...restProps
    } = this.props;

    // # Removed all unecessary props
    const datePickerProps = omit(restProps, ['form', 'field', 'children']);

    return (
      <DatePicker
        {...datePickerProps}
        error={errors[name] && errors[name][0]}
        value={value}
        setValue={_value => setFieldValue(name, _value)}
        withFocus={this.getPickerFocusState()}
      />
    );
  }
}

export default FormikDatePicker;
