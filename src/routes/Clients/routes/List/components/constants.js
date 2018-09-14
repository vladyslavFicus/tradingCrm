const retentionStatusesColor = {
  NEW: 'color-info',
  CALLBACK: 'color-info',
  WRONG_NUMBER: 'color-danger',
  NEVER_ANSWER: 'color-danger',
  ANSWER_REASSIGN: 'color-info',
  HAS_POTENTIAL_REASSIGN: 'color-info',
  NO_POTENTIAL: 'color-warning',
  NOT_INTERESTED: 'color-danger',
  UNDER_18: 'color-danger',
  INVALID_LANGUAGE: 'color-danger',
  SEASSIONS_ONLY: 'color-info',
  RECOVERY_DEPOSITOR: 'color-success',
  RECEIVED_WITHDRAWAL: 'color-success',
};

const acquisitionStatuses = [{
  value: 'SALES',
  label: 'COMMON.SALES',
}, {
  value: 'RETENTION',
  label: 'COMMON.RETENTION',
}];

export {
  retentionStatusesColor,
  acquisitionStatuses,
};
