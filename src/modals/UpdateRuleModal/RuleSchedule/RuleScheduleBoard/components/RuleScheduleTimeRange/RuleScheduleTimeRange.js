import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'components/TimePicker';
import './RuleScheduleTimeRange.scss';

class RuleScheduleTimeRange extends PureComponent {
  static propTypes = {
    namePrefix: PropTypes.string.isRequired,
    timeFrom: PropTypes.string,
    timeTo: PropTypes.string,
    error: PropTypes.string,
    setFieldValue: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeFrom: '',
    timeTo: '',
    error: '',
  };

  render() {
    const {
      namePrefix,
      timeFrom,
      timeTo,
      error,
      setFieldValue,
    } = this.props;

    return (
      <div className="RuleScheduleTimeRange">
        <div className="RuleScheduleTimeRange__counts">
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
          <div className="RuleScheduleTimeRange__unit">
            (UTC time)
          </div>
        </div>
        <If condition={error}>
          <div className="RuleScheduleTimeRange__error">
            <i className="RuleScheduleTimeRange__error-icon icon icon-alert" />{error}
          </div>
        </If>
      </div>
    );
  }
}

export default RuleScheduleTimeRange;
