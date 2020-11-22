/* eslint-disable */
import React, { PureComponent, Fragment } from 'react';
import { Field, FieldArray } from 'formik';
import PropTypes from 'prop-types';
import { FormikSwitchField } from 'components/Formik';
import { Button } from 'components/UI';
import RuleScheduleBoard from './components/RuleScheduleBoard';
import './RuleSchedule.scss';

class RuleSchedule extends PureComponent {
  static propTypes = {
    operators: PropTypes.array.isRequired, 
    schedule: PropTypes.arrayOf(PropTypes.shape({
      week: PropTypes.object.isRequired,
      timeInterval: PropTypes.arrayOf(PropTypes.shape({
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

  static getDerivedStateFromProps({ schedule }) {
    const checkedDays = schedule.reduce((acc, { week }) => ({ ...acc, ...week }), {});

    return {
      checkedDays,
      hasLimitOfBoards: Object.values(checkedDays).filter(Boolean).length === 7,
    };
  };

  state = {
    checkedDays: {},
    hasLimitOfBoards: false,
  };

  addScheduleBoard = addValue => () => addValue({
    week: {},
    timeInterval: [{ operatorSpreads: [] }],
  });

  render() {
    const {
      operators,
      schedule,
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
            name="enableScheduleSettings"
            label="Enable Schedule Settings"
            component={FormikSwitchField}
            // onChange={() => {}}
            textFirst
          />
        </div>
        <FieldArray
          name="schedule"
          render={({ push, remove }) => (
            <Fragment>
              {schedule.map((scheduleBoard, index) => (
                <RuleScheduleBoard
                  key={index}
                  operators={operators}
                  namePrefix={`schedule[${index}]`}
                  checkedDays={checkedDays}
                  scheduleBoard={scheduleBoard}
                  removeScheduleBoard={schedule[1] ? () => remove(index) : null}
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
