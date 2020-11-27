import moment from 'moment';

const createDayWithTime = (timeString) => {
  const [, hours, minutes] = timeString?.match(/^(\d{1,2}):(\d{1,2})\b/) || [null, 0, 0];

  return moment().hours(hours).minutes(minutes);
};

const validateTimeRange = (timeFromString, timeToString) => {
  const momentTimeFrom = createDayWithTime(timeFromString);
  const momentTimeTo = createDayWithTime(timeToString);

  if (momentTimeTo.isSameOrBefore(momentTimeFrom)) {
    return 'INVALID_TIME_RANGE';
  }

  return null;
};

const getOperatorSpreadsPercentageErorr = (operatorSpreads) => {
  if (operatorSpreads?.length && operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100) {
    return 'INVALID_PERCENTAGE';
  }

  return null;
};

const getDaysErrors = (days, scheduleErrors) => {
  if (!days.length && !scheduleErrors?.days) {
    return 'REQUIRED';
  }

  return null;
};

const getTimeIntervalsErrors = (timeIntervals, scheduleErrors) => {
  const timeIntervalsErrors = scheduleErrors?.timeIntervals || [];

  timeIntervals.forEach(({ operatorSpreads, timeFrom, timeTo }, timeIntervalIndex) => {
    const timeRangeError = validateTimeRange(timeFrom, timeTo);
    const percentageError = getOperatorSpreadsPercentageErorr(operatorSpreads);

    if (timeRangeError && !timeIntervalsErrors[timeIntervalIndex]?.timeRange) {
      timeIntervalsErrors[timeIntervalIndex] = {
        ...timeIntervalsErrors[timeIntervalIndex],
        timeRange: timeRangeError,
      };
    }

    if (percentageError && !timeIntervalsErrors[timeIntervalIndex]?.operatorSpreads) {
      timeIntervalsErrors[timeIntervalIndex] = {
        ...timeIntervalsErrors[timeIntervalIndex],
        operatorSpreads: 'INVALID_PERCENTAGE',
      };
    }
  });

  if (timeIntervalsErrors.length) {
    return timeIntervalsErrors;
  }

  return null;
};

export const extraValidation = ({ schedules, operatorSpreads }, errors, { withOperatorSpreads }) => {
  const schedulesErrors = [];
  const operatorSpreadsPercentageError = withOperatorSpreads
    && getOperatorSpreadsPercentageErorr(operatorSpreads);

  schedules.forEach(({ timeIntervals, days }, index) => {
    const scheduleErrors = errors?.schedules?.[index];
    const daysErrors = getDaysErrors(days, scheduleErrors);
    const timeIntervalsErrors = getTimeIntervalsErrors(timeIntervals, scheduleErrors);

    schedulesErrors.push(
      (daysErrors || timeIntervalsErrors) && { days: daysErrors, timeIntervals: timeIntervalsErrors },
    );
  });

  return {
    ...errors,
    ...schedulesErrors.filter(Boolean).length && { schedules: schedulesErrors },
    ...operatorSpreadsPercentageError && { operatorSpreads: operatorSpreadsPercentageError },
  };
};

export const deepFieldsTranslator = (errors, patterns) => {
  if (Object.keys(errors).length) {
    let errorsJSON = JSON.stringify(errors);

    Object.keys(patterns).forEach((key) => {
      const regExpPattern = key.replace(/\*/g, '\\b\\d+\\b').replace(/\./g, '\\.');

      errorsJSON = errorsJSON.replace(new RegExp(regExpPattern, 'g'), patterns[key]);
    });

    return JSON.parse(errorsJSON);
  }

  return errors;
};
