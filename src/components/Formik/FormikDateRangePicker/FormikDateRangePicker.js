import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { omit, get } from 'lodash';
import { DateRangePicker } from 'components/DatePickers';

class FormikDateRangePicker extends PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      initialValues: PropTypes.object.isRequired,
      values: PropTypes.object.isRequired,
      errors: PropTypes.object.isRequired,
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
    fieldsNames: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      additional: PropTypes.string,
    }).isRequired,
    withFocus: PropTypes.bool,
  };

  static defaultProps = {
    withFocus: false,
  };

  getFieldsError = () => {
    const {
      form: { errors },
      fieldsNames,
    } = this.props;

    const fieldsKeys = Object.values(fieldsNames);

    return fieldsKeys.map(key => get(errors, key)).flat()[0];
  }

  getPickerFocusState = () => {
    const {
      form: {
        initialValues,
        values,
      },
      fieldsNames,
      withFocus,
    } = this.props;

    const fieldsKeys = Object.values(fieldsNames);

    const getValuesEqualsToInitial = fieldsKeys.filter((key) => {
      const initialValueByKey = get(initialValues, key);

      return initialValueByKey && initialValueByKey === get(values, key);
    });

    return withFocus && getValuesEqualsToInitial.length > 0;
  }

  render() {
    const {
      form: {
        values,
        setFieldValue,
      },
      fieldsNames,
      withFocus,
      ...restProps
    } = this.props;

    // # Removed all unecessary props
    const dateRangePickerProps = omit(restProps, ['form', 'field', 'children']);

    return (
      <DateRangePicker
        {...dateRangePickerProps}
        error={this.getFieldsError()}
        additionalValue={fieldsNames.additional ? values[fieldsNames.additional] : null}
        dateRange={{
          from: get(values, fieldsNames.from),
          to: get(values, fieldsNames.to),
        }}
        setValues={(_values) => {
          if (_values.from) {
            setFieldValue(fieldsNames.from, _values.from);
          }

          if (_values.to) {
            setFieldValue(fieldsNames.to, _values.to);
          }

          if (_values.additional) {
            setFieldValue(fieldsNames.additional, _values.additional);
          }
        }}
        withFocus={this.getPickerFocusState()}
      />
    );
  }
}

export default FormikDateRangePicker;
