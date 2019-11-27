import keyMirror from 'keymirror';

const maxPriority = 10;
export const priorities = [...Array.from(Array(maxPriority), (_, i) => i + 1)];

const maxDepositCount = 20;
export const depositCount = [...Array.from(Array(maxDepositCount), (_, i) => i + 1)];

export const ruleTypes = [{
  label: 'OFFICES.TABS.RULES.MODAL.RULE_TYPES.CLIENT',
  value: 'PROFILE',
}, {
  label: 'OFFICES.TABS.RULES.MODAL.RULE_TYPES.LEAD',
  value: 'LEAD',
}];

export const deskTypes = {
  RETENTION: 'retention',
  SALES: 'sales',
};

export const clientDistribution = [{
  label: 'DESKS.RULES.MODAL.DISTRIBUTION.DEFAULT',
  value: 'DEFAULT',
}, {
  label: 'DESKS.RULES.MODAL.DISTRIBUTION.ROUND_ROBIN',
  value: 'ROUND_ROBIN',
}];

export const actionRuleTypes = keyMirror({
  DEFAULT: null,
  ROUND_ROBIN: null,
});
