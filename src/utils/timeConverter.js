import moment from 'moment';

const timeFormat = 'HH:mm';

const convertTime = (time, base) => {
  if (!time) return time;

  const [hour, minute] = time.match(/\d{2}/g);

  if (base === 'utc') {
    return moment.utc().set({ hour, minute }).local().format(timeFormat);
  }

  return moment().set({ hour, minute }).utc().format(timeFormat);
};

export const convertTimeToUTC = time => convertTime(time);

export const convertTimeFromUTC = time => convertTime(time, 'utc');
