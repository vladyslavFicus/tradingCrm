import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'newage-react-datetime';
import './DateTimeField.scss';
import FieldLabel from '../FieldLabel';

const ISO_FORMAT_DATE = 'YYYY-MM-DD';
const ISO_FORMAT_TIME = 'HH:mm:ss';

class DateTimeField extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    pickerClassName: PropTypes.string,
    isDateRangeEndValue: PropTypes.bool,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    isValidDate: PropTypes.func.isRequired,
    label: PropTypes.string,
    labelAddon: PropTypes.any,
    labelClassName: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
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
    labelAddon: null,
    labelClassName: null,
    className: null,
    pickerClassName: '',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    position: 'vertical',
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
      validLength: ISOFormat.length,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dateFormat, timeFormat } = this.props;

    if (dateFormat !== nextProps.dateFormat || timeFormat !== nextProps.timeFormat) {
      const format = [nextProps.dateFormat, nextProps.timeFormat].join(' ').trim();
      const ISOFormat = [
        nextProps.dateFormat ? ISO_FORMAT_DATE : null,
        nextProps.timeFormat ? ISO_FORMAT_TIME : null,
      ].join('T').trim();
      this.setState({
        format,
        ISOFormat,
        validLength: ISOFormat.length,
      });
    }
  }

  getValue = () => {
    const { input: { value }, utc } = this.props;

    if (this.shouldFormatValue(value)) {
      return (utc ? moment.utc(value).local() : moment(value)).format(this.state.format);
    }

    return value;
  };

  shouldFormatValue = value => (
    value && value.length === this.state.validLength && moment(value, this.state.ISOFormat).isValid()
  );

  handleChange = (newValue) => {
    const { input: { onChange, value }, utc, isDateRangeEndValue } = this.props;
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

    onChange(formatValue);
  };

  handleInputFieldFocus = () => {
    if (this.inputNode) {
      this.inputNode.focus();
    }
  };

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
          className={pickerClassName}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          onChange={this.handleChange}
          value={this.getValue()}
          inputProps={{
            id,
            disabled,
            placeholder,
            ref: (node) => { this.inputNode = node; },
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
            onClick={this.handleInputFieldFocus}
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
      labelClassName,
      labelAddon,
      className,
      meta: { touched, error },
      showErrorMessage,
      helpText,
      disabled,
    } = props;

    const groupClassName = classNames(
      'form-group',
      className,
      { 'has-danger': touched && error },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <FieldLabel
          label={label}
          addon={labelAddon}
          className={labelClassName}
        />
        {this.renderInput(props)}
        <If condition={helpText || (showErrorMessage && touched && error)}>
          <div className="form-row">
            <If condition={showErrorMessage && touched && error}>
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
      meta: { touched, error },
      showErrorMessage,
      helpText,
      disabled,
    } = props;

    const groupClassName = classNames(
      'form-group row',
      className,
      { 'has-danger': touched && error },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <label className="col-md-3">{label}</label>
        <div className="col-md-9">
          {this.renderInput(props)}
          <If condition={helpText || (showErrorMessage && touched && error)}>
            <div className="col-12">
              <div className="form-row">
                <If condition={showErrorMessage && touched && error}>
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

export default DateTimeField;
