import React, { PureComponent, Fragment } from 'react';
import { Field, FieldArray } from 'formik';
import PropTypes from 'prop-types';
import { FormikSwitchField } from 'components/Formik';
import { Button } from 'components/UI';
import RuleScheduleBoard from './RuleScheduleBoard';
import './RuleSchedule.scss';

class RuleSchedule extends PureComponent {
  static propTypes = {
    operators: PropTypes.array.isRequired,
    schedules: PropTypes.arrayOf(PropTypes.shape({
      days: PropTypes.object.isRequired,
      timeIntervals: PropTypes.arrayOf(PropTypes.shape({
        operatorSpreads: PropTypes.arrayOf(PropTypes.shape({
          parentUser: PropTypes.string,
        })),
        timeFrom: PropTypes.string,
        timeTo: PropTypes.string,
      })),
    })).isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    // errors: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps({ schedules }) {
    const checkedDays = schedules.reduce((acc, { days }) => ({ ...acc, ...days }), {});

    return {
      checkedDays,
      hasLimitOfBoards: Object.values(checkedDays).filter(Boolean).length === 7,
    };
  }

  state = {
    checkedDays: {},
    hasLimitOfBoards: false,
  };

  addScheduleBoard = addValue => () => addValue({
    days: {},
    timeIntervals: [{ operatorSpreads: [] }],
  });

  render() {
    const {
      operators,
      schedules,
      // errors,
      isSubmitting,
      setFieldValue,
    } = this.props;

    const {
      checkedDays,
      hasLimitOfBoards,
    } = this.state;

    return (
      <div className="RuleSchedule">
        <div className="RuleSchedule__header">
          <Field
            name="enableScheduling"
            label="Enable Schedule Settings"
            component={FormikSwitchField}
            textFirst
          />
        </div>
        <FieldArray
          name="schedules"
          render={({ push, remove }) => (
            <Fragment>
              {schedules.map((scheduleBoard, index) => (
                <RuleScheduleBoard
                  key={index}
                  operators={operators}
                  namePrefix={`schedules[${index}]`}
                  checkedDays={checkedDays}
                  scheduleBoard={scheduleBoard}
                  removeScheduleBoard={schedules[1] ? () => remove(index) : null}
                  setFieldValue={setFieldValue}
                  isSubmitting={isSubmitting}
                />
              ))}
              <div className="RuleSchedule__footer">
                <Button
                  onClick={this.addScheduleBoard(push)}
                  disabled={hasLimitOfBoards}
                  primaryOutline
                >
                  + ADD SHEDULE
                </Button>
              </div>
            </Fragment>
          )}
        />
      </div>
    );
  }
}

export default RuleSchedule;
