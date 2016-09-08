const defaultValidators = {
  require: {
    validate: (value) => !!value,
    message: `"{{fieldName}}" is required.`,
  },
};

const displayError = (label, error) => error.replace('/\{\{fieldName\}\}/', label);

const validate = (scenario, rules, data) => {
  const errors = {};
  const addError = (name, message) => {
    if (!errors[name]) {
      errors[name] = [];
    }

    errors[name].push(message);
  };

  rules.forEach((rule) => {
    const { fields, validator, on, message } = rule;
    if (on === undefined || scenario === on) {
      const validatorObject = defaultValidators[validator];
      if (validatorObject === undefined) {
        throw Error('Unknown validator');
      }

      fields.forEach((fieldName) => {
        const result = validatorObject.validate(data[fieldName]);
        if (!result) {
          addError(fieldName, message ? message : validatorObject.message);
        }
      });
    }
  });

  return errors;
};

const getFirstErrors = (errors) => {
  return Object.keys(errors).reduce((result, current) => ({
    ...result,
    [current]: errors[current][0],
  }), {});
};

const createValidator = (rules, multipleErrors = true) => {
  return (data, scenario = 'default') => {
    const errors = validate(scenario, rules, data);

    return multipleErrors ? errors : getFirstErrors(errors);
  };
};

export { createValidator, displayError };
