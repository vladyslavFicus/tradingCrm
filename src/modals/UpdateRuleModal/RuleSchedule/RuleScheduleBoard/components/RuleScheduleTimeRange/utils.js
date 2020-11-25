import moment from 'moment';

const createDayWithTime = (timeString) => {
  const [, hours, minutes] = timeString.match(/^(\d{1,2}):(\d{1,2})\b/) || [null, 0, 0];

  return moment().hours(hours).minutes(minutes);
};

export const validate = (timeFromString, timeToString) => {
  const momentTimeFrom = createDayWithTime(timeFromString);
  const momentTimeTo = createDayWithTime(timeToString);

  if (momentTimeTo.isSameOrBefore(momentTimeFrom)) {
    return 'INVALID_TIME_RANGE';
  }

  return null;
};
