import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'newage-react-datetime-improved';
import './DatePicker.scss';

const ISO_FORMAT_DATE = 'YYYY-MM-DD';
const ISO_FORMAT_TIME = 'HH:mm:ss';

class DatePicker extends Component {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      touched: PropTypes.bool,
      error: PropTypes.string,
      setValue: PropTypes.func,
    }).isRequired,
    isValidDate: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    pickerClassName: PropTypes.string,
    isDateRangeEndValue: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    utc: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
    withTime: PropTypes.bool,
    timePresets: PropTypes.bool,
    helpText: PropTypes.node,
  };

  static defaultProps = {
    id: null,
    label: null,
    className: null,
    pickerClassName: '',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    position: 'vertical',
    isValidDate: () => true,
    utc: false,
    disabled: false,
    placeholder: '',
    showErrorMessage: true,
    closeOnSelect: true,
    withTime: false,
    timePresets: false,
    isDateRangeEndValue: false,
    helpText: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { dateFormat, timeFormat } = nextProps;
    const { format: prevFormat } = prevState;

    const format = [dateFormat, timeFormat].join(' ').trim();

    if (format !== prevFormat) {
      const ISOFormat = [
        dateFormat ? ISO_FORMAT_DATE : null,
        timeFormat ? ISO_FORMAT_TIME : null,
      ].join('T').trim();

      return {
        format,
        ISOFormat,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    const format = [props.dateFormat, props.timeFormat].join(' ').trim();
    const ISOFormat = [
      props.dateFormat ? ISO_FORMAT_DATE : null,
      props.timeFormat ? ISO_FORMAT_TIME : null,
    ].filter(v => v).join('T').trim();
    this.state = {
      format,
      ISOFormat,
    };
  }

  getValue = () => {
    const { field: { value }, utc } = this.props;

    if (this.shouldFormatValue(value)) {
      return (utc ? moment.utc(value).local() : moment(value)).format(this.state.format);
    }

    return value;
  };

  shouldFormatValue = (value) => {
    const { ISOFormat } = this.state;

    return value && value.length === ISOFormat.length && moment(value, ISOFormat).isValid();
  };

  handleChange = (newValue) => {
    const {
      field: { value, setValue },
      utc,
      isDateRangeEndValue,
    } = this.props;
    const isCurrentValueValid = moment(value, this.state.ISOFormat, true).isValid() || value === '';
    let formatValue = newValue;
    if (newValue._isAMomentObject) {
      if (isDateRangeEndValue && isCurrentValueValid) {
        // if it's an end field in date range
        const currentValue = utc ? moment.utc(value).local() : moment(value);
        const diff = (value === '') ? 1 : Math.abs(currentValue.diff(newValue, 'days'));
        if (diff >= 1) {
          // if clicks on a day select, set time to 23.59
          newValue.set({ hour: 23, minute: 59 });
        }
      }
      const momentDate = utc ? moment.utc(newValue) : newValue;
      formatValue = momentDate.format(this.state.ISOFormat);
    }

    setValue(formatValue);

    this.handleInputFieldFocus();
  };

  handleInputFieldFocus = (recalculatePickerPosition = false) => {
    if (this.inputNode) {
      this.inputNode.focus();

      if (recalculatePickerPosition) {
        this.recalculatePickerPosition();
      }
    }
  };

  /**
   * Should be executed on next event loop tick when picker will already rendered
   *
   * @return {number}
   */
  recalculatePickerPosition = () => setTimeout(() => {
    const pickerDOM = this._ref.componentNode.querySelector('.rdtPicker');

    const pickerBoundingClientReact = pickerDOM.getBoundingClientRect();

    if (pickerBoundingClientReact.left < 0) {
      pickerDOM.style.left = '0px';
    }
  }, 0);

  renderInput = () => {
    const {
      id,
      disabled,
      placeholder,
      pickerClassName,
      isValidDate,
      dateFormat,
      timeFormat,
      timePresets,
      closeOnSelect,
      withTime,
    } = this.props;

    return (
      <div className="input-group">
        <DateTime
          ref={(ref) => { this._ref = ref; }}
          className={pickerClassName}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          onChange={this.handleChange}
          onViewModeChange={this.handleInputFieldFocus}
          onNavigateBack={this.handleInputFieldFocus}
          onNavigateForward={this.handleInputFieldFocus}
          value={this.getValue()}
          inputProps={{
            id,
            disabled,
            placeholder,
            ref: (node) => { this.inputNode = node; },
            onMouseDown: this.recalculatePickerPosition,
          }}
          isValidDate={isValidDate}
          closeOnSelect={closeOnSelect}
          timePresets={timePresets}
          withTime={withTime}
        />
        <div className="input-group-append">
          <button
            type="button"
            className="input-group-text input-group-addon date-time-icon"
            onClick={() => this.handleInputFieldFocus(true)}
          >
            <i className="icon icon-calendar" />
          </button>
        </div>
      </div>
    );
  };

  renderVertical = (props) => {
    const {
      label,
      className,
      field: { error },
      showErrorMessage,
      helpText,
      disabled,
    } = props;

    const groupClassName = classNames(
      'form-group',
      className,
      { 'has-danger': error },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <If condition={label}>
          <label>{label}</label>
        </If>
        {this.renderInput(props)}
        <If condition={helpText || (showErrorMessage && error)}>
          <div className="form-row">
            <If condition={showErrorMessage && error}>
              <div className="col form-control-feedback">
                <i className="icon icon-alert" />
                {error}
              </div>
            </If>
            <If condition={helpText}>
              <div className="col form-group-help">
                {helpText}
              </div>
            </If>
          </div>
        </If>
      </div>
    );
  };

  renderHorizontal = (props) => {
    const {
      label,
      className,
      field: { error },
      showErrorMessage,
      helpText,
      disabled,
    } = props;

    const groupClassName = classNames(
      'form-group row',
      className,
      { 'has-danger': error },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <label className="col-md-3">{label}</label>
        <div className="col-md-9">
          {this.renderInput(props)}
          <If condition={helpText || (showErrorMessage && error)}>
            <div className="col-12">
              <div className="form-row">
                <If condition={showErrorMessage && error}>
                  <div className="col form-control-feedback">
                    <i className="icon icon-alert" />
                    {error}
                  </div>
                </If>
                <If condition={helpText}>
                  <div className="col form-group-help">
                    {helpText}
                  </div>
                </If>
              </div>
            </div>
          </If>
        </div>
      </div>
    );
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default DatePicker;
