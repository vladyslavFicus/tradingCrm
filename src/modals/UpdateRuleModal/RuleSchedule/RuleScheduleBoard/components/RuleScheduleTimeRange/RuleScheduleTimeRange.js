import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'components/TimePicker';
import { validate } from './utils';
import './RuleScheduleTimeRange.scss';

class RuleScheduleTimeRange extends PureComponent {
  static propTypes = {
    namePrefix: PropTypes.string.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    timeFrom: PropTypes.string,
    timeTo: PropTypes.string,
  };

  static defaultProps = {
    timeFrom: '',
    timeTo: '',
  };

  render() {
    const {
      namePrefix,
      timeFrom,
      timeTo,
      setFieldValue,
    } = this.props;

    const error = validate(timeFrom, timeTo);
    console.log(error);

    return (
      <div className="RuleScheduleTimeRange">
        <TimePicker
          label="Time from"
          value={timeFrom}
          onChange={value => setFieldValue(`${namePrefix}.timeFrom`, value)}
        />
        <span className="RuleScheduleTimeRange__separator" />
        <TimePicker
          label="Time to"
          value={timeTo}
          onChange={value => setFieldValue(`${namePrefix}.timeTo`, value)}
        />
      </div>
    );
  }
}

export default RuleScheduleTimeRange;
