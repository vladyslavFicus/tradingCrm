import I18n from 'i18n-js';

export const attributeLabels = {
  restrictedCountries: 'FEATURE_TOGGLES.FEATURE_FORM.RESTRICTED_COUNTRIES.TITLE',
  notificationCleanUpDays: 'FEATURE_TOGGLES.FEATURE_FORM.NOTIFICATION_CLEANUP.TITLE',
  jwtAccessTtlSeconds: 'FEATURE_TOGGLES.FEATURE_FORM.LOGOUT_TIME',
  autoLogout: 'FEATURE_TOGGLES.FEATURE_FORM.AUTO_LOGOUT.TITLE',
  'depositButtons.deposit1': 'FEATURE_TOGGLES.FEATURE_FORM.QUICK_DEPOSIT_BUTTONS.DEPOSIT_ONE',
  'depositButtons.deposit2': 'FEATURE_TOGGLES.FEATURE_FORM.QUICK_DEPOSIT_BUTTONS.DEPOSIT_TWO',
  'depositButtons.deposit3': 'FEATURE_TOGGLES.FEATURE_FORM.QUICK_DEPOSIT_BUTTONS.DEPOSIT_THREE',
  'depositButtons.deposit4': 'FEATURE_TOGGLES.FEATURE_FORM.QUICK_DEPOSIT_BUTTONS.DEPOSIT_FOUR',
  'depositButtons.deposit5': 'FEATURE_TOGGLES.FEATURE_FORM.QUICK_DEPOSIT_BUTTONS.DEPOSIT_FIVE',
  referralEnable: 'FEATURE_TOGGLES.FEATURE_FORM.REFERRAL_PROGRAM.TITLE',
  hideChangePasswordCp: 'FEATURE_TOGGLES.FEATURE_FORM.HIDE_CHANGE_PASSWORD.TITLE',
  profileDepositEnable: 'FEATURE_TOGGLES.FEATURE_FORM.DEPOSIT_BY_CLIENT.TITLE',
};

const errorValue = I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.REQUIRED_FIELD');
const greaterNull = I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.GREATER_NULL');

export const customErrors: Record<string, string> = {
  'required.platformMaxAccounts.MT4': errorValue,
  'required.platformMaxAccounts.MT5': errorValue,
  'required.platformMaxAccounts.TE': errorValue,
  'required.platformMaxAccounts.WET': errorValue,
  'greater.platformMaxAccounts.MT4': greaterNull,
  'greater.platformMaxAccounts.MT5': greaterNull,
  'greater.platformMaxAccounts.TE': greaterNull,
  'greater.platformMaxAccounts.WET': greaterNull,
  'required.depositButtons.deposit1': errorValue,
  'required.depositButtons.deposit2': errorValue,
  'required.depositButtons.deposit3': errorValue,
};
