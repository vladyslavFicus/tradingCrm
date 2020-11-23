import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import './RuleScheduleTimeRange.scss';

const timeValues = [...Array(24)].map((_, index) => {
  const value = index < 10 ? `0${index}:00` : `${index}:00`;

  return {
    value,
    label: value,
  };
});

class RuleScheduleTimeRange extends PureComponent {
  static propTypes = {
    namePrefix: PropTypes.string.isRequired,
  };

  renderField = (name, label) => (
    <Field
      name={name}
      label={label}
      component={FormikSelectField}
      className="RuleScheduleTimeRange__field"
    >
      {timeValues.map(({ value, label: option }) => (
        <option key={value} value={value}>
          {option}
        </option>
      ))}
    </Field>
  );

  render() {
    const { namePrefix } = this.props;

    return (
      <div className="RuleScheduleTimeRange">
        {this.renderField(`${namePrefix}.timeFrom`, 'Time from')}
        <span className="RuleScheduleTimeRange__separator" />
        {this.renderField(`${namePrefix}.timeTo`, 'Time to')}
      </div>
    );
  }
}

export default RuleScheduleTimeRange;
