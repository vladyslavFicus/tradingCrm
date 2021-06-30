import Validator from 'validatorjs';
import I18n from 'i18n-js';
import { get, zipObjectDeep } from 'lodash';
import moment from 'moment';

function nextDateValidator(value, requirement) {
  return value >= this.validator.input[requirement];
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

  if (greaterValue !== 0 && value > greaterValue) {
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
  const lessValue = Number(get(this.validator.input, requirement));

  if (Number.isNaN(lessValue)) {
    return true;
  }

  if (Number.isNaN(value)) {
    this.validator.errors.add(attribute, 'Value must be a number');

    return false;
  }

  return lessValue === 0 || value >= lessValue;
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
  const momentEnd = moment(this.validator.input[compareFieldKey], DATE_TIME_BASE_FORMAT);

  return momentEnd.isAfter(momentStart);
}

Validator.register('nextDate', nextDateValidator, 'The :attribute must be equal or bigger');
Validator.register('lessThan', lessThanValidator, 'The :attribute must be less');
Validator.register('greaterThan', greaterThanValidator, 'The :attribute must be greater');
Validator.register('daysRangeBetween', daysRangeBetweenValidator, '');
Validator.register('date', date, 'The date must be valid: Example: 01.01.2020');
Validator.register('dateWithTime', dateWithTime, 'The date must be valid: Example: 01.01.2020 00:00:00');
Validator.register('validDateTimeRange', validDateTimeRange, 'The date range must be valid');
Validator.register('validTimeRange', validTimeRange, 'The time range must be valid');
Validator.register('greater', greaterValidator, 'The :attribute must be greater than :greater');
Validator.register('lessOrSame', lessOrSameValidator, 'The :attribute must be less');
Validator.register('greaterOrSame', greaterOrSameValidator, 'The :attribute must be greater');
Validator.register('periodGreaterOrSame', periodGreaterOrSameValidator, 'The :attribute must be greater');
Validator.register('customTypeValue.value', customValueTypeValidator, 'The :attribute must be a valid CustomType');
Validator.register("listedIP's", listedIPsValidator, 'The IP address must be valid. Example: 101.220.33.40');

const getFirstErrors = errors => Object.keys(errors).reduce((result, current) => ({
  ...result,
  [current]: errors[current][0],
}), {});

const createValidator = (rules, attributeLabels = {}, multipleErrors = true, customErrors = {}) => (data) => {
  const validation = new Validator(data, rules, customErrors);
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
