import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { Field, FieldArray } from 'formik';
import PropTypes from 'prop-types';
import { FormikSwitchField } from 'components/Formik';
import { Button } from 'components/UI';
import RuleScheduleBoard from './components/RuleScheduleBoard';
import './RuleSchedule.scss';

class RuleSchedule extends PureComponent {
  static propTypes = {
    operators: PropTypes.array.isRequired,
    schedules: PropTypes.arrayOf(PropTypes.shape({
      days: PropTypes.arrayOf(PropTypes.string).isRequired,
      timeIntervals: PropTypes.arrayOf(PropTypes.shape({
        operatorSpreads: PropTypes.arrayOf(PropTypes.shape({
          parentUser: PropTypes.string,
        })),
        timeFrom: PropTypes.string,
        timeTo: PropTypes.string,
      })),
    })).isRequired,
    enableSchedulesValidation: PropTypes.func.isRequired,
    validationSchedulesEnabled: PropTypes.bool.isRequired,
    formikBag: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps({ schedules }) {
    const checkedDays = schedules.reduce((acc, { days }) => ([...acc, ...days]), []);

    return {
      checkedDays,
      hasLimitOfBoards: checkedDays.length === 7 || schedules.length === 7,
    };
  }

  state = {
    checkedDays: [],
    hasLimitOfBoards: false,
  };

  componentDidUpdate() {
    const {
      schedules,
      formikBag: {
        initialValues: {
          schedules: initialSchedules,
        },
      },
      validationSchedulesEnabled,
      enableSchedulesValidation,
    } = this.props;

    if (!validationSchedulesEnabled && JSON.stringify(schedules) !== JSON.stringify(initialSchedules)) {
      enableSchedulesValidation();
    }
  }

  addScheduleBoard = addValue => () => addValue({
    days: [],
    timeIntervals: [{ operatorSpreads: [] }],
  });

  render() {
    const {
      operators,
      schedules,
      formikBag,
      formikBag: {
        errors,
      },
    } = this.props;

    const {
      checkedDays,
      hasLimitOfBoards,
    } = this.state;

    return (
      <div className="RuleSchedule">
        <div className="RuleSchedule__header">
          <Field
            name="enableSchedule"
            label={I18n.t('RULE_MODAL.SCHEDULE.FILTERS.ENABLE_SCHEDULE')}
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
                  formikBag={formikBag}
                  errors={errors.schedules?.[index]}
                />
              ))}
              <div className="RuleSchedule__footer">
                <Button
                  onClick={this.addScheduleBoard(push)}
                  disabled={hasLimitOfBoards}
                  primaryOutline
                >
                  {I18n.t('RULE_MODAL.SCHEDULE.ADD_SCHEDULE_BUTTON')}
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
