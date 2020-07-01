import keyMirror from 'keymirror';

export const notificationCenterTypes = keyMirror({
  WITHDRAWAL: null,
  DEPOSIT: null,
  ACCOUNT: null,
  KYC: null,
  CALLBACK: null,
  CLIENT: null,
  TRADING: null,
});

export const notificationCenterSubTypes = keyMirror({
  WITHDRAWAL_REQUEST_STATUS_FINANCE_TO_EXECUTE: null,
  WITHDRAWAL_REQUEST_STATUS_DEALING_REVIEW: null,
  WITHDRAWAL_REQUEST_STATUS_SALES_REVIEW: null,
  ACCOUNT_PASSWORD_RESET_REQUEST: null,
  WITHDRAWAL_REQUEST_CANCELLED: null,
  WITHDRAWAL_REQUEST_APPROVED: null,
  WITHDRAWAL_REQUEST_ATTEMPT: null,
  WITHDRAWAL_REQUEST_CREATED: null,
  KYC_DOCUMENT_UPLOADED: null,
  KYC_DOCUMENT_EXPIRED: null,
  ACCOUNT_MARGIN_CALL: null,
  ACCOUNT_PASSWORD_UPDATED: null,
  DEPOSIT_SUCCESSFUL: null,
  ACCOUNT_ARCHIVED: null,
  ACCOUNT_DISABLED: null,
  DEPOSIT_CREATED: null,
  ACCOUNT_CREATED: null,
  DEPOSIT_FAILED: null,
  KYC_APPROVED: null,
  CALLBACK_NAME: null,
  CALLBACK_TIME: null,
  CLIENT_ASSIGNED: null,
  MARGIN_CALL: null,
});

export const notificationCenterTypesLabels = {
  WITHDRAWAL: 'NOTIFICATION_CENTER.TYPES.WITHDRAWAL',
  DEPOSIT: 'NOTIFICATION_CENTER.TYPES.DEPOSIT',
  ACCOUNT: 'NOTIFICATION_CENTER.TYPES.ACCOUNT',
  KYC: 'NOTIFICATION_CENTER.TYPES.KYC',
  CALLBACK: 'NOTIFICATION_CENTER.TYPES.CALLBACK',
  CLIENT: 'NOTIFICATION_CENTER.TYPES.CLIENT',
  TRADING: 'NOTIFICATION_CENTER.TYPES.TRADING',
};

export const notificationCenterSubTypesLabels = {
  [notificationCenterSubTypes.WITHDRAWAL_REQUEST_STATUS_FINANCE_TO_EXECUTE]:
    'NOTIFICATION_CENTER.SUBTYPES.WITHDRAWAL_REQUEST_STATUS_FINANCE_TO_EXECUTE',
  [notificationCenterSubTypes.WITHDRAWAL_REQUEST_STATUS_DEALING_REVIEW]:
    'NOTIFICATION_CENTER.SUBTYPES.WITHDRAWAL_REQUEST_STATUS_DEALING_REVIEW',
  [notificationCenterSubTypes.WITHDRAWAL_REQUEST_STATUS_SALES_REVIEW]:
    'NOTIFICATION_CENTER.SUBTYPES.WITHDRAWAL_REQUEST_STATUS_SALES_REVIEW',
  [notificationCenterSubTypes.ACCOUNT_PASSWORD_RESET_REQUEST]:
    'NOTIFICATION_CENTER.SUBTYPES.ACCOUNT_PASSWORD_RESET_REQUEST',
  [notificationCenterSubTypes.ACCOUNT_PASSWORD_UPDATED]:
    'NOTIFICATION_CENTER.SUBTYPES.ACCOUNT_PASSWORD_UPDATED',
  [notificationCenterSubTypes.WITHDRAWAL_REQUEST_CANCELLED]:
    'NOTIFICATION_CENTER.SUBTYPES.WITHDRAWAL_REQUEST_CANCELLED',
  [notificationCenterSubTypes.WITHDRAWAL_REQUEST_APPROVED]: 'NOTIFICATION_CENTER.SUBTYPES.WITHDRAWAL_REQUEST_APPROVED',
  [notificationCenterSubTypes.WITHDRAWAL_REQUEST_ATTEMPT]: 'NOTIFICATION_CENTER.SUBTYPES.WITHDRAWAL_REQUEST_ATTEMPT',
  [notificationCenterSubTypes.WITHDRAWAL_REQUEST_CREATED]: 'NOTIFICATION_CENTER.SUBTYPES.WITHDRAWAL_REQUEST_CREATED',
  [notificationCenterSubTypes.KYC_DOCUMENT_UPLOADED]: 'NOTIFICATION_CENTER.SUBTYPES.KYC_DOCUMENT_UPLOADED',
  [notificationCenterSubTypes.KYC_DOCUMENT_EXPIRED]: 'NOTIFICATION_CENTER.SUBTYPES.KYC_DOCUMENT_EXPIRED',
  [notificationCenterSubTypes.ACCOUNT_MARGIN_CALL]: 'NOTIFICATION_CENTER.SUBTYPES.ACCOUNT_MARGIN_CALL',
  [notificationCenterSubTypes.DEPOSIT_SUCCESSFUL]: 'NOTIFICATION_CENTER.SUBTYPES.DEPOSIT_SUCCESSFUL',
  [notificationCenterSubTypes.ACCOUNT_ARCHIVED]: 'NOTIFICATION_CENTER.SUBTYPES.ACCOUNT_ARCHIVED',
  [notificationCenterSubTypes.ACCOUNT_DISABLED]: 'NOTIFICATION_CENTER.SUBTYPES.ACCOUNT_DISABLED',
  [notificationCenterSubTypes.DEPOSIT_CREATED]: 'NOTIFICATION_CENTER.SUBTYPES.DEPOSIT_CREATED',
  [notificationCenterSubTypes.ACCOUNT_CREATED]: 'NOTIFICATION_CENTER.SUBTYPES.ACCOUNT_CREATED',
  [notificationCenterSubTypes.DEPOSIT_FAILED]: 'NOTIFICATION_CENTER.SUBTYPES.DEPOSIT_FAILED',
  [notificationCenterSubTypes.KYC_APPROVED]: 'NOTIFICATION_CENTER.SUBTYPES.KYC_APPROVED',
  [notificationCenterSubTypes.CALLBACK_NAME]: 'NOTIFICATION_CENTER.SUBTYPES.CALLBACK_NAME',
  [notificationCenterSubTypes.CALLBACK_TIME]: 'NOTIFICATION_CENTER.SUBTYPES.CALLBACK_TIME',
  [notificationCenterSubTypes.CLIENT_ASSIGNED]: 'NOTIFICATION_CENTER.SUBTYPES.CLIENT_ASSIGNED',
  [notificationCenterSubTypes.MARGIN_CALL]: 'NOTIFICATION_CENTER.SUBTYPES.MARGIN_CALL',
};
