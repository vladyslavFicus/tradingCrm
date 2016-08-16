import React, { Component, PropTypes } from 'react';
import BaseForm from 'components/Forms/BaseForm';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { stopEvent } from 'utils/helpers';

const initialErrorsState = {
  username: null,
  password: null
};

const initialValuesState = {
  username: '',
  password: '',
};

const SCENARIO_SUBMIT = 'submit';

class SignInForm extends BaseForm {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onFocusField = this.onFocusField.bind(this);

    this.state = {
      errors: { ...initialErrorsState },
      values: { ...initialValuesState },
    };
  }

  rules() {
    return {
      username: [
        { validator: (value) => !!value, message: 'Username can\'t be empty', on: SCENARIO_SUBMIT },
        { validator: (value) => !(value && value.length < 2), message: 'Incorrect password' },
        {
          validator: (value) => !(value && value.indexOf('@') !== -1 && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)),
          message: 'Invalid email address'
        },
      ],
      password: [
        { validator: (value) => !!value, message: 'Password can\'t be empty', on: SCENARIO_SUBMIT },
        { validator: (value) => !(value && value.length < 5), message: 'Incorrect password' },
      ]
    }
  }

  onSubmit(e) {
    stopEvent(e);

    this.setScenario(SCENARIO_SUBMIT);
    if (this.validate()) {
      this.props.login(this.refs.username.value, this.refs.password.value);
    }
    this.setScenario(null);

    return false;
  }

  onBlurField(e) {
    const name = e.target.getAttribute('data-name');
    const value = e.target.value;

    if (this.state.values[name] && this.state.values[name] !== value) {
      this.validateInput(e.target);
    }
  }

  onFocusField(e) {
    const name = e.target.getAttribute('data-name');
    const value = e.target.value;

    if (!this.state.values[name] && this.state.values[name] !== value) {
      this.setState({ values: { ...this.state.values, [name]: value } });
    }
  }

  validateInput(target) {
    const name = target.getAttribute('data-name');
    const value = target.value;

    this.setState({
      errors: {
        ...this.state.errors,
        [name]: this.validateField(name, value) ? this.getFirstError(name) : null
      }
    });
  }

  validate() {
    const { username, password } = this.refs;

    const result = this.validateFields({
      username: username.value,
      password: password.value,
    });

    if (!result) {
      this.refreshErrorsState();
    }

    return result;
  }

  refreshErrorsState() {
    this.setState({ errors: { ...this.state.errors, ...this.getFirstErrors() } });
  }

  componentWillUpdate(nextProps, nextState) {
    const { location, isSuccess } = this.props;

    if (!isSuccess && nextProps.isSuccess) {
      this.props.router.replace(location.state && location.state.nextPathname ? location.state.nextPathname : '/')
    }
  }

  render() {
    const { isOnRequest, isFailure, failureMessage } = this.props;

    return <form id="form-validation" name="form-validation" className="form-horizontal" onSubmit={this.onSubmit}>
      {failureMessage && <div className="alert alert-warning">
        {failureMessage}
      </div>}
      <div className={classNames('form-group', { 'has-error': this.hasErrors('username') || isFailure, })}>
        <input id="validation-email"
               className="form-control"
               type="text"
               placeholder="Email or username"
               ref="username"
               data-name="username"
               onBlur={this.onBlurField} onFocus={this.onFocusField}/>
        {(this.hasErrors('username')) && <div className="form-control-error">
          <ul>
            <li>{this.getFirstError('username')}</li>
          </ul>
        </div>}
      </div>

      <div className={classNames('form-group', { 'has-error': this.hasErrors('password') || isFailure, })}>
        < input
          className="form-control"
          type="password"
          placeholder="Password"
          ref="password"
          data-name="password"
          onBlur={this.onBlurField} onFocus={this.onFocusField}
        />
        {(this.hasErrors('password')) && <div className="form-control-error">
          <ul>
            <li>{this.getFirstError('password')}</li>
          </ul>
        </div>}

      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary width-150"
                {...{ disabled: isOnRequest || this.hasErrors() }}>
          Sign In
        </button>
      </div>
    </form>;
  }
}

export default withRouter(SignInForm);
