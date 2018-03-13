import moment from 'moment';

const startDateValidator = currentValues => (current) => {
  const valid = current.isSameOrBefore();

  if (currentValues && currentValues.endDate) {
    return valid && current.isSameOrAfter(moment(currentValues.endDate).subtract(2, 'w'))
      && current.isSameOrBefore(moment(currentValues.endDate));
  }

  return valid;
};
const endDateValidator = currentValues => (current) => {
  const valid = current.isSameOrBefore();

  if (currentValues && currentValues.startDate) {
    return valid && current.isSameOrBefore(moment(currentValues.startDate).add(2, 'w'))
      && current.isSameOrAfter(moment(currentValues.startDate));
  }

  return valid;
};

export {
  startDateValidator,
  endDateValidator,
};
