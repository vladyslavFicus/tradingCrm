import React from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import I18n from 'i18n-js';
import { FormikCheckbox } from 'components/Formik';
import { weekDays } from './constants';
import './DistributionRuleScheduleSettings.scss';


type FormValues = {
  schedule: {
    days: Array<string>,
  },
};

type Props = {
  formik: FormikProps<FormValues>,
};

const DistributionRuleScheduleSettings = (props: Props) => {
  const {
    formik: {
      values: {
        schedule: {
          days,
        },
      },
      setFieldValue,
    },
  } = props;

  const currentDays = days || [];

  const selectDay = (selectedDay: string) => {
    setFieldValue(
      'schedule.days',
      currentDays.includes(selectedDay)
        ? currentDays.filter(day => day !== selectedDay)
        : [...currentDays, selectedDay],
    );
  };

  return (
    <div className="DistributionRuleScheduleSettings">
      <FieldArray
        name="schedules"
        data-testid="DistributionRuleScheduleSettings-schedulesArray"
        render={() => weekDays.map(day => (
          <Field
            name={day}
            component={FormikCheckbox}
            label={I18n.t(`CLIENTS_DISTRIBUTION.RULE.FILTERS.DAYS.${day}`)}
            className="DistributionRuleScheduleSettings__days-item"
            data-testid={`DistributionRuleScheduleSettings-${day}Input`}
            onChange={() => selectDay(day)}
            value={currentDays.includes(day)}
            vertical
          />
        ))}
      />
    </div>
  );
};

export default React.memo(DistributionRuleScheduleSettings);
