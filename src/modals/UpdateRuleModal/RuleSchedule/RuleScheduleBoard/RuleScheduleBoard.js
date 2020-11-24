import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'formik';
import Checkbox from 'components/Checkbox';
import RuleOperatorSpreads from 'components/RuleOperatorSpreads';
import RemoveBoardButton from './components/RemoveBoardButton';
import AddTimeIntervalButton from './components/AddTimeIntervalButton';
import RemoveTimeIntervalButton from './components/RemoveTimeIntervalButton';
import RuleScheduleTimeRange from './components/RuleScheduleTimeRange';
import './RuleScheduleBoard.scss';

class RuleScheduleBoard extends PureComponent {
  static propTypes = {
    operators: PropTypes.array.isRequired,
    namePrefix: PropTypes.string.isRequired,
    checkedDays: PropTypes.object.isRequired,
    scheduleBoard: PropTypes.shape({
      week: PropTypes.object.isRequired,
      timeInterval: PropTypes.arrayOf(
        PropTypes.shape({
          operatorSpreads: PropTypes.array,
          timeFrom: PropTypes.string,
          timeTo: PropTypes.string,
        }),
      ),
    }).isRequired,
    removeScheduleBoard: PropTypes.func,
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    removeScheduleBoard: null,
  };

  changeWeekDay = (day) => {
    const {
      namePrefix,
      scheduleBoard: {
        week,
      },
      setFieldValue,
    } = this.props;

    setFieldValue(`${namePrefix}.week`, { ...week, [day]: !week[day] });
  };

  addTimeInterval = () => {
    const {
      namePrefix,
      scheduleBoard: {
        timeInterval,
      },
      setFieldValue,
    } = this.props;

    setFieldValue(
      `${namePrefix}.timeInterval`,
      [...timeInterval, { operatorSpreads: [], timeFrom: '00:00', timeTo: '00:00' }],
    );
  };

  removeOperatorSpread = (name, index) => {
    const {
      scheduleBoard: {
        timeInterval,
      },
      setFieldValue,
    } = this.props;

    const operatorSpreads = [...timeInterval.operatorSpreads];
    operatorSpreads.splice(index, 1);

    setFieldValue(name, operatorSpreads);
  };

  renderWeek = () => {
    const {
      scheduleBoard: {
        week,
      },
      checkedDays,
    } = this.props;

    return (
      <div className="RuleScheduleBoard__week">
        {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
          <Checkbox
            key={day}
            name={day}
            label={day.toLocaleUpperCase()}
            className="RuleScheduleBoard__week-day"
            onChange={() => this.changeWeekDay(day)}
            value={week[day]}
            disabled={!week[day] && checkedDays[day]}
            vertical
          />
        ))}
      </div>
    );
  };

  renderTimeIntervalList = () => {
    const {
      namePrefix,
      scheduleBoard: {
        timeInterval,
      },
    } = this.props;

    return (
      <FieldArray
        name={`${namePrefix}.timeInterval`}
        render={({ remove }) => (
          <Fragment>
            {timeInterval.map((value, index) => this.renderTimeInterval(
              value,
              `${namePrefix}.timeInterval[${index}]`,
              timeInterval[1] ? () => remove(index) : null,
            ))}
          </Fragment>
        )}
      />
    );
  };

  renderTimeInterval = ({ operatorSpreads }, namePrefix, removeTimeInterval) => {
    const {
      operators,
      isSubmitting,
    } = this.props;

    return (
      <div key={namePrefix} className="RuleScheduleBoard__time-interval">
        <RuleScheduleTimeRange
          namePrefix={namePrefix}
        />
        <RuleOperatorSpreads
          operators={operators}
          operatorSpreads={operatorSpreads}
          removeOperatorSpread={index => this.removeOperatorSpread(`${namePrefix}.operatorSpreads`, index)}
          namePrefix={`${namePrefix}.operatorSpreads`}
          disabled={isSubmitting}
          isValid // TODO
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
          {this.renderWeek()}
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
