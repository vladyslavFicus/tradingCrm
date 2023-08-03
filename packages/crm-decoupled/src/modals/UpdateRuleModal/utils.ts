import { FormikErrors } from 'formik';
import { RuleTimeInterval, Rule__OperatorSpread as RuleOperatorSpread } from '__generated__/types';
import { FormValues, Range, ScheduleError, TimeIntervalError } from './types';

const getMinutesFromTimeString = (timeString: string) => {
  const [, hours, minutes] = timeString?.match(/^(\d{1,2}):(\d{1,2})\b/) || [null, 0, 0];

  return Number(hours) * 60 + Number(minutes);
};

const validateTimeRange = ({ timeFrom, timeTo }: Range) => {
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
const checkTimeRangesIntersection = (range1: Range, range2: Range) => {
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

  if (largerTimeRange && lesserLastTimeStamp > largerTimeRange[0]) {
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
const validateTimeRangeIntersection = (
  targetRange: Range,
  targetRangeIndex: number,
  rangesList: Array<Range>,
) => {
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

const getOperatorSpreadsPercentageError = (operatorSpreads: Array<RuleOperatorSpread>) => {
  if (operatorSpreads?.length && operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100) {
    return 'INVALID_PERCENTAGE';
  }

  return null;
};

// there may to perform this validation using our Validator package,
// but then the errors contain in schedules subfields wouldn't be set all together in the same time
const getDaysErrors = (days: Array<string>, scheduleErrors: ScheduleError) => {
  if (!days.length && !scheduleErrors?.days) {
    return 'REQUIRED';
  }

  return undefined;
};

const getTimeIntervalsErrors = (timeIntervals: Array<RuleTimeInterval>, scheduleErrors: ScheduleError) => {
  const timeIntervalsErrors = scheduleErrors?.timeIntervals as Array<TimeIntervalError> || [];

  timeIntervals.forEach(({ operatorSpreads, timeFrom, timeTo }, timeIntervalIndex) => {
    if (!operatorSpreads.length) {
      timeIntervalsErrors[timeIntervalIndex] = {
        ...timeIntervalsErrors[timeIntervalIndex],
        // the error of timeInterval is set into operatorSpreads field because of this way
        // at least one operator is required
        operatorSpreads: 'REQUIRED',
      };
    }

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

  return undefined;
};

/**
 *
 * @param {object} values
 * @param {object} errors
 * @param {boolean} validationSchedulesEnabled
 */
export const extraValidation = (
  { schedules, operatorSpreads }: FormValues,
  errors: FormikErrors<FormValues>,
  validationSchedulesEnabled: boolean,
) => {
  const schedulesErrors: Array<ScheduleError> = [];
  const operatorSpreadsPercentageError = operatorSpreads
    && getOperatorSpreadsPercentageError(operatorSpreads);

  if (validationSchedulesEnabled) {
    schedules.forEach(({ days, timeIntervals }, index) => {
      const scheduleErrors = errors?.schedules?.[index] as ScheduleError;
      const daysErrors = getDaysErrors(days, scheduleErrors);
      const timeIntervalsErrors = getTimeIntervalsErrors(timeIntervals, scheduleErrors);

      if ((daysErrors || timeIntervalsErrors)) {
        schedulesErrors.push({ days: daysErrors, timeIntervals: timeIntervalsErrors });
      }
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
export const nestedFieldsTranslator = (errors: FormikErrors<FormValues>, patterns: Record<string, string>) => {
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
