import React from 'react';
import I18n from 'i18n-js';
import { FieldArray, FormikErrors } from 'formik';
import {
  Operator,
  RuleSchedule,
  Rule__OperatorSpread as RuleOperatorSpread,
} from '__generated__/types';
import Checkbox from 'components/Checkbox';
import RuleOperatorSpreads from 'components/RuleOperatorSpreads';
import { FormikBag, TimeIntervalError } from '../../../../types';
import RemoveBoardButton from './components/RemoveBoardButton';
import AddTimeIntervalButton from './components/AddTimeIntervalButton';
import RemoveTimeIntervalButton from './components/RemoveTimeIntervalButton';
import RuleScheduleTimeRange from './components/RuleScheduleTimeRange';
import { weekDays } from './constants';
import './RuleScheduleBoard.scss';

type Props = {
  namePrefix: string,
  operators: Array<Operator>,
  checkedDays: Array<string>,
  scheduleBoard: RuleSchedule,
  formikBag: FormikBag,
  errors?: FormikErrors<RuleSchedule>,
  removeScheduleBoard?: () => void,
};

const RuleScheduleBoard = (props: Props) => {
  const {
    namePrefix,
    operators,
    checkedDays,
    scheduleBoard: {
      days,
      timeIntervals,
    },
    formikBag: {
      isSubmitting,
      setFieldValue,
    },
    errors,
    removeScheduleBoard,
  } = props;

  const selectDay = (selectedDay: string) => {
    setFieldValue(
      `${namePrefix}.days`,
      days.includes(selectedDay) ? days.filter(day => day !== selectedDay) : [...days, selectedDay],
    );
  };

  const addTimeInterval = () => {
    setFieldValue(
      `${namePrefix}.timeIntervals`,
      [...timeIntervals, { operatorSpreads: [], timeFrom: '00:00', timeTo: '00:00' }],
    );
  };

  const removeOperatorSpread = (name: string, index: number, values: Array<RuleOperatorSpread>) => {
    const operatorSpreads = [...values];
    operatorSpreads.splice(index, 1);

    setFieldValue(name, operatorSpreads);
  };

  // ===== Renders ===== //
  const renderDays = () => (
    <div className="RuleScheduleBoard__days">
      <div className="RuleScheduleBoard__days-list">
        {weekDays.map(day => (
          <Checkbox
            key={day}
            name={day}
            label={I18n.t(`RULE_MODAL.SCHEDULE.FILTERS.DAYS.${day}`)}
            className="RuleScheduleBoard__days-item"
            onChange={() => selectDay(day)}
            value={days.includes(day)}
            disabled={!days.includes(day) && checkedDays.includes(day)}
            vertical
          />
        ))}
      </div>

      <If condition={!!errors?.days}>
        <div className="RuleScheduleBoard__error-message">
          <i className="RuleScheduleBoard__error-message-icon icon-alert" />

          {I18n.t('RULE_MODAL.SCHEDULE.ERRORS.DAY_IS_REQUIRED')}
        </div>
      </If>
    </div>
  );

  const renderTimeIntervalList = () => (
    <FieldArray
      name={`${namePrefix}.timeIntervals`}
      data-testid="RuleScheduleBoard-timeIntervalsArray"
      render={({ remove }) => (
        <>
          {timeIntervals.map(({ operatorSpreads, timeFrom, timeTo }, timeIntervalIndex) => {
            const timeIntervalPrefix = `${namePrefix}.timeIntervals[${timeIntervalIndex}]`;
            const timeIntervalError = errors?.timeIntervals?.[timeIntervalIndex] as TimeIntervalError;

            return (
              <div key={timeIntervalPrefix} className="RuleScheduleBoard__time-interval">
                <RuleScheduleTimeRange
                  namePrefix={timeIntervalPrefix}
                  timeFrom={timeFrom}
                  timeTo={timeTo}
                  error={timeIntervalError?.timeRange}
                  setFieldValue={setFieldValue}
                />

                <RuleOperatorSpreads
                  operators={operators}
                  operatorSpreads={operatorSpreads}
                  removeOperatorSpread={index => removeOperatorSpread(
                    `${timeIntervalPrefix}.operatorSpreads`,
                    index,
                    operatorSpreads,
                  )}
                  namePrefix={`${timeIntervalPrefix}.operatorSpreads`}
                  disabled={isSubmitting}
                  validationError={timeIntervalError?.operatorSpreads}
                />

                <RemoveTimeIntervalButton
                  className="RuleScheduleBoard__remove-time-interval"
                  data-testid="RuleScheduleBoard-removeTimeIntervalButton"
                  onClick={timeIntervals[1] ? () => remove(timeIntervalIndex) : undefined}
                />
              </div>
            );
          })}
        </>
      )}
    />
  );

  return (
    <div className="RuleScheduleBoard">
      <div className="RuleScheduleBoard__header">
        {renderDays()}

        <RemoveBoardButton
          className="RuleScheduleBoard__remove-shedule"
          data-testid="RuleScheduleBoard-removeBoardButton"
          onClick={removeScheduleBoard}
        />
      </div>

      <div className="RuleScheduleBoard__body">
        {renderTimeIntervalList()}
      </div>

      <AddTimeIntervalButton
        className="RuleScheduleBoard__footer"
        data-testid="RuleScheduleBoard-addTimeIntervalButton"
        onClick={addTimeInterval}
      />
    </div>
  );
};

export default React.memo(RuleScheduleBoard);
