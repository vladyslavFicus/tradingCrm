import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
import TimeRange from 'components/TimeRange';

class FormikTimeRangeField extends PureComponent {
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
    }).isRequired,
    fieldsLabels: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  };

  static defaultProps = {
    fieldsLabels: {},
  };

  getFieldsError = () => {
    const {
      form: { errors },
      fieldsNames,
    } = this.props;

    const fieldsKeys = Object.values(fieldsNames);

    return fieldsKeys.map(key => get(errors, key)).flat()[0];
  }

  render() {
    const {
      form: {
        values,
        setFieldValue,
      },
      fieldsNames,
      ...restProps
    } = this.props;

    // # Removed all unnecessary props
    const timeRangeProps = omit(restProps, ['form', 'field', 'children']);

    return (
      <TimeRange
        {...timeRangeProps}
        fieldsValues={{
          from: get(values, fieldsNames?.from),
          to: get(values, fieldsNames?.to),
        }}
        error={this.getFieldsError()}
        onChangeFrom={(value) => {
          setFieldValue(fieldsNames.from, value);
        }}
        onChangeTo={(value) => {
          setFieldValue(fieldsNames.to, value);
        }}
      />
    );
  }
}

export default FormikTimeRangeField;
