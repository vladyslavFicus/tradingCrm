import I18n from 'i18n-js';

export const attributeLabels = {
  name: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.RULE_NAME',
  country: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.COUNTRY',
  language: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.LANGUAGE',
  priority: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.PRIORITY',
  type: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.TYPE',
  depositCount: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.DEPOSIT_COUNT',
  amount: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.AMOUNT',
  ruleType: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.DISTRIBUTION',
  partner: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.PARTNER',
  operator: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.OPERATOR',
  source: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.SOURCE',
  ratio: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.RATIO',
  depositAmountFrom: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.AMOUNT_FROM',
  depositAmountTo: 'HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.AMOUNT_TO',
};

export const customErrors = {
  'between.operatorSpreads.*.percentage': I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.ERRORS.BETWEEN_RATIO'),
  'integer.operatorSpreads.*.percentage': I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.ERRORS.INTEGER_RATIO'),
  'required.operatorSpreads.*.parentUser': I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.ERRORS.OPERATOR'),
  'between.schedules.*.timeIntervals.*.operatorSpreads.*.percentage':
    I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.ERRORS.BETWEEN_RATIO'),
  'integer.schedules.*.timeIntervals.*.operatorSpreads.*.percentage':
    I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.ERRORS.INTEGER_RATIO'),
  'required.schedules.*.timeIntervals.*.operatorSpreads.*.parentUser':
    I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.ERRORS.OPERATOR'),
};

export const nestedFieldsNames = {
  'schedules.*.timeIntervals.*.operatorSpreads.*.parentUser':
    I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.LABELS.OPERATOR'),
};
