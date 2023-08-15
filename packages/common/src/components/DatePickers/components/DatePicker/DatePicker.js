import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import momentPropTypes from 'react-moment-proptypes';
import { isEqual } from 'lodash';
import { v4 } from 'uuid';
import { Button } from '../../../Buttons';
import DateCalendarPicker from '../DateCalendarPicker';
import DateTimePicker from '../DateTimePicker';
import {
  DATE_USER_STRING_FORMAT,
  DATE_BASE_FORMAT,
  DATE_TIME_USER_STRING_FORMAT,
  DATE_TIME_BASE_FORMAT,
  DATE_TIME_OLD_BASE_FORMAT,
} from '../../../../constants';
import './DatePicker.scss';

class DatePicker extends PureComponent {
  static propTypes = {
    anchorDirection: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    closeOnSelect: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    label: PropTypes.string,
    maxDate: momentPropTypes.momentObj,
    maxTime: PropTypes.string,
    minDate: momentPropTypes.momentObj,
    minTime: PropTypes.string,
    placeholder: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    showErrorMessage: PropTypes.bool,
    value: PropTypes.string,
    withConfirmation: PropTypes.bool,
    withFocus: PropTypes.bool,
    withTime: PropTypes.bool,
    withUtc: PropTypes.bool,
  };

  static defaultProps = {
    anchorDirection: 'left',
    className: null,
    closeOnSelect: false,
    disabled: false,
    error: null,
    label: null,
    maxDate: null,
    maxTime: null,
    minDate: null,
    minTime: null,
    placeholder: I18n.t('DATE_PICKER.DATE'),
    showErrorMessage: true,
    value: undefined,
    withConfirmation: false,
    withFocus: false,
    withTime: false,
    withUtc: false,
  };

  id = `datepicker-${v4()}`;

  state = {
    selectedDate: undefined,
    showPopup: false,
  }

  componentDidMount() {
    this.setInitialState();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
      this.setInitialState();
    }
  }

  /**
   *
   * Get initial 'selectedDate' from 'props' and convert it to readable format
   *
  */
  setInitialState = () => {
    const { value } = this.props;

    const newState = {
      ...this.state,
      selectedDate: this.formatDateToInputString(value),
    };

    // # don't need to update state if current state is already initial
    if (!isEqual(this.state, newState)) {
      this.setState(newState);
    }
  }

  /**
   *
   * Convert date like '02.12.2020 13:00' or '02.12.2020' to moment object
   *
  */
  getValidMomentDate = (date) => {
    const { withTime } = this.props;

    const momentFormat = withTime ? DATE_TIME_USER_STRING_FORMAT : DATE_USER_STRING_FORMAT;

    const momentDate = moment(date, momentFormat);

    return momentDate.isValid() && date === momentDate.format(momentFormat)
      ? momentDate
      : null;
  }

  /**
   *
   * Convert date to userFriendly date-string like '02.12.2020 13:00' || '02.12.2020'
   * or return provided date if it is invalid
   *
   * @param date | String or MomentObject
   *
  */
  formatDateToInputString = (date) => {
    const { withUtc, withTime } = this.props;

    const momentUserFormat = withTime ? DATE_TIME_USER_STRING_FORMAT : DATE_USER_STRING_FORMAT;
    const momentBaseFormat = withTime ? DATE_TIME_BASE_FORMAT : DATE_BASE_FORMAT;
    const momentOldBaseFormat = withTime ? DATE_TIME_OLD_BASE_FORMAT : DATE_BASE_FORMAT;

    // # if user change date using calendar or time picker
    // # the function will get MomentObject as value
    if (moment.isMoment(date)) {
      return date.format(momentUserFormat);
    }

    // Remove millisecond 2021-01-28T21:45:00.675 to 2021-01-28T21:45:00
    const _date = date && new Date(date).getMilliseconds() ? date.split('.')[0] : date;

    // # valid input date format must have 'YYYY-MM-DDTHH:mm:ss[Z]', 'YYYY-MM-DDTHH:mm:ss' or 'YYYY-MM-DD'
    // # if date is valid return userfriendly string in DATE_TIME_USER_STRING_FORMAT
    // or DATE_USER_STRING_FORMAT if time is not expected
    const momentDateInBaseFormat = moment(_date, momentBaseFormat);

    if (
      momentDateInBaseFormat.isValid()
      && (
        _date === momentDateInBaseFormat.format(momentBaseFormat)
        || _date === momentDateInBaseFormat.format(momentOldBaseFormat)
      )
    ) {
      if (!withTime) {
        return momentDateInBaseFormat.format(momentUserFormat);
      }

      return withUtc
        ? moment.utc(_date, momentBaseFormat).local().format(momentUserFormat)
        : momentDateInBaseFormat.local().format(momentUserFormat);
    }

    // # if date is invalid by dateFormat and date is not MomentObject
    // # return provided value
    return _date;
  }

  /**
   *
   * Convert date to backend date format
   *
   * @param date | String
   *
  */
  getOutputDate = (date) => {
    const { withUtc, withTime } = this.props;

    const momentDate = this.getValidMomentDate(date);

    // # If date is valid, convert date to 'YYYY-MM-DDTHH:mm:ss[Z]' or 'YYYY-MM-DD' if time is not expected
    if (momentDate) {
      if (!withTime) {
        return momentDate.format(DATE_BASE_FORMAT);
      }

      return withUtc
        ? momentDate.utc().format(DATE_TIME_BASE_FORMAT)
        : momentDate.format(DATE_TIME_BASE_FORMAT);
    }

    // # If date is not valid return provided value
    return date;
  }

  handleShowPopup = (bool = true) => {
    const { disabled } = this.props;

    this.setState({ showPopup: !disabled && bool });
  }

  /**
   *
   * Method used by "onClickOutside" library to close popup
   *
  */
  handleClickOutside = () => (
    this.props.withConfirmation
      ? this.setInitialState()
      : this.handleShowPopup(false)
  );

  /**
   *
   * Date changing event by typing in input
   *
   * @param event
   *
   * */
  handleInputDateChange = (event) => {
    const { value } = event.target;

    this.handleChange({ selectedDate: value });
  }

  /**
   *
   * Calendar day click event
   *
   * @param value | momentObject
   *
   * */
  handleCalendarDayClick = (value) => {
    const { closeOnSelect, withTime } = this.props;

    this.handleChange({
      selectedDate: this.formatDateToInputString(
        withTime ? moment(value).set({ hour: 0, minute: 0, second: 0 }) : value,
      ),
      showPopup: !closeOnSelect,
    });
  }

  /**
   *
   * Time changing event
   *
   * @param value | momentObject: updated date with new time
   *
   * */
  handleTimeChange = (value) => {
    this.handleChange({
      selectedDate: this.formatDateToInputString(value),
    });
  }

  handleChange = (stateChanges, isConfirm) => {
    const {
      disabled,
      setValue,
      withConfirmation,
    } = this.props;

    if (disabled) return;

    const newState = {
      ...this.state,
      ...stateChanges,
    };

    // # If user must submit changes, all the data will be provided on apply event
    // # Otherwise provide data each time on date change
    if (!withConfirmation || (withConfirmation && isConfirm)) {
      const { selectedDate } = newState;

      setValue(this.getOutputDate(selectedDate));
    }

    this.setState(newState);
  }

  handleCancel = () => {
    this.setInitialState();
    this.handleShowPopup(false);
  }

  handleApply = () => {
    this.handleChange({ showPopup: false }, true);
  }

  render() {
    const {
      anchorDirection,
      className,
      disabled,
      error,
      label,
      maxDate,
      maxTime,
      minDate,
      minTime,
      placeholder,
      showErrorMessage,
      withConfirmation,
      withFocus,
      withTime,
    } = this.props;

    const {
      selectedDate,
      showPopup,
    } = this.state;

    const momentDate = this.getValidMomentDate(selectedDate);

    return (
      <div className={classNames('DatePicker', className)}>
        <If condition={label}>
          <label className="DatePicker__label" htmlFor={this.id}>{label}</label>
        </If>

        <div className="DatePicker__input-container">
          <div
            className={classNames('DatePicker__input', {
              'DatePicker__input--in-focus': withFocus,
              'DatePicker__input--has-error': error && showErrorMessage,
              'DatePicker__input--is-disable': disabled,
            })}
            onClick={this.handleShowPopup}
          >
            <div className="DatePicker__input-left">
              <input
                type="text"
                id={this.id}
                placeholder={placeholder}
                onChange={this.handleInputDateChange}
                value={selectedDate || ''}
                disabled={disabled}
              />
            </div>

            <div className="DatePicker__input-right">
              <i className="DatePicker__input-calendar icon icon-calendar" />
            </div>
          </div>

          <If condition={showPopup}>
            <div
              className={classNames('DatePicker__popup', {
                'DatePicker__popup--anchor-right': anchorDirection === 'right',
              })}
            >
              <DateCalendarPicker
                selectedDate={momentDate}
                handleCalendarDayClick={this.handleCalendarDayClick}
                minDate={minDate}
                maxDate={maxDate}
              />

              <If condition={withTime || withConfirmation}>
                <div className="DatePicker__popup-footer">
                  <If condition={withTime}>
                    <div className="DatePicker__popup-time">
                      <DateTimePicker
                        labelPrefix={I18n.t('DATE_PICKER.TIME_FOR')}
                        selectedDate={momentDate}
                        handleTimeChange={this.handleTimeChange}
                        minTime={minTime}
                        maxTime={maxTime}
                      />
                    </div>
                  </If>

                  <div className="DatePicker__popup-buttons">
                    <If condition={withConfirmation}>
                      <Button
                        tertiary
                        className="DatePicker__popup-button"
                        onClick={this.handleCancel}
                      >
                        {I18n.t('COMMON.CANCEL')}
                      </Button>
                    </If>

                    <Button
                      primary
                      className="DatePicker__popup-button"
                      onClick={this.handleApply}
                    >
                      {I18n.t('COMMON.APPLY')}
                    </Button>
                  </div>
                </div>
              </If>
            </div>
          </If>
        </div>

        <If condition={error && showErrorMessage}>
          <div className="DatePicker__input-error">
            <i className="DatePicker__input-error-icon icon-alert" />
            {error}
          </div>
        </If>
      </div>
    );
  }
}

export default onClickOutside(DatePicker);
