import Validator from 'validatorjs';
import I18n from 'i18n-js';
import { get, zipObjectDeep } from 'lodash';
import moment from 'moment';
import BigNumber from 'bignumber.js';

function nextDateValidator(value, requirement) {
  return value >= this.validator.input[requirement];
}

/**
 * Min Date Validator, field under validation (value) must be after or equal to the given date (requirement).
 *
 * @param value | String Date
 * @param requirement | String Date
 *
 * @return {boolean}
 */
function minDateValidator(value, requirement) {
  return new Date(value).getTime() >= new Date(requirement).getTime();
}
/**
 * Max Date Validator, field under validation (value) must be before or equal to the given date (requirement).
 *
 * @param value | String Date
 * @param requirement | String Date
 *
 * @return {boolean}
 */
function maxDateValidator(value, requirement) {
  return new Date(value).getTime() <= new Date(requirement).getTime();
}

function lessThanValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (Number.isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }
  const greaterValue = Number(get(this.validator.input, requirement));

  if (greaterValue !== 0 && value >= greaterValue) {
    const targetAttributeLabel = this.validator.messages._getAttributeName(requirement);
    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);

    this.validator.errors.add(attribute,
      `The "${currentAttributeLabel}" must be less than "${targetAttributeLabel}"`);

    return false;
  }

  return true;
}

function daysRangeBetweenValidator(value, requirement, attribute) {
  const [requirementAttribute, daysCriteria] = requirement.split(':');

  const requirementValue = this.validator.input[requirementAttribute];

  if (requirementValue && requirementAttribute && daysCriteria) {
    const daysDifferenceValue = moment(value).diff(moment(requirementValue), 'days');
    const daysDifferenceCriteria = Number(daysCriteria);

    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);
    const targetAttributeLabel = this.validator.messages._getAttributeName(requirementAttribute);

    if (daysDifferenceValue >= daysDifferenceCriteria) {
      this.validator.errors.add(
        attribute,
        `The difference between "${currentAttributeLabel}" and "${targetAttributeLabel}"
        must not be greater than ${daysDifferenceCriteria} days`,
      );

      return false;
    }
  }

  return true;
}

function greaterThanValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (Number.isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }
  const lessValue = Number(get(this.validator.input, requirement));

  if (lessValue !== 0 && value <= lessValue) {
    const targetAttributeLabel = this.validator.messages._getAttributeName(requirement);
    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);

    this.validator.errors.add(attribute,
      `The "${currentAttributeLabel}" must be greater than "${targetAttributeLabel}"`);

    return false;
  }

  return true;
}

function greaterValidator(inputValue, requirement) {
  return Number(inputValue) > requirement;
}

function lessOrSameValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (Number.isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }

  const greaterValue = Number(get(this.validator.input, requirement));

  if (value > greaterValue) {
    const targetAttributeLabel = this.validator.messages._getAttributeName(requirement);
    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);

    this.validator.errors.add(attribute,
      `The "${currentAttributeLabel}" must be less than or same "${targetAttributeLabel}"`);

    return false;
  }

  return true;
}

function greaterOrSameValidator(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (Number.isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }

  const lessValue = Number(get(this.validator.input, requirement));

  if (value < lessValue) {
    const targetAttributeLabel = this.validator.messages._getAttributeName(requirement);
    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);

    this.validator.errors.add(attribute,
      `The "${currentAttributeLabel}" must be greater than or same "${targetAttributeLabel}"`);

    return false;
  }

  return true;
}

function periodGreaterOrSameValidator(inputValue, requirement, attribute) {
  const value = parseInt(inputValue, 10);
  const valueUnit = get(this.validator.input, `${attribute}TimeUnit`);

  const lessValue = parseInt(get(this.validator.input, requirement), 10);
  const lessValueTimeUnit = get(this.validator.input, `${requirement}TimeUnit`);

  const isGreater = moment.duration(value, valueUnit).asMinutes()
    >= moment.duration(lessValue, lessValueTimeUnit).asMinutes();

  if (!isGreater) {
    this.validator.errors.add(attribute, `The "${attribute}" must be same or greater than "${requirement}"`);
  }

  return isGreater;
}

function customValueTypeValidator(inputValue, _, attribute) {
  const attributeBaseName = attribute.replace(/\.value/, '');
  const customTypeValueField = get(this.validator.input, attributeBaseName);

  if (typeof customTypeValueField !== 'undefined') {
    if (customTypeValueField === null) {
      return true;
    }

    if (!customTypeValueField.type) {
      this.validator.errors.add(`${attributeBaseName}.type`, 'Choose type of value');
    } else {
      const value = Number(inputValue);

      if (Number.isNaN(value)) {
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

// eslint-disable-next-line
const isIPValidator = ip => ip.match(/\b(?!(255\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168))(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/);

function listedIPsValidator(listOfIPs) {
  return listOfIPs.reduce((acc, ip) => {
    // eslint-disable-next-line
    const v4v6RegExp = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

    if (!ip.match(v4v6RegExp)) {
      // eslint-disable-next-line no-param-reassign
      acc = false;
    }
    return acc;
  }, true);
}

function date(inputDate) {
  const DATE_FORMAT = 'YYYY-MM-DD';

  const momentDateInFormat = moment(inputDate, DATE_FORMAT);

  if (momentDateInFormat.isValid() && inputDate === momentDateInFormat.format(DATE_FORMAT)) {
    return true;
  }

  return false;
}

function dateWithTime(inputDate) {
  // # DATE_TIME_OLD_BASE_FORMAT must be removed after backend change all data in filter-sets to DATE_TIME_BASE_FORMAT
  const DATE_TIME_OLD_BASE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
  const DATE_TIME_BASE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';

  const momentDateInBaseFormat = moment(inputDate, DATE_TIME_BASE_FORMAT);

  if (
    momentDateInBaseFormat.isValid()
    && (
      inputDate === momentDateInBaseFormat.format(DATE_TIME_BASE_FORMAT)
      || inputDate === momentDateInBaseFormat.format(DATE_TIME_OLD_BASE_FORMAT)
    )
  ) {
    return true;
  }

  return false;
}

function validDateTimeRange(startDateRange, endDateRange) {
  const DATE_TIME_BASE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';

  if (!endDateRange) {
    return true;
  }

  const momentStart = moment(startDateRange, DATE_TIME_BASE_FORMAT);
  const momentEnd = moment(endDateRange, DATE_TIME_BASE_FORMAT);

  return !momentEnd.isBefore(momentStart);
}

/**
 * Check if time 01:00 is after 01:01 and throw an error if it's before or equal
 *
 * @param value
 * @param compareFieldKey
 *
 * @return {boolean}
 */
function validTimeRange(value, compareFieldKey) {
  const DATE_TIME_BASE_FORMAT = 'HH:mm';

  if (!compareFieldKey) {
    return true;
  }

  const momentStart = moment(value, DATE_TIME_BASE_FORMAT);
  const momentEnd = moment(get(this.validator.input, compareFieldKey), DATE_TIME_BASE_FORMAT);

  return momentEnd.isAfter(momentStart);
}

/**
 * Step validator, entered next value should be greater or less on STEP value
 *
 * @param inputValue
 * @param requirement
 * @param attribute
 *
 * @return {boolean}
 */
function step(inputValue, requirement, attribute) {
  const value = Number(inputValue);

  if (Number.isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }

  const stepValue = Number(requirement);

  // Need to use BigNumber because this library can work with floating point number and can right divide (0.3 % 0.1)
  const remainderValue = new BigNumber(value).mod(stepValue).toNumber();

  if (remainderValue !== 0) {
    const currentAttributeLabel = this.validator.messages._getAttributeName(attribute);

    this.validator.errors.add(attribute,
      `The ${currentAttributeLabel} must be changed with step ${stepValue.toFixed(2)}`);

    return false;
  }

  return true;
}

Validator.register('nextDate', nextDateValidator, 'The :attribute must be equal or bigger');
Validator.register('minDate', minDateValidator, 'The :attribute must be equal or after :minDate.');
Validator.register('maxDate', maxDateValidator, 'The :attribute must be equal or before :maxDate.');
Validator.register('lessThan', lessThanValidator, 'The :attribute must be less');
Validator.register('greaterThan', greaterThanValidator, 'The :attribute must be greater');
Validator.register('daysRangeBetween', daysRangeBetweenValidator, '');
Validator.register('date', date, 'The date must be valid: Example: 01.01.2020');
Validator.register('dateWithTime', dateWithTime, 'The date must be valid: Example: 01.01.2020 00:00');
Validator.register('validDateTimeRange', validDateTimeRange, 'The date range must be valid');
Validator.register('validTimeRange', validTimeRange, 'The time range must be valid');
Validator.register('greater', greaterValidator, 'The :attribute must be greater than :greater');
Validator.register('lessOrSame', lessOrSameValidator, 'The :attribute must be less');
Validator.register('greaterOrSame', greaterOrSameValidator, 'The :attribute must be greater');
Validator.register('periodGreaterOrSame', periodGreaterOrSameValidator, 'The :attribute must be greater');
Validator.register('customTypeValue.value', customValueTypeValidator, 'The :attribute must be a valid CustomType');
Validator.register("listedIP's", listedIPsValidator, 'The IP address must be valid. Example: 101.220.33.40');
Validator.register('IP', isIPValidator, 'The IP address must be valid. Example: 101.220.33.40');
Validator.register('step', step, 'The :attribute value must be changed with step');

const getFirstErrors = errors => Object.keys(errors).reduce((result, current) => ({
  ...result,
  [current]: errors[current][0],
}), {});

/**
 * Execute validator rule for field as a function with input if it provided as function
 *
 * @param rules
 * @param input
 */
const parseFunctionRules = (rules, input) => Object.keys(rules).reduce((acc, curr) => {
  const rule = rules[curr];

  if (typeof rule === 'function' && rule(input)) {
    acc[curr] = rule(input);
  } else {
    acc[curr] = rule;
  }

  // Remove undefined and null items from array of rules
  if (Array.isArray(acc[curr])) {
    acc[curr] = acc[curr].filter(v => v);
  }

  return acc;
}, {});

const createValidator = (rules, attributeLabels = {}, multipleErrors = true, customErrors = {}) => (data) => {
  const parsedRules = parseFunctionRules(rules, data);

  const validation = new Validator(data, parsedRules, customErrors);
  validation.setAttributeNames(attributeLabels);

  if (validation.fails()) {
    const flattenErrors = multipleErrors ? validation.errors.all() : getFirstErrors(validation.errors.all());

    return zipObjectDeep(Object.keys(flattenErrors), Object.values(flattenErrors));
  }

  return {};
};

const translateLabels = labels => Object.keys(labels).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(labels[name]),
}), {});

export {
  createValidator,
  translateLabels,
};
export default createValidator;
