import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'components/Checkbox';
import './RuleScheduleWeek.scss';

class RuleScheduleWeek extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    checkedDays: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  };

  handleChange = (day) => {
    const {
      value,
      setFieldValue,
    } = this.props;

    setFieldValue({ ...value, [day]: !value[day] });
  };

  render() {
    const {
      value,
      checkedDays,
    } = this.props;

    return (
      <div className="RuleScheduleWeek">
        {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
          <Checkbox
            key={day}
            name={day}
            label={day.toLocaleUpperCase()}
            className="RuleScheduleWeek__day"
            vertical
            onChange={() => this.handleChange(day)}
            value={value[day]}
            disabled={!value[day] && checkedDays[day]}
          />
        ))}
      </div>
    );
  }
}

export default RuleScheduleWeek;
