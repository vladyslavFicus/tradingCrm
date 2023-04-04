export const salesStatuses: Record<string, string> = {
  CALLBACK: 'CONSTANTS.SALES_STATUSES.CALLBACK',
  CALL_AGAIN: 'CONSTANTS.SALES_STATUSES.CALL_AGAIN',
  CONVERTED: 'CONSTANTS.SALES_STATUSES.CONVERTED',
  DEPOSITOR: 'CONSTANTS.SALES_STATUSES.DEPOSITOR',
  DO_NOT_CALL: 'CONSTANTS.SALES_STATUSES.DO_NOT_CALL',
  SELF_DEPOSITOR: 'CONSTANTS.SALES_STATUSES.SELF_DEPOSITOR',
  DUPLICATE: 'CONSTANTS.SALES_STATUSES.DUPLICATE',
  FAILED_DEPOSIT: 'CONSTANTS.SALES_STATUSES.FAILED_DEPOSIT',
  INITIAL_CALL: 'CONSTANTS.SALES_STATUSES.INITIAL_CALL',
  INVALID_COUNTRY: 'CONSTANTS.SALES_STATUSES.INVALID_COUNTRY',
  INVALID_LANGUAGE: 'CONSTANTS.SALES_STATUSES.INVALID_LANGUAGE',
  NEVER_ANSWER: 'CONSTANTS.SALES_STATUSES.NEVER_ANSWER',
  NEW: 'CONSTANTS.SALES_STATUSES.NEW',
  NO_ANSWER: 'CONSTANTS.SALES_STATUSES.NO_ANSWER',
  NO_ANSWER_2: 'CONSTANTS.SALES_STATUSES.NO_ANSWER_2',
  NO_ANSWER_3: 'CONSTANTS.SALES_STATUSES.NO_ANSWER_3',
  NO_ANSWER_4: 'CONSTANTS.SALES_STATUSES.NO_ANSWER_4',
  NO_ANSWER_5: 'CONSTANTS.SALES_STATUSES.NO_ANSWER_5',
  NO_INTEREST: 'CONSTANTS.SALES_STATUSES.NO_INTEREST',
  NO_MONEY: 'CONSTANTS.SALES_STATUSES.NO_MONEY',
  POTENTIAL_HIGH: 'CONSTANTS.SALES_STATUSES.POTENTIAL_HIGH',
  POTENTIAL_LOW: 'CONSTANTS.SALES_STATUSES.POTENTIAL_LOW',
  NO_POTENTIAL: 'CONSTANTS.SALES_STATUSES.NO_POTENTIAL',
  REASSIGN: 'CONSTANTS.SALES_STATUSES.REASSIGN',
  TEST: 'CONSTANTS.SALES_STATUSES.TEST',
  UNDER_18: 'CONSTANTS.SALES_STATUSES.UNDER_18',
  VOICEMAIL: 'CONSTANTS.SALES_STATUSES.VOICEMAIL',
  WRONG_INFO: 'CONSTANTS.SALES_STATUSES.WRONG_INFO',
  WRONG_NUMBER: 'CONSTANTS.SALES_STATUSES.WRONG_NUMBER',
  DIALER_NA: 'CONSTANTS.SALES_STATUSES.DIALER_NA',
  DIALER_NEW: 'CONSTANTS.SALES_STATUSES.DIALER_NEW',
  DIALER_ASSIGNED: 'CONSTANTS.SALES_STATUSES.DIALER_ASSIGNED',
  DIALER_FAILED: 'CONSTANTS.SALES_STATUSES.DIALER_FAILED',
  DIALER_DROP: 'CONSTANTS.SALES_STATUSES.DIALER_DROP',
  WIRE_SENT: 'CONSTANTS.SALES_STATUSES.WIRE_SENT',
  HUNG_UP: 'CONSTANTS.SALES_STATUSES.HUNG_UP',
  LONG_TERM_CALL_BACK: 'CONSTANTS.SALES_STATUSES.LONG_TERM_CALL_BACK',
  APPOINTMENT_24HR: 'CONSTANTS.SALES_STATUSES.APPOINTMENT_24HR',
  HOT: 'CONSTANTS.SALES_STATUSES.HOT',
  BLACK_LIST_COUNTRY: 'CONSTANTS.SALES_STATUSES.BLACK_LIST_COUNTRY',
  EXPECTATION: 'CONSTANTS.SALES_STATUSES.EXPECTATION',
  JUNK_LEAD: 'CONSTANTS.SALES_STATUSES.JUNK_LEAD',
  SHARED: 'CONSTANTS.SALES_STATUSES.SHARED',
  SHARED_2: 'CONSTANTS.SALES_STATUSES.SHARED_2',
  SHARED_3: 'CONSTANTS.SALES_STATUSES.SHARED_3',
  SHARED_10: 'CONSTANTS.SALES_STATUSES.SHARED_10',
  PUBLIC_NUMBER: 'CONSTANTS.SALES_STATUSES.PUBLIC_NUMBER',
  POTENTIAL_FRAUD: 'CONSTANTS.SALES_STATUSES.POTENTIAL_FRAUD',
  CALL_BACK_INSFF: 'CONSTANTS.SALES_STATUSES.CALL_BACK_INSFF',
  MEDIA: 'CONSTANTS.SALES_STATUSES.MEDIA',
  PENDING: 'CONSTANTS.SALES_STATUSES.PENDING',
  DIFFERENT_VOICE: 'CONSTANTS.SALES_STATUSES.DIFFERENT_VOICE',
  DEPOSIT_WITH_ME: 'CONSTANTS.SALES_STATUSES.DEPOSIT_WITH_ME',
  FROST: 'CONSTANTS.SALES_STATUSES.FROST',
  REFERRAL: 'CONSTANTS.SALES_STATUSES.REFERRAL',
  ACTIVE: 'CONSTANTS.SALES_STATUSES.ACTIVE',
  CALLBACK_NA: 'CONSTANTS.SALES_STATUSES.CALLBACK_NA',
  MESSAGER: 'CONSTANTS.SALES_STATUSES.MESSAGER',
};

export const salesStatusesColor: Record<string, string> = {
  NEW: 'info',
  NO_ANSWER: 'danger',
  NO_ANSWER_2: 'danger',
  NO_ANSWER_3: 'danger',
  NO_ANSWER_4: 'danger',
  NO_ANSWER_5: 'danger',
  WRONG_INFO: 'danger',
  FAILED_DEPOSIT: 'danger',
  INVALID_LANGUAGE: 'danger',
  REASSIGN: 'warning',
  UNDER_18: 'danger',
  WRONG_NUMBER: 'danger',
  DUPLICATE: 'warning',
  VOICEMAIL: 'info',
  NEVER_ANSWER: 'danger',
  CONVERTED: 'success',
  CALLBACK: 'info',
  CALL_AGAIN: 'info',
  POTENTIAL_HIGH: 'info',
  POTENTIAL_LOW: 'warning',
  NO_POTENTIAL: 'warning',
  NO_INTEREST: 'warning',
  INITIAL_CALL: 'info',
  NO_MONEY: 'warning',
  TEST: 'danger',
  DEPOSITOR: 'success',
  DO_NOT_CALL: 'danger',
  INVALID_COUNTRY: 'danger',
  DIALER_NEW: 'info',
  DIALER_ASSIGNED: 'success',
  DIALER_FAILED: 'danger',
  DIALER_DROP: 'danger',
  WIRE_SENT: 'info',
  HUNG_UP: 'warning',
  LONG_TERM_CALL_BACK: 'warning',
  APPOINTMENT_24HR: 'warning',
  SELF_DEPOSITOR: 'success',
  HOT: 'warning',
  BLACK_LIST_COUNTRY: 'danger',
  EXPECTATION: 'info',
  JUNK_LEAD: 'danger',
  SHARED: 'info',
  SHARED_2: 'info',
  SHARED_3: 'info',
  SHARED_10: 'info',
  PUBLIC_NUMBER: 'danger',
  POTENTIAL_FRAUD: 'danger',
  CALL_BACK_INSFF: 'info',
  MEDIA: 'info',
  DIFFERENT_VOICE: 'info',
  DEPOSIT_WITH_ME: 'info',
  PENDING: 'warning',
  FROST: 'info',
  REFERRAL: 'info',
  ACTIVE: 'success',
  CALLBACK_NA: 'info',
  MESSAGER: 'info',
};
