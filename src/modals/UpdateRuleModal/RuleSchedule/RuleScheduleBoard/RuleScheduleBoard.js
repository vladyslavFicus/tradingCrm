import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
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
    checkedDays: PropTypes.object.isRequired,
    scheduleBoard: PropTypes.shape({
      days: PropTypes.object.isRequired,
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

  selectDay = (day) => {
    const {
      namePrefix,
      scheduleBoard: {
        days,
      },
      setFieldValue,
    } = this.props;

    setFieldValue(`${namePrefix}.days`, { ...days, [day]: !days[day] });
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

  renderDays = () => {
    const {
      scheduleBoard: {
        days,
      },
      checkedDays,
    } = this.props;

    return (
      <div className="RuleScheduleBoard__days">
        {weekDays.map(day => (
          <Checkbox
            key={day}
            name={day}
            label={day.slice(0, 3).toLocaleUpperCase()} // TODO
            className="RuleScheduleBoard__days-item"
            onChange={() => this.selectDay(day)}
            value={days[day]}
            disabled={!days[day] && checkedDays[day]}
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

  renderTimeInterval = ({ operatorSpreads, timeFrom, timeTo }, namePrefix, removeTimeInterval) => {
    const {
      operators,
      isSubmitting,
      setFieldValue,
    } = this.props;

    return (
      <div key={namePrefix} className="RuleScheduleBoard__time-interval">
        <RuleScheduleTimeRange
          namePrefix={namePrefix}
          timeFrom={timeFrom}
          timeTo={timeTo}
          setFieldValue={setFieldValue}
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
