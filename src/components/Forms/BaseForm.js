import React, { Component, PropTypes } from 'react';

const SCENARIO_DEFAULT = 'default';

class BaseForm extends Component {
  constructor(props) {
    super(props);

    this.__scenario = SCENARIO_DEFAULT;
    this.__errors = {};
  }

  validateField(name, value) {
    this.clearErrors(name);

    const validators = this.rules();
    const currentFieldValidators = validators[name];

    return currentFieldValidators ? currentFieldValidators.every((validatorConfig) => {
      if (!validatorConfig.on || validatorConfig.on === this.getScenario()) {
        if (!validatorConfig.validator(value)) {
          this.addError(name, validatorConfig.message);

          return false;
        }
      }

      return true;
    }) : true;
  }

  validateFields(data) {
    Object.keys(data).forEach((name) => this.validateField(name, data[name]));

    return !this.hasErrors();
  }

  hasErrors(name = null) {
    return name ? this.__errors[name] ? this.__errors[name].length > 0 : false : Object.keys(this.__errors).some((name) => this.__errors[name].length > 0);
  }

  getErrors(name = null) {
    return name ? this.hasErrors(name) ? this.__errors[name] : [] : this.__errors;
  }

  getFirstError(name) {
    return this.hasErrors(name) ? this.__errors[name][0] : null;
  }

  getFirstErrors() {
    return Object.keys(this.__errors).reduce((result, current) => this.__errors[name] ? errors[name].length > 0 ? result : {
      ...result,
      [name]: this.__errors[name][0]
    } : result, {});
  }

  addError(name, message) {
    if (!this.__errors[name]) {
      this.__errors[name] = [];
    }

    this.__errors[name].push(message);
  }

  clearErrors(name = null) {
    if (name) {
      this.__errors[name] = [];
    } else {
      this.__errors = [];
    }
  }

  rules() {
    return {};
  }

  validate() {
    const fields = Object.keys(this.rules());

    const validator = function (field) {
      return !this.hasErrors(field);
    }.bind(this);

    return fields.every(validator, true)
  }

  setScenario(scenario = SCENARIO_DEFAULT) {
    this.__scenario = scenario;
  }

  getScenario() {
    return this.__scenario;
  }
}

export default BaseForm;
