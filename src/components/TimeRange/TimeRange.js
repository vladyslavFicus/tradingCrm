import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import TimePicker from 'components/TimePicker';
import './TimeRange.scss';

class TimeRange extends PureComponent {
  static propTypes = {
    fieldsLabels: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    fieldsValues: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    error: PropTypes.string,
    onChangeFrom: PropTypes.func,
    onChangeTo: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    fieldsLabels: {},
    fieldsValues: {},
    error: '',
    className: '',
    onChangeFrom: () => {},
    onChangeTo: () => {},
  };

  render() {
    const {
      fieldsLabels,
      fieldsValues,
      error,
      onChangeFrom,
      onChangeTo,
      className,
    } = this.props;

    return (
      <div className={classNames('TimeRange', className, { 'TimeRange--with-error': !!error })}>
        <div className="TimeRange__counts">
          <TimePicker
            label={fieldsLabels.from || I18n.t('COMMON.TIME_RANGE.TIME_FROM')}
            value={fieldsValues.from}
            onChange={value => onChangeFrom(value)}
          />
          <div className="TimeRange__separator" />
          <TimePicker
            label={fieldsLabels.to || I18n.t('COMMON.TIME_RANGE.TIME_TO')}
            value={fieldsValues.to}
            onChange={value => onChangeTo(value)}
          />
          <div className="TimeRange__unit">
            ({I18n.t('COMMON.TIME_RANGE.TIME_UNIT')})
          </div>
        </div>
        <If condition={error}>
          <div className="TimeRange__error">
            <i className="TimeRange__error-icon icon icon-alert" />
            {error}
          </div>
        </If>
      </div>
    );
  }
}

export default TimeRange;
