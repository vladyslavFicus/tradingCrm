import moment from 'moment';

const startDateValidator = currentValues => (current) => {
  if (!current.isSameOrBefore()) {
    return false;
  }

  return currentValues && currentValues.endDate ?
    current.isSameOrBefore(moment(currentValues.endDate)) : true;
};

const endDateValidator = currentValues => (current) => {
  if (!current.isSameOrBefore()) {
    return false;
  }

  return currentValues && currentValues.startDate
    ? current.isSameOrAfter(moment(currentValues.startDate))
    : true;
};

export {
  startDateValidator,
  endDateValidator,
};
