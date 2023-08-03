export const formatCountValue = number => (number < 10 ? `0${number}` : number);

export const formatTimeString = ({ hours, minutes }) => `${formatCountValue(hours)}:${formatCountValue(minutes)}`;

export const getCountsFromString = (string) => {
  const [, hours, minutes] = string.match(/^(\d{1,2}):(\d{1,2})\b/) || [null, 0, 0];

  return { hours: +hours, minutes: +minutes };
};
