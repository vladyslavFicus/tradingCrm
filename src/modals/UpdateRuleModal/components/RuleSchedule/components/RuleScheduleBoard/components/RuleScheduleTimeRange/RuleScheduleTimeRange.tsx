import React from 'react';
import I18n from 'i18n-js';
import TimePicker from 'components/TimePicker';
import './RuleScheduleTimeRange.scss';

type Props = {
  namePrefix: string,
  timeFrom: string,
  timeTo: string,
  error?: string,
  setFieldValue: (name: string, value: string) => void,
};

const RuleScheduleTimeRange = (props: Props) => {
  const {
    namePrefix,
    timeFrom,
    timeTo,
    error,
    setFieldValue,
  } = props;

  // ===== Handlers ===== //
  const handleSetFullDay = () => {
    setFieldValue(`${namePrefix}.timeFrom`, '00:00');
    setFieldValue(`${namePrefix}.timeTo`, '23:59');
  };

  return (
    <div className="RuleScheduleTimeRange">
      <div className="RuleScheduleTimeRange__counts">
        <TimePicker
          label={I18n.t('RULE_MODAL.SCHEDULE.FILTERS.TIME_FROM')}
          value={timeFrom}
          onChange={(value: string) => setFieldValue(`${namePrefix}.timeFrom`, value)}
        />

        <span className="RuleScheduleTimeRange__separator" />

        <TimePicker
          label={I18n.t('RULE_MODAL.SCHEDULE.FILTERS.TIME_TO')}
          value={timeTo}
          onChange={(value: string) => setFieldValue(`${namePrefix}.timeTo`, value)}
        />

        <div className="RuleScheduleTimeRange__unit">
          ({I18n.t('RULE_MODAL.SCHEDULE.FILTERS.TIME_UNIT')})

          <span
            className="RuleScheduleTimeRange__full-day"
            onClick={handleSetFullDay}
          >
            {I18n.t('RULE_MODAL.SCHEDULE.FILTERS.SET_FULL_DAY')}
          </span>
        </div>
      </div>

      <If condition={!!error}>
        <div className="RuleScheduleTimeRange__error">
          <i className="RuleScheduleTimeRange__error-icon icon icon-alert" />

          {I18n.t(`RULE_MODAL.SCHEDULE.ERRORS.TIME_RANGE.${error}`)}
        </div>
      </If>
    </div>
  );
};

export default RuleScheduleTimeRange;
