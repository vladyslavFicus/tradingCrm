import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';
import FieldLabel from './FieldLabel';

const ISO_FORMAT_DATE = 'YYYY-MM-DD';
const ISO_FORMAT_TIME = 'HH:mm:ss';

class DateTimeField extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
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
    iconLeftClassName: PropTypes.string,
    iconRightClassName: PropTypes.string,
    utc: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
  };
  static defaultProps = {
    id: null,
    label: null,
    labelAddon: null,
    labelClassName: 'form-control-label',
    className: 'form-group',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    position: 'horizontal',
    iconLeftClassName: '',
    iconRightClassName: 'nas nas-calendar_icon',
    utc: false,
    disabled: false,
    placeholder: '',
    showErrorMessage: true,
  };

  constructor(props) {
    super();

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

    if (value instanceof moment) {
      formatValue = (utc ? moment.utc(value) : value).format(this.state.ISOFormat);
    }

    onChange(formatValue);
  };

  renderInput = () => {
    const {
      id,
      disabled,
      placeholder,
      isValidDate,
      dateFormat,
      timeFormat,
      iconLeftClassName,
      iconRightClassName,
    } = this.props;

    let inputField = (
      <DateTime
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        onChange={this.handleChange}
        value={this.getValue()}
        closeOnSelect
        inputProps={{
          id,
          disabled,
          placeholder,
        }}
        isValidDate={isValidDate}
      />
    );

    if (iconLeftClassName || iconRightClassName) {
      inputField = (
        <div
          className={classNames('input-with-icon', {
            'input-with-icon__left': !!iconLeftClassName,
            'input-with-icon__right': !!iconRightClassName,
          })}
        >
          {!!iconLeftClassName && <i className={classNames('input-left-icon', iconLeftClassName)} />}
          {inputField}
          {!!iconRightClassName && <i className={classNames('input-right-icon', iconRightClassName)} />}
        </div>
      );
    }

    return inputField;
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
      <div className={classNames(className, { 'has-danger': touched && error })}>
        <FieldLabel
          label={label}
          labelClassName={labelClassName}
          addon={labelAddon}
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
      labelClassName,
      labelAddon,
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames(`${className} row`, { 'has-danger': touched && error })}>
        <FieldLabel
          label={label}
          labelClassName={labelClassName}
          addon={labelAddon}
          wrapperTag="div"
          wrapperClassName="col-md-3"
        />
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
