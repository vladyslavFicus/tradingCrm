const getMinutesFromTimeString = (timeString) => {
  const [, hours, minutes] = timeString?.match(/^(\d{1,2}):(\d{1,2})\b/) || [null, 0, 0];

  return hours * 60 + minutes * 1;
};

const validateTimeRange = ({ timeFrom, timeTo }) => {
  const timeFromMinutesNum = getMinutesFromTimeString(timeFrom);
  const timeToMinutesNum = getMinutesFromTimeString(timeTo);

  if (timeFromMinutesNum === timeToMinutesNum || timeToMinutesNum < timeFromMinutesNum) {
    return 'INVALID_VALUE';
  }

  return null;
};

/**
 * check if two time ranges intersect and return [true], if they do
 *
 * @param range1: { timeFrom: String, timeTo: String }
 * @param range2: { timeFrom: String, timeTo: String }
 */
const checkTimeRangesIntersection = (range1, range2) => {
  // convert time strings to number timestamps to perform more flexible comparison
  const timeStampsRange1 = [getMinutesFromTimeString(range1.timeFrom), getMinutesFromTimeString(range1.timeTo)];
  const timeStampsRange2 = [getMinutesFromTimeString(range2.timeFrom), getMinutesFromTimeString(range2.timeTo)];

  // Case #1:
  // If begins or ends of time ranges are equal then they intersect
  if (timeStampsRange1[0] === timeStampsRange2[0] || timeStampsRange1[1] === timeStampsRange2[1]) {
    return true;
  }

  // Case #2:
  // If the end timestamp of smaller time range belong to bigger time range
  // then these time ranges intersect.
  // Smaller time range is the one which has the lesser end timestamp
  const lesserLastTimeStamp = Math.min(timeStampsRange1[1], timeStampsRange2[1]);
  const largerLastTimeStamp = Math.max(timeStampsRange1[1], timeStampsRange2[1]);
  const largerTimeRange = [timeStampsRange1, timeStampsRange2]
    .find(([, lastTimeStamp]) => lastTimeStamp === largerLastTimeStamp);

  if (lesserLastTimeStamp > largerTimeRange[0]) {
    return true;
  }

  // Case #3:
  // Time ranges don't intersect
  return false;
};

/**
 * check target the time range if it intersects with someone in the list
 * and return 'INTERSECTION' error code it it does
 *
 * @param targetRange: { timeFrom: String, timeTo: String }
 * @param targetRangeIndex: Number
 * @param rangesList: [{ timeFrom: String, timeTo: String }]
 */
const validateTimeRangeIntersection = (targetRange, targetRangeIndex, rangesList) => {
  if (rangesList.length > 1) {
    const rangesListWithoutTargetRange = [...rangesList];
    rangesListWithoutTargetRange.splice(targetRangeIndex, 1);

    for (let i = 0; i < rangesListWithoutTargetRange.length; i++) {
      // don't need to perform intersection validation with invalid time range
      // because most likely it'll return incorrect result for target field
      // firstly need to fix invalid time range if it's wrong
      if (!validateTimeRange(rangesListWithoutTargetRange[i])
        && checkTimeRangesIntersection(targetRange, rangesListWithoutTargetRange[i])
      ) {
        return 'INTERSECTION';
      }
    }
  }

  return null;
};

const getOperatorSpreadsPercentageError = (operatorSpreads) => {
  if (operatorSpreads?.length && operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100) {
    return 'INVALID_PERCENTAGE';
  }

  return null;
};

// there may to perform this validation using our Validator package,
// but then the errors contain in schedules subfields wouldn't be set all together in the same time
const getDaysErrors = (days, scheduleErrors) => {
  if (!days.length && !scheduleErrors?.days) {
    return 'REQUIRED';
  }

  return null;
};

const getTimeIntervalsErrors = (timeIntervals, scheduleErrors) => {
  const timeIntervalsErrors = scheduleErrors?.timeIntervals || [];

  timeIntervals.forEach(({ operatorSpreads, timeFrom, timeTo }, timeIntervalIndex) => {
    // there makes sense to do intersection validation only if the current time range is valid
    const timeRangeError = validateTimeRange({ timeFrom, timeTo })
      || validateTimeRangeIntersection({ timeFrom, timeTo }, timeIntervalIndex, timeIntervals);
    const percentageError = getOperatorSpreadsPercentageError(operatorSpreads);

    if (timeRangeError && !timeIntervalsErrors[timeIntervalIndex]?.timeRange) {
      timeIntervalsErrors[timeIntervalIndex] = {
        ...timeIntervalsErrors[timeIntervalIndex],
        // the error of timeInterval is set into timeRange field because of this way
        // there doesn't alter the errors in nested fields like [operatorSpreads] in this case
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

/**
 *
 * @param {object} values
 * @param {object} errors
 * @param {object} options
 */
export const extraValidation = (
  { schedules, operatorSpreads },
  errors,
  { validationSchedulesEnabled },
) => {
  const schedulesErrors = [];
  const operatorSpreadsPercentageError = operatorSpreads
    && getOperatorSpreadsPercentageError(operatorSpreads);

  if (validationSchedulesEnabled) {
    schedules.forEach(({ days, timeIntervals }, index) => {
      const scheduleErrors = errors?.schedules?.[index];
      const daysErrors = getDaysErrors(days, scheduleErrors);
      const timeIntervalsErrors = getTimeIntervalsErrors(timeIntervals, scheduleErrors);

      schedulesErrors.push(
        (daysErrors || timeIntervalsErrors) && { days: daysErrors, timeIntervals: timeIntervalsErrors },
      );
    });
  }

  return {
    ...errors,
    ...schedulesErrors.filter(Boolean).length && { schedules: schedulesErrors },
    ...operatorSpreadsPercentageError && { operatorSpreads: operatorSpreadsPercentageError },
  };
};

/**
 * the issue about custom errors of nested fields:
 * https://github.com/skaterdav85/validatorjs/issues/274
 * the contributor of package suggests to implement custom solution in this case:
 * https://github.com/skaterdav85/validatorjs/issues/374
 */
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
