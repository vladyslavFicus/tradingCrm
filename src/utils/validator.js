import Validator from 'validatorjs';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';

function nextDateValidator(value, requirement) {
  return value >= this.validator.input[requirement];
}

function lessThanValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }
  const greaterValue = Number(_.get(this.validator.input, requirement));

  if (greaterValue !== 0 && value >= greaterValue) {
    const targetAttributeLabel = this.validator.messages._getAttributeName(requirement);
    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);

    this.validator.errors.add(attribute,
      `The "${currentAttributeLabel}" must be less than "${targetAttributeLabel}"`
    );

    return false;
  }

  return true;
}

function greaterThanValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }
  const lessValue = Number(_.get(this.validator.input, requirement));

  if (lessValue !== 0 && value <= lessValue) {
    const targetAttributeLabel = this.validator.messages._getAttributeName(requirement);
    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);

    this.validator.errors.add(attribute,
      `The "${currentAttributeLabel}" must be greater than "${targetAttributeLabel}"`
    );

    return false;
  }

  return true;
}

function lessOrSameValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }
  const greaterValue = Number(_.get(this.validator.input, requirement));

  return greaterValue === 0 || value <= greaterValue;
}

function greaterOrSameValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }
  const lessValue = Number(_.get(this.validator.input, requirement));

  return lessValue === 0 || value >= lessValue;
}

function customValueTypeValidator(inputValue, requirement, attribute) {
  const attributeBaseName = attribute.replace(/\.value/, '');
  const customTypeValueField = _.get(this.validator.input, attributeBaseName);

  if (typeof customTypeValueField !== 'undefined') {
    if (customTypeValueField === null) {
      return true;
    }

    if (!customTypeValueField.type) {
      this.validator.errors.add(`${attributeBaseName}.type`, 'Choose type of value');
    } else {
      const value = Number(inputValue);

      if (isNaN(value)) {
        this.validator.errors.add(attribute, 'Value must be a number');

        return false;
      }

      if (value < 0) {
        this.validator.errors.add(attribute, 'Value must be greater than 0');

        return false;
      }
    }

    return true;
  }

  return false;
}

Validator.register('nextDate', nextDateValidator, 'The :attribute must be equal or bigger');
Validator.register('lessThan', lessThanValidator, 'The :attribute must be less');
Validator.register('greaterThan', greaterThanValidator, 'The :attribute must be greater');
Validator.register('lessOrSame', lessOrSameValidator, 'The :attribute must be less');
Validator.register('greaterOrSame', greaterOrSameValidator, 'The :attribute must be greater');
Validator.register('customTypeValue.value', customValueTypeValidator, 'The :attribute must be a valid CustomType');

const getFirstErrors = errors => Object.keys(errors).reduce((result, current) => ({
  ...result,
  [current]: errors[current][0],
}), {});

const createValidator = (rules, attributeLabels = {}, multipleErrors = true) => (data) => {
  const validation = new Validator(data, rules);
  validation.setAttributeNames(attributeLabels);

  if (validation.fails()) {
    return multipleErrors ? validation.errors.all() : getFirstErrors(validation.errors.all());
  }

  return {};
};

const translateLabels = labels =>
  Object.keys(labels).reduce((res, name) => ({ ...res, [name]: I18n.t(labels[name]) }), {});

export {
  createValidator,
  translateLabels,
};
export default createValidator;
