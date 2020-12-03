import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { FieldArray } from 'formik';
import Checkbox from 'components/Checkbox';
import RuleOperatorSpreads from 'components/RuleOperatorSpreads';
import RemoveBoardButton from './components/RemoveBoardButton';
import AddTimeIntervalButton from './components/AddTimeIntervalButton';
import RemoveTimeIntervalButton from './components/RemoveTimeIntervalButton';
import RuleScheduleTimeRange from './components/RuleScheduleTimeRange';
import { weekDays } from './constants';
import './RuleScheduleBoard.scss';

class RuleScheduleBoard extends PureComponent {
  static propTypes = {
    operators: PropTypes.array.isRequired,
    namePrefix: PropTypes.string.isRequired,
    checkedDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    scheduleBoard: PropTypes.shape({
      days: PropTypes.arrayOf(PropTypes.string).isRequired,
      timeIntervals: PropTypes.arrayOf(
        PropTypes.shape({
          operatorSpreads: PropTypes.array,
          timeFrom: PropTypes.string,
          timeTo: PropTypes.string,
        }),
      ),
    }).isRequired,
    removeScheduleBoard: PropTypes.func,
    formikBag: PropTypes.object.isRequired,
    errors: PropTypes.object,
  };

  static defaultProps = {
    removeScheduleBoard: null,
    errors: null,
  };

  selectDay = (selectedDay) => {
    const {
      namePrefix,
      scheduleBoard: {
        days,
      },
      formikBag: {
        setFieldValue,
      },
    } = this.props;

    setFieldValue(
      `${namePrefix}.days`,
      days.includes(selectedDay) ? days.filter(day => day !== selectedDay) : [...days, selectedDay],
    );
  };

  addTimeInterval = () => {
    const {
      namePrefix,
      scheduleBoard: {
        timeIntervals,
      },
      formikBag: {
        setFieldValue,
      },
    } = this.props;

    setFieldValue(
      `${namePrefix}.timeIntervals`,
      [...timeIntervals, { operatorSpreads: [], timeFrom: '00:00', timeTo: '00:00' }],
    );
  };

  removeOperatorSpread = (name, index, values) => {
    const operatorSpreads = [...values];
    operatorSpreads.splice(index, 1);

    this.props.formikBag.setFieldValue(name, operatorSpreads);
  };

  renderDays = () => {
    const {
      scheduleBoard: {
        days,
      },
      checkedDays,
      errors,
    } = this.props;

    return (
      <div className="RuleScheduleBoard__days">
        <div className="RuleScheduleBoard__days-list">
          {weekDays.map(day => (
            <Checkbox
              key={day}
              name={day}
              label={I18n.t(`RULE_MODAL.SCHEDULE.FILTERS.DAYS.${day}`)}
              className="RuleScheduleBoard__days-item"
              onChange={() => this.selectDay(day)}
              value={days.includes(day)}
              disabled={!days.includes(day) && checkedDays.includes(day)}
              vertical
            />
          ))}
        </div>
        <If condition={errors?.days}>
          <div className="RuleScheduleBoard__error-message">
            <i className="RuleScheduleBoard__error-message-icon icon-alert" />
            {I18n.t('RULE_MODAL.SCHEDULE.ERRORS.DAY_IS_REQUIRED')}
          </div>
        </If>
      </div>
    );
  };

  renderTimeIntervalList = () => {
    const {
      namePrefix,
      scheduleBoard: {
        timeIntervals,
      },
      errors,
    } = this.props;

    return (
      <FieldArray
        name={`${namePrefix}.timeIntervals`}
        render={({ remove }) => (
          <Fragment>
            {timeIntervals.map((timeInterval, timeIntervalIndex) => this.renderTimeInterval({
              timeInterval,
              namePrefix: `${namePrefix}.timeIntervals[${timeIntervalIndex}]`,
              removeTimeInterval: timeIntervals[1] ? () => remove(timeIntervalIndex) : null,
              timeIntervalErrors: errors?.timeIntervals?.[timeIntervalIndex],
            }))}
          </Fragment>
        )}
      />
    );
  };

  renderTimeInterval = ({
    timeInterval: { operatorSpreads, timeFrom, timeTo },
    namePrefix,
    removeTimeInterval,
    timeIntervalErrors,
  }) => {
    const {
      operators,
      formikBag: {
        setFieldValue,
        isSubmitting,
      },
    } = this.props;

    return (
      <div key={namePrefix} className="RuleScheduleBoard__time-interval">
        <RuleScheduleTimeRange
          namePrefix={namePrefix}
          timeFrom={timeFrom}
          timeTo={timeTo}
          error={timeIntervalErrors?.timeRange}
          setFieldValue={setFieldValue}
        />
        <RuleOperatorSpreads
          operators={operators}
          operatorSpreads={operatorSpreads}
          removeOperatorSpread={index => (
            this.removeOperatorSpread(`${namePrefix}.operatorSpreads`, index, operatorSpreads)
          )}
          namePrefix={`${namePrefix}.operatorSpreads`}
          disabled={isSubmitting}
          percentageLimitError={timeIntervalErrors?.operatorSpreads === 'INVALID_PERCENTAGE'}
        />
        <RemoveTimeIntervalButton
          className="RuleScheduleBoard__remove-time-interval"
          onClick={removeTimeInterval}
        />
      </div>
    );
  };

  render() {
    const {
      removeScheduleBoard,
    } = this.props;

    return (
      <div className="RuleScheduleBoard">
        <div className="RuleScheduleBoard__header">
          {this.renderDays()}
          <RemoveBoardButton
            className="RuleScheduleBoard__remove-shedule"
            onClick={removeScheduleBoard}
          />
        </div>
        <div className="RuleScheduleBoard__body">
          {this.renderTimeIntervalList()}
        </div>
        <AddTimeIntervalButton
          className="RuleScheduleBoard__footer"
          onClick={this.addTimeInterval}
        />
      </div>
    );
  }
}

export default RuleScheduleBoard;
