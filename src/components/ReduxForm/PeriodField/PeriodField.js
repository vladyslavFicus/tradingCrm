import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { periods, periodLabels, range } from './constants';
import renderLabel from '../../../utils/renderLabel';

class PeriodField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.string.isRequired,
    showErrorMessage: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }),
  };

  static defaultProps = {
    showErrorMessage: true,
    meta: {
      touched: false,
      error: '',
    },
  };

  state = {
    value: 0,
    period: periods.HOURS,
  };

  componentWillUpdate(nextProps, nextState) {
    const value = nextState.value * range[nextState.period];

    this.props.input.onChange(value);
  }

  updatePeriod = e => this.setState({ period: e.target.value });
  updateValue = e => this.setState({ value: e.target.value });

  render() {
    const {
      input,
      label,
      meta: { error },
      showErrorMessage,
    } = this.props;

    return (
      <div className={classNames('form-group', { 'has-danger': error })}>
        <label>{label}</label>
        <div className="row">
          <div className="col-md-6">
            <input
              className={classNames('form-control', { 'has-danger': error })}
              type="number"
              onChange={this.updateValue}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-control"
              onChange={this.updatePeriod}
            >
              {
                Object.keys(periods).map(period => (
                  <option key={period} value={period}>
                    {renderLabel(period, periodLabels)}
                  </option>
                ))
              }
            </select>
          </div>
          <Field
            {...input}
            component="input"
            hidden
          />
        </div>
        {
          error && showErrorMessage &&
          <div className="form-control-feedback">
            <i className="nas nas-field_alert_icon" />
            {error}
          </div>
        }
      </div>
    );
  }
}

export default PeriodField;
