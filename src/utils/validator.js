const defaultValidators = {
  require: {
    validate: (value) => !!value,
    message: (field) => `${field} is required.`,
  },
};

const validate = (scenario, rules, data) => {
  const errors = {};

  const addError = (name, message) => {
    if (!errors[name]) {
      errors[name] = [];
    }

    errors[name].push(message);
  };

  rules.every((rule) => {
    const { fields, validator, on, message } = rule;
    if (scenario !== on) {
      return true;
    }

    const validatorObject = defaultValidators[validator];
    return fields.every((fieldName) => {
      if (!validatorObject.validate(data[fieldName])) {
        addError(fieldName, message ? message : validatorObject.message(fieldName));

        return false;
      }

      return true;
    });
  });

  return errors;
};

export default (rules) => {
  return (data, scenario = 'default') => {
    return validate(scenario, rules, data);
  };
};
