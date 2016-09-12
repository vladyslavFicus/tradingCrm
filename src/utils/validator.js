import Validator from 'validatorjs';

Validator.register('nextDate', function(value, requirement, attribute) {
  console.log(value, this.validator.input, requirement, attribute);
  return value >= this.validator.input[requirement];
}, 'The :attribute must be equal or bigger');

const getFirstErrors = (errors) => {
  return Object.keys(errors).reduce((result, current) => ({
    ...result,
    [current]: errors[current][0],
  }), {});
};

const createValidator = (rules, attributeLabels = {}, multipleErrors = true) => {
  return (data) => {
    const validation = new Validator(data, rules);
    validation.setAttributeNames(attributeLabels);

    return validation.fails() ? multipleErrors ? validation.errors.all() : getFirstErrors(validation.errors.all()) : {};
  };
};

export { createValidator };
