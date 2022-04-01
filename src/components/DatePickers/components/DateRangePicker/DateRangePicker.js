import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import momentPropTypes from 'react-moment-proptypes';
import { isEqual } from 'lodash';
import { Button } from 'components/UI';
import DateCalendarPicker from '../DateCalendarPicker';
import DateTimePicker from '../DateTimePicker';
import DatePickerAdditional from '../DatePickerAdditional';
import {
  DATE_TIME_USER_STRING_FORMAT,
  DATE_TIME_BASE_FORMAT,
  DATE_TIME_OLD_BASE_FORMAT,
  defaultAdditionalOptions,
} from '../../constants';
import './DateRangePicker.scss';

class DateRangePicker extends PureComponent {
  static propTypes = {
    additionalValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    additionalOptions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    })),
    additionalValues: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    })),
    className: PropTypes.string,
    dateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    error: PropTypes.string,
    label: PropTypes.string,
    maxDate: momentPropTypes.momentObj,
    maxTime: PropTypes.string,
    minDate: momentPropTypes.momentObj,
    minTime: PropTypes.string,
    setValues: PropTypes.func.isRequired,
    showErrorMessage: PropTypes.bool,
    withAdditionalOptions: PropTypes.bool,
    withAdditionalValues: PropTypes.bool,
    withConfirmation: PropTypes.bool,
    withFocus: PropTypes.bool,
    withTime: PropTypes.bool,
    withUtc: PropTypes.bool,
  };

  static defaultProps = {
    additionalValue: undefined,
    additionalValues: null,
    additionalOptions: [],
    className: null,
    dateRange: undefined,
    disabled: false,
    error: null,
    label: null,
    maxDate: null,
    maxTime: null,
    minDate: null,
    minTime: null,
    showErrorMessage: true,
    withAdditionalOptions: true,
    withAdditionalValues: false,
    withConfirmation: false,
    withFocus: false,
    withTime: true,
    withUtc: true,
  };

  popupRef = React.createRef();

  state = {
    dateKeyToSelect: 'from', // # used for detecting which date range point is selecting
    selectedAdditional: undefined,
    selectedDateRange: undefined,
    showPopup: false,
    anchorDirection: 'left',
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props, prevProps)) {
      this.setInitialState();
    }

    // Auto detect anchor direction depends on screen width
    if (this.state.showPopup && !prevState.showPopup) {
      const { left, right } = this.popupRef.current.getBoundingClientRect();

      if (left < 0) {
        this.setState({ anchorDirection: 'left' }); // eslint-disable-line
      }

      if (right > window.innerWidth) {
        this.setState({ anchorDirection: 'right' }); // eslint-disable-line
      }
    }
  }

  /**
   *
   * Get initial 'selectedDateRange' from 'props' and convert it to readable format
   * or if get additionalValue and make selected additional option with the same value
   *
  */
  setInitialState = () => {
    const {
      dateRange,
      additionalValue,
      additionalValues,
      withAdditionalValues,
    } = this.props;

    const selectedAdditional = withAdditionalValues && additionalValue
      ? additionalValues?.filter(({ value }) => value === additionalValue)[0]
      : null;

    const newState = {
      ...this.state,
      selectedAdditional,
      selectedDateRange: {
        from: this.formatDateToInputString(dateRange?.from),
        to: this.formatDateToInputString(dateRange?.to),
      },
    };

    // # don't need to update state if current state is already initial
    if (!isEqual(this.state, newState)) {
      this.setState(newState);
    }
  }

  /**
   *
   * Convert date like '02.12.2020 13:00' to moment object
   *
  */
  getValidMomentDate = (date) => {
    const momentDate = moment(date, DATE_TIME_USER_STRING_FORMAT);

    return momentDate.isValid() && date === momentDate.format(DATE_TIME_USER_STRING_FORMAT)
      ? momentDate
      : null;
  }

  /**
   *
   * Convert date to userFriendly date-string like '02.12.2020 13:00'
   * or return provided date if it is invalid
   *
   * @param date | String or MomentObject
   *
  */
  formatDateToInputString = (date) => {
    const { withUtc } = this.props;

    // # if user change date using calendar, time picker or default additionalOptions
    // # the function will get MomentObject as value
    if (moment.isMoment(date)) {
      return date.format(DATE_TIME_USER_STRING_FORMAT);
    }

    // # valid input date format must have 'YYYY-MM-DDTHH:mm:ss[Z]' or 'YYYY-MM-DDTHH:mm:ss'
    // # if date is valid return userfriendly string in DATE_TIME_USER_STRING_FORMAT
    const momentDateInBaseFormat = moment(date, DATE_TIME_BASE_FORMAT);

    if (
      momentDateInBaseFormat.isValid()
      && (
        date === momentDateInBaseFormat.format(DATE_TIME_BASE_FORMAT)
        || date === momentDateInBaseFormat.format(DATE_TIME_OLD_BASE_FORMAT)
      )
    ) {
      return withUtc
        ? moment.utc(date, DATE_TIME_BASE_FORMAT).local().format(DATE_TIME_USER_STRING_FORMAT)
        : momentDateInBaseFormat.local().format(DATE_TIME_USER_STRING_FORMAT);
    }

    // # if date is invalid by dateFormat and date is not MomentObject
    // # return provided value
    return date;
  }

  /**
   *
   * Convert date to backend date format
   *
   * @param date | String
   *
  */
  getOutputDate = (date) => {
    const { withUtc } = this.props;

    const momentDate = this.getValidMomentDate(date);

    // # If date is valid, convert date to 'YYYY-MM-DDTHH:mm:ss[Z]'
    if (momentDate) {
      return withUtc
        ? momentDate.utc().format(DATE_TIME_BASE_FORMAT)
        : momentDate.local().format(DATE_TIME_BASE_FORMAT);
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
   * @param key | String one of ['from', 'to']
   *
   * */
  handleInputDateChange = (event, key) => {
    const { selectedDateRange } = this.state;
    const { value } = event.target;

    this.handleChange({
      selectedDateRange: {
        ...selectedDateRange,
        [key]: value,
      },
    });
  }

  /**
   *
   * Calendar day click event
   *
   * @param value | momentObject
   *
   * */
  handleCalendarDayClick = (value) => {
    const { dateKeyToSelect, selectedDateRange } = this.state;

    const momentFrom = this.getValidMomentDate(selectedDateRange?.from);
    const momentTo = this.getValidMomentDate(selectedDateRange?.to);

    const setValuesAndNextKey = (nextKeyToSelect, fromDate, toDate) => {
      this.handleChange({
        dateKeyToSelect: nextKeyToSelect,
        selectedAdditional: null,
        selectedDateRange: {
          from: this.formatDateToInputString(fromDate),
          to: this.formatDateToInputString(toDate),
        },
      });
    };

    // # if user choose one of selected dates, each points get the same value
    // # to make just one date selected with different time range
    if (value.isSame(momentFrom) || value.isSame(momentTo)) {
      setValuesAndNextKey(
        'from',
        moment(value).set({ hour: 0, minute: 0, second: 0 }),
        moment(value).set({ hour: 23, minute: 59, second: 59 }),
      );

      return;
    }

    // # if user choose date out of range to 'dateKeyToSelect', change 'from' and reset 'to'
    if (
      (dateKeyToSelect === 'from' && value.isAfter(momentTo))
      || (dateKeyToSelect === 'to' && value.isBefore(momentFrom))
    ) {
      setValuesAndNextKey(
        'to',
        moment(value).set({ hour: 0, minute: 0, second: 0 }),
        null,
      );

      return;
    }

    // # if user must choose 'from' value and 'from' < 'to' set new value to 'from' and switch next turn to 'to'
    // # if user must choose 'to' value and 'to' > 'from' set new value to 'to' and switch next turn to 'from'
    if (dateKeyToSelect === 'from') {
      setValuesAndNextKey(
        'to',
        moment(value).set({ hour: 0, minute: 0, second: 0 }),
        momentTo,
      );
    } else {
      setValuesAndNextKey(
        'from',
        momentFrom,
        moment(value).set({ hour: 23, minute: 59, second: 59 }),
      );
    }
  }

  /**
   *
   * Time changing event
   *
   * @param key | one of ['from', 'to']
   * @param value | momentObject: updated date with new time
   *
   * */
  handleTimeChange = (key, value) => {
    const { selectedDateRange } = this.state;

    this.handleChange({
      selectedDateRange: {
        ...selectedDateRange,
        [key]: this.formatDateToInputString(value),
      },
    });
  }

  /**
   *
   * Choose additional option event
   *
   * @param option
   * @param isAdditionalOption
   *
   * option = {
   *  label: String,
   *  value: Object of momentObjects || Number if option has hours as value
   * }
   *
   * isAdditionalOption - flag that tells us "Selected option is a calendar tool"
   *
   * If component must provide additionalValue
   * then reset selectedDateRange and set new selectedAdditional
   * Otherwise set new selectedAdditional and selectedDateRange (if option contains valid date)
   *
  */
  handleAdditionalClick = (option, isAdditionalOption) => {
    this.handleChange({
      selectedAdditional: isAdditionalOption ? null : option,
      selectedDateRange: {
        from: isAdditionalOption ? this.formatDateToInputString(option?.value?.from) : null,
        to: isAdditionalOption ? this.formatDateToInputString(option?.value?.to) : null,
      },
    });
  }

  handleChange = (stateChanges, isConfirm) => {
    const {
      disabled,
      setValues,
      withAdditionalValues,
      withConfirmation,
    } = this.props;

    if (disabled) return;

    const newState = {
      ...this.state,
      ...stateChanges,
    };

    this.setState(newState);

    // # If user must submit changes, all the data will be provided on apply event
    // # Otherwise provide data each time on date change
    if (!withConfirmation || (withConfirmation && isConfirm)) {
      const { selectedDateRange, selectedAdditional } = newState;

      setValues({
        from: this.getOutputDate(selectedDateRange?.from),
        to: this.getOutputDate(selectedDateRange?.to),
        additional: withAdditionalValues ? selectedAdditional?.value : undefined,
      });
    }
  }

  handleCancel = () => {
    this.setInitialState();
    this.handleShowPopup(false);
  }

  handleApply = () => {
    const { withConfirmation } = this.props;

    if (withConfirmation) {
      this.handleChange({ showPopup: false }, true);
    } else {
      this.handleShowPopup(false);
    }
  }

  render() {
    const {
      additionalOptions,
      additionalValues,
      className,
      disabled,
      error,
      label,
      maxDate,
      maxTime,
      minDate,
      minTime,
      showErrorMessage,
      withAdditionalOptions,
      withAdditionalValues,
      withConfirmation,
      withFocus,
      withTime,
      dateRange,
    } = this.props;

    const {
      dateKeyToSelect,
      selectedAdditional,
      selectedDateRange,
      showPopup,
      anchorDirection,
    } = this.state;

    const momentFrom = this.getValidMomentDate(selectedDateRange?.from);
    const momentTo = this.getValidMomentDate(selectedDateRange?.to);

    const withAdditional = (withAdditionalOptions && additionalOptions) || (withAdditionalValues && additionalValues);

    return (
      <div className={classNames('DateRangePicker', className)}>
        <If condition={label}>
          <div className="DateRangePicker__label">{label}</div>
        </If>

        <div>
          <div
            className={classNames('DateRangePicker__input', {
              'DateRangePicker__input--in-focus': withFocus,
              'DateRangePicker__input--has-error': error && showErrorMessage,
              'DateRangePicker__input--is-disable': disabled,
            })}
            onClick={this.handleShowPopup}
          >
            <div className="DateRangePicker__input-left">
              <Choose>
                <When condition={withAdditionalValues && selectedAdditional}>
                  <div className="DateRangePicker__input-additional-value">
                    {I18n.t(selectedAdditional.label)}
                  </div>
                </When>

                <Otherwise>
                  <div
                    className={classNames('DateRangePicker__input-date', {
                      'DateRangePicker__input-date--in-focus': dateKeyToSelect === 'from' && showPopup,
                    })}
                  >
                    <input
                      type="text"
                      placeholder={I18n.t('DATE_PICKER.START_DATE')}
                      onClick={() => this.setState({ dateKeyToSelect: 'from' })}
                      onChange={event => this.handleInputDateChange(event, 'from')}
                      value={selectedDateRange?.from || ''}
                      disabled={disabled}
                    />
                  </div>

                  <div className="DateRangePicker__input-devider">-</div>

                  <div
                    className={classNames('DateRangePicker__input-date', {
                      'DateRangePicker__input-date--in-focus': dateKeyToSelect === 'to' && showPopup,
                    })}
                  >
                    <input
                      type="text"
                      placeholder={I18n.t('DATE_PICKER.END_DATE')}
                      onClick={() => this.setState({ dateKeyToSelect: 'to' })}
                      onChange={event => this.handleInputDateChange(event, 'to')}
                      value={selectedDateRange?.to || ''}
                      disabled={disabled}
                    />
                  </div>
                </Otherwise>
              </Choose>
            </div>

            <div className="DateRangePicker__input-right">
              <i className="DateRangePicker__input-calendar icon icon-calendar" />
            </div>

            <If condition={error && showErrorMessage}>
              <div className="DateRangePicker__input-error">
                <i className="DateRangePicker__input-error-icon icon-alert" />
                {error}
              </div>
            </If>
          </div>

          <If condition={showPopup}>
            <div
              ref={this.popupRef}
              className={classNames('DateRangePicker__popup', {
                'DateRangePicker__popup--with-additional': withAdditional,
                'DateRangePicker__popup--anchor-right': anchorDirection === 'right',
              })}
            >
              <div className="DateRangePicker__popup-column">
                <DateCalendarPicker
                  selectedDateRange={{
                    from: momentFrom,
                    to: momentTo,
                  }}
                  handleCalendarDayClick={this.handleCalendarDayClick}
                  minDate={minDate}
                  maxDate={maxDate}
                />

                <If condition={withTime}>
                  <div className="DateRangePicker__popup-times">
                    <DateTimePicker
                      labelPrefix={I18n.t('DATE_PICKER.FROM')}
                      selectedDate={momentFrom}
                      handleTimeChange={value => this.handleTimeChange('from', value)}
                      minTime={minTime}
                      maxTime={momentTo ? momentTo.format('HH:mm') : maxTime}
                    />

                    <DateTimePicker
                      labelPrefix={I18n.t('DATE_PICKER.TO')}
                      selectedDate={momentTo}
                      handleTimeChange={value => this.handleTimeChange('to', value)}
                      minTime={momentFrom ? momentFrom.format('HH:mm') : minTime}
                      maxTime={maxTime}
                    />
                  </div>
                </If>
              </div>

              <div className="DateRangePicker__popup-column">
                <If condition={withAdditional}>
                  <DatePickerAdditional
                    additionalOptions={[...defaultAdditionalOptions(), ...additionalOptions]}
                    additionalValues={additionalValues}
                    selectedAdditional={selectedAdditional}
                    selectedDateRange={dateRange}
                    handleAdditionalClick={this.handleAdditionalClick}
                    withAdditionalOptions={withAdditionalOptions}
                    withAdditionalValues={withAdditionalValues}
                  />
                </If>

                <div className="DateRangePicker__popup-buttons">
                  <If condition={withConfirmation}>
                    <Button
                      commonOutline
                      className="DateRangePicker__popup-button"
                      onClick={this.handleCancel}
                    >
                      {I18n.t('COMMON.CANCEL')}
                    </Button>
                  </If>

                  <Button
                    primary
                    className="DateRangePicker__popup-button"
                    onClick={this.handleApply}
                  >
                    {I18n.t('COMMON.APPLY')}
                  </Button>
                </div>
              </div>
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default onClickOutside(DateRangePicker);
