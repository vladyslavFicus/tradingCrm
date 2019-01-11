import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const maxPriority = 10;
export const priorities = [...Array.from(Array(maxPriority), (_, i) => i + 1)];

const maxDepositCount = 20;
export const depositCount = [...Array.from(Array(maxDepositCount), (_, i) => i + 1)];

export const ruleTypes = [{
  label: I18n.t('OFFICES.TABS.RULES.MODAL.RULE_TYPES.CLIENT'),
  value: 'PROFILE',
}, {
  label: I18n.t('OFFICES.TABS.RULES.MODAL.RULE_TYPES.LEAD'),
  value: 'LEAD',
}];

export const deskTypes = {
  RETENTION: 'retention',
  SALES: 'sales',
};

export const clientDistribution = [{
  label: I18n.t('DESKS.RULES.MODAL.DISTRIBUTION.DEFAULT'),
  value: 'DEFAULT',
}, {
  label: I18n.t('DESKS.RULES.MODAL.DISTRIBUTION.ROUND_ROBIN'),
  value: 'ROUND_ROBIN',
}];

export const actionRuleTypes = keyMirror({
  DEFAULT: null,
  ROUND_ROBIN: null,
});
