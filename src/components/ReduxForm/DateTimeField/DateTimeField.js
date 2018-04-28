import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';
import './DateTimeField.scss';
import FieldLabel from '../FieldLabel';

const ISO_FORMAT_DATE = 'YYYY-MM-DD';
const ISO_FORMAT_TIME = 'HH:mm:ss';

class DateTimeField extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    pickerClassName: PropTypes.string,
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
    position: 'horizontal',
    utc: false,
    disabled: false,
    placeholder: '',
    showErrorMessage: true,
    closeOnSelect: true,
    withTime: false,
    timePresets: false,
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

  handleChange = (value) => {
    const { input: { onChange }, utc } = this.props;

    let formatValue = value;

    if (value._isAMomentObject) {
      formatValue = (utc ? moment.utc(value) : value).format(this.state.ISOFormat);
    }

    onChange(formatValue);
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
      <div className={classNames('input-group', { disabled })}>
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
          }}
          isValidDate={isValidDate}
          closeOnSelect={closeOnSelect}
          timePresets={timePresets}
          withTime={withTime}
        />
        <div className="input-group-append">
          <span className="input-group-text input-group-addon">
            <i className="nas nas-calendar_icon" />
          </span>
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
    } = props;

    return (
      <div className={classNames('form-group', className, { 'has-danger': touched && error })}>
        <FieldLabel
          label={label}
          addon={labelAddon}
          className={labelClassName}
        />
        {this.renderInput(props)}
        {
          showErrorMessage && touched && error &&
          <div className="form-control-feedback">
            <i className="nas nas-field_alert_icon" />
            {error}
          </div>
        }
      </div>
    );
  };

  renderHorizontal = (props) => {
    const {
      label,
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames('form-group row', className, { 'has-danger': touched && error })}>
        <label className="col-md-3">{label}</label>
        <div className="col-md-9">
          {this.renderInput(props)}
          {
            showErrorMessage && touched && error &&
            <div className="form-control-feedback">
              <i className="nas nas-field_alert_icon" />
              {error}
            </div>
          }
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
