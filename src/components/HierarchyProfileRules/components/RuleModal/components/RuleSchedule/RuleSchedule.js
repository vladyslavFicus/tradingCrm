import React, { PureComponent } from 'react';
import { Field } from 'formik';
import {
  FormikCheckbox,
  FormikSelectField,
  FormikSwitchField,
} from 'components/Formik';

class RuleSchedule extends PureComponent {
  render() {
    return (
      <div className="RuleSchedule">
        <Field
          name="checkbox"
          label="checkbox"
          component={FormikCheckbox}
        />
        <Field
          name="switch"
          label="switch"
          component={FormikSwitchField}
          onChange={() => {}}
        />
        <Field
          name="select"
          label="select"
          component={FormikSelectField}
        >
          {[1, 2].map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </Field>
      </div>
    );
  }
}

export default RuleSchedule;
