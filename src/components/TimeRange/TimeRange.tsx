import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import TimePicker from 'components/TimePicker';
import './TimeRange.scss';

type Field = {
  from?: string,
  to?: string,
};

type Props = {
  fieldsLabels?: Field,
  fieldsValues?: Field,
  className?: string,
  error?: string,
  onChangeFrom: (value: string) => void,
  onChangeTo: (value: string) => void,
};

const TimeRange = (props: Props) => {
  const {
    fieldsLabels,
    fieldsValues,
    error,
    onChangeFrom,
    onChangeTo,
    className,
  } = props;

  return (
    <div className={classNames('TimeRange', className, { 'TimeRange--with-error': !!error })}>
      <div className="TimeRange__counts">
        <TimePicker
          label={fieldsLabels?.from || I18n.t('COMMON.TIME_RANGE.TIME_FROM')}
          value={fieldsValues?.from}
          onChange={onChangeFrom}
        />

        <div className="TimeRange__separator" />

        <TimePicker
          label={fieldsLabels?.to || I18n.t('COMMON.TIME_RANGE.TIME_TO')}
          value={fieldsValues?.to}
          onChange={onChangeTo}
        />

        <div className="TimeRange__unit">
          ({I18n.t('COMMON.TIME_RANGE.TIME_UNIT')})
        </div>
      </div>

      <If condition={!!error}>
        <div className="TimeRange__error">
          <i className="TimeRange__error-icon icon icon-alert" />
          {error}
        </div>
      </If>
    </div>
  );
};

export default React.memo(TimeRange);
