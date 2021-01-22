import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
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
            label={I18n.t('RULE_MODAL.SCHEDULE.FILTERS.TIME_FROM')}
            value={timeFrom}
            onChange={value => setFieldValue(`${namePrefix}.timeFrom`, value)}
          />
          <span className="RuleScheduleTimeRange__separator" />
          <TimePicker
            label={I18n.t('RULE_MODAL.SCHEDULE.FILTERS.TIME_TO')}
            value={timeTo}
            onChange={value => setFieldValue(`${namePrefix}.timeTo`, value)}
          />
          <div className="RuleScheduleTimeRange__unit">
            ({I18n.t('RULE_MODAL.SCHEDULE.FILTERS.TIME_UNIT')})
          </div>
        </div>
        <If condition={error}>
          <div className="RuleScheduleTimeRange__error">
            <i className="RuleScheduleTimeRange__error-icon icon icon-alert" />
            {I18n.t(`RULE_MODAL.SCHEDULE.ERRORS.TIME_RANGE.${error}`)}
          </div>
        </If>
      </div>
    );
  }
}

export default RuleScheduleTimeRange;
