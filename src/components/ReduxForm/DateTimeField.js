import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';

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
  };
  static defaultProps = {
    id: null,
    label: null,
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
  };

  constructor(props) {
    super();

    const format = [props.dateFormat, props.timeFormat].join(' ').trim();
    const ISOFormat = [
      props.dateFormat ? ISO_FORMAT_DATE : null,
      props.timeFormat ? ISO_FORMAT_TIME : null,
    ].join('T').trim();
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

    onChange(formatValue || '');
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

  renderLabel = (props) => {
    const {
      label,
      labelClassName,
      position,
    } = props;

    if (!label) {
      return null;
    }

    const labelNode = <label className={labelClassName}>{label}</label>;

    return position === 'vertical'
      ? labelNode
      : <div className="col-md-3">{labelNode}</div>;
  };

  renderVertical = (props) => {
    const {
      className,
      meta: { touched, error },
    } = props;

    return (
      <div className={classNames(className, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        {this.renderInput(props)}
      </div>
    );
  };

  renderHorizontal = (props) => {
    const {
      className,
      meta: { touched, error },
    } = props;

    return (
      <div className={classNames(`${className} row`, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        <div className="col-md-9">
          {this.renderInput(props)}
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
