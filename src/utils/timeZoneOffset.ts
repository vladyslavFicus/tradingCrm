import moment from 'moment';

const timeZoneOffset = (time: string, timeZone: string) => {
  const duration = moment.duration(timeZone).asMinutes();

  return moment(time).subtract(duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss[Z]');
};

export const fieldTimeZoneOffset = (fieldName: string, value?: string | null, timeZone?: string) => {
  const time = timeZone && value ? timeZoneOffset(value, timeZone) : value;

  return { [fieldName]: time };
};

export default timeZoneOffset;
