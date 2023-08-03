import permissions from 'config/permissions';

export const operatorTabs = (isSales: boolean) => {
  const tabs = [
    {
      label: 'OPERATOR_PROFILE.TABS.PROFILE',
      url: 'profile',
    },
    {
      label: 'OPERATOR_PROFILE.TABS.FEED',
      url: 'feed',
      permissions: permissions.AUDIT.AUDIT_LOGS,
    },
  ];

  // Check if operator profile userType is SALES to show sales rules tab
  if (isSales) {
    tabs.push({
      label: 'OPERATOR_PROFILE.TABS.SALES_RULES',
      url: 'sales-rules',
      permissions: permissions.SALES_RULES.GET_RULES,
    });
  }

  return tabs;
};
