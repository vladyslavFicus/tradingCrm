import React, { useEffect, useState } from 'react';
import I18n from 'i18n-js';
import { Field, FieldArray, FormikErrors } from 'formik';
import { Operator, RuleSchedule as RuleScheduleType } from '__generated__/types';
import { FormikSwitchField } from 'components/Formik';
import { Button } from 'components';
import { FormValues, FormikBag } from '../../types';
import RuleScheduleBoard from './components/RuleScheduleBoard';
import './RuleSchedule.scss';

type Props = {
  operators: Array<Operator>,
  values: FormValues,
  formikBag: FormikBag,
  validationSchedulesEnabled: boolean,
  enableSchedulesValidation: () => void,
};

const RuleSchedule = (props: Props) => {
  const {
    operators,
    values: {
      enableSchedule,
      schedules,
    },
    formikBag,
    formikBag: {
      initialValues,
      errors,
    },
    validationSchedulesEnabled,
    enableSchedulesValidation,
  } = props;

  const [checkedDays, setCheckedDays] = useState<Array<string>>([]);
  const [isLimitOfBoards, setIsLimitOfBoards] = useState(false);

  const addScheduleBoard = (addValue: (obj: any) => void) => () => addValue({
    days: [],
    timeIntervals: [{ operatorSpreads: [] }],
  });

  // ===== Effects ===== //
  useEffect(() => {
    const checked = schedules.reduce<Array<string>>((acc, { days }) => ([...acc, ...(days || [])]), []);
    setCheckedDays(checked);
    setIsLimitOfBoards(checked.length === 7 || schedules.length === 7);
  }, [schedules]);

  useEffect(() => {
    if (!validationSchedulesEnabled
      && (enableSchedule !== initialValues.enableSchedule
      || JSON.stringify(schedules) !== JSON.stringify(initialValues.schedules))
    ) {
      enableSchedulesValidation();
    }
  }, [schedules, enableSchedule]);

  return (
    <div className="RuleSchedule">
      <div className="RuleSchedule__header">
        <Field
          name="enableSchedule"
          data-testid="RuleSchedule-enableScheduleSwitch"
          label={I18n.t('RULE_MODAL.SCHEDULE.FILTERS.ENABLE_SCHEDULE')}
          labelPosition="left"
          component={FormikSwitchField}
        />
      </div>

      <FieldArray
        name="schedules"
        data-testid="RuleSchedule-schedulesArray"
        render={({ push, remove }) => (
          <>
            {schedules.map((scheduleBoard, index) => (
              <RuleScheduleBoard
                key={index}
                operators={operators}
                namePrefix={`schedules[${index}]`}
                checkedDays={checkedDays}
                scheduleBoard={scheduleBoard}
                removeScheduleBoard={schedules[1] ? () => remove(index) : undefined}
                formikBag={formikBag}
                errors={errors.schedules?.[index] as FormikErrors<RuleScheduleType>}
              />
            ))}

            <div className="RuleSchedule__footer">
              <Button
                data-testid="RuleSchedule-addScheduleButton"
                tertiary
                onClick={addScheduleBoard(push)}
                disabled={isLimitOfBoards}
              >
                {I18n.t('RULE_MODAL.SCHEDULE.ADD_SCHEDULE_BUTTON')}
              </Button>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default React.memo(RuleSchedule);
