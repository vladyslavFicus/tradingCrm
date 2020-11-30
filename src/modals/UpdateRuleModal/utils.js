const getMinutesFromTimeString = (timeString) => {
  const [, hours, minutes] = timeString?.match(/^(\d{1,2}):(\d{1,2})\b/) || [null, 0, 0];

  return hours * 60 + minutes * 1;
};

const validateTimeRange = (timeFromString, timeToString) => {
  const timeFromMinutesNum = getMinutesFromTimeString(timeFromString);
  const timeToMinutesNum = getMinutesFromTimeString(timeToString);

  if (timeFromMinutesNum === timeToMinutesNum || timeToMinutesNum < timeFromMinutesNum) {
    return 'INVALID_TIME_RANGE';
  }

  return null;
};

const getOperatorSpreadsPercentageError = (operatorSpreads) => {
  if (operatorSpreads?.length && operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100) {
    return 'INVALID_PERCENTAGE';
  }

  return null;
};

const getTimeIntervalsErrors = (timeIntervals, scheduleErrors) => {
  const timeIntervalsErrors = scheduleErrors?.timeIntervals || [];

  timeIntervals.forEach(({ operatorSpreads, timeFrom, timeTo }, timeIntervalIndex) => {
    const timeRangeError = validateTimeRange(timeFrom, timeTo);
    const percentageError = getOperatorSpreadsPercentageError(operatorSpreads);

    if (timeRangeError && !timeIntervalsErrors[timeIntervalIndex]?.timeRange) {
      timeIntervalsErrors[timeIntervalIndex] = {
        ...timeIntervalsErrors[timeIntervalIndex],
        timeRange: timeRangeError,
      };
    }

    if (percentageError && !timeIntervalsErrors[timeIntervalIndex]?.operatorSpreads) {
      timeIntervalsErrors[timeIntervalIndex] = {
        ...timeIntervalsErrors[timeIntervalIndex],
        operatorSpreads: percentageError,
      };
    }
  });

  if (timeIntervalsErrors.length) {
    return timeIntervalsErrors;
  }

  return null;
};

export const extraValidation = (
  { schedules, operatorSpreads },
  errors,
  { withOperatorSpreads, validationSchedulesEnabled },
) => {
  const schedulesErrors = [];
  const operatorSpreadsPercentageError = withOperatorSpreads
    && getOperatorSpreadsPercentageError(operatorSpreads);

  if (validationSchedulesEnabled) {
    schedules.forEach(({ timeIntervals }, index) => {
      const scheduleErrors = errors?.schedules?.[index];
      const timeIntervalsErrors = getTimeIntervalsErrors(timeIntervals, scheduleErrors);

      schedulesErrors.push(
        timeIntervalsErrors && { timeIntervals: timeIntervalsErrors },
      );
    });
  }

  return {
    ...errors,
    ...schedulesErrors.filter(Boolean).length && { schedules: schedulesErrors },
    ...operatorSpreadsPercentageError && { operatorSpreads: operatorSpreadsPercentageError },
  };
};

export const nestedFieldsTranslator = (errors, patterns) => {
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
