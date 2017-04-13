import { customValueFieldTypes } from 'constants/form';
import Validator from 'validatorjs';

Validator.register('nextDate', function (value, requirement, attribute) {
  return value >= this.validator.input[requirement];
}, 'The :attribute must be equal or bigger');

Validator.register('lessThan', function (value, requirement) {
  const greaterValue = this.validator.input[requirement];

  const valueNumber = Number(value);
  const greaterValueNumber = Number(greaterValue);

  return greaterValueNumber === 0 || valueNumber < greaterValueNumber;
}, 'The :attribute must be less');

Validator.register('greaterThan', function (value, requirement) {
  const lessValue = this.validator.input[requirement];

  const valueNumber = Number(value);
  const lessValueNumber = Number(lessValue);

  return lessValueNumber === 0 || valueNumber > lessValueNumber;
}, 'The :attribute must be greater');

Validator.register('customTypeValue.value', function (value, requirement, attribute) {
  const attributeBaseName = attribute.replace(/\.value/, '');

  if (typeof this.validator.input[attributeBaseName] !== 'undefined') {
    const customTypeValueField = this.validator.input[attributeBaseName];

    if (!customTypeValueField.type) {
      this.validator.errors.add(`${attributeBaseName}.type`, 'Choose type of value');
    } else {
      value = Number(value);

      if (isNaN(value)) {
        this.validator.errors.add(attribute, 'Value must be a number');

        return false;
      }

      if (customTypeValueField.type === customValueFieldTypes.PERCENTAGE) {
        if (value < 0 || value > 100) {
          this.validator.errors.add(attribute, 'Value must be between 0 and 100');

          return false;
        }
      } else if (customTypeValueField.type === customValueFieldTypes.ABSOLUTE) {
        if (value < 0) {
          this.validator.errors.add(attribute, 'Value must be greater than 0');

          return false;
        }
      }
    }
  }

  return true;
}, 'The :attribute must be a valid CustomType');

const getFirstErrors = (errors) => Object.keys(errors).reduce((result, current) => ({
  ...result,
  [current]: errors[current][0],
}), {});

const createValidator = (rules, attributeLabels = {}, multipleErrors = true) => (data) => {
  const validation = new Validator(data, rules);
  validation.setAttributeNames(attributeLabels);

  return validation.fails() ?
    multipleErrors ?
      validation.errors.all() : getFirstErrors(validation.errors.all())
    : {};
};

export { createValidator };
