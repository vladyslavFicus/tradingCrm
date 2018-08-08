const salesStatusesColor = {
  NEW: 'color-info',
  NO_ANSWER: 'color-danger',
  NO_ANSWER_2: 'color-danger',
  NO_ANSWER_3: 'color-danger',
  NO_ANSWER_4: 'color-danger',
  NO_ANSWER_5: 'color-danger',
  CONVERTED_CALLBACK: 'color-success',
  INTERESTED: 'color-info',
  NOT_INTERESTED: 'color-danger',
  WRONG_INFO: 'color-danger',
  INIT_CALL_DO: 'color-info',
  NOT_CALL: 'color-info',
  NO_FUNDS: 'color-warning',
  FAILED_DEPOSIT: 'color-danger',
  CLOSED: 'color-danger',
  INVALID_LANGUAGE: 'color-danger',
  REASSIGN: 'color-warning',
  UNDER_18: 'color-danger',
  WRONG_NUMBER: 'color-danger',
  DUPLICATE: 'color-warning',
  VOICEMAIL: 'color-info',
  NEVER_ANSWER: 'color-danger',
};

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
  salesStatusesColor,
  retentionStatusesColor,
  acquisitionStatuses,
};
