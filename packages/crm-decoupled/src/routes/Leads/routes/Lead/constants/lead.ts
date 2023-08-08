import { Config } from '@crm/common';

const leadTabs = [{
  label: 'LEAD_PROFILE.TABS.PROFILE',
  url: 'profile',
}, {
  url: 'call-history',
  label: 'LEAD_PROFILE.TABS.CALL_HISTORY',
  permissions: Config.permissions.CALL_HISTORY.LIST,
}, {
  url: 'callbacks',
  label: 'LEAD_PROFILE.TABS.CALLBACKS',
  permissions: Config.permissions.LEAD_PROFILE.CALLBACKS_LIST,
}, {
  label: 'LEAD_PROFILE.TABS.NOTES',
  url: 'notes',
}, {
  label: 'LEAD_PROFILE.TABS.FEEDS',
  url: 'feeds',
}];

export { leadTabs };
