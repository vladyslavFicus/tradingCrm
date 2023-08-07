import { permissions } from 'config';

export const distributionRuleTabs = (isManual: boolean) => {
  const tabs = [
    {
      label: 'CLIENTS_DISTRIBUTION.RULE.GENERAL_INFO',
      url: 'general',
    },
    {
      label: 'CLIENTS_DISTRIBUTION.RULE.FEED',
      url: 'feed',
      permissions: permissions.AUDIT.AUDIT_LOGS,
    },
  ];

  // Check if ruleDistribution executionType is MANUAL to show shedule settings tab
  if (isManual) {
    tabs.push({
      label: 'CLIENTS_DISTRIBUTION.RULE.SCHEDULE_SETTINGS',
      url: 'schedule',
    });
  }

  return tabs;
};
