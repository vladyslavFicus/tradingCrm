import permissions from 'config/permissions';

const leadTabs = [{
  label: 'LEAD_PROFILE.TABS.PROFILE',
  url: 'profile',
}, {
  url: 'call-history',
  label: 'LEAD_PROFILE.TABS.CALL_HISTORY',
  permissions: permissions.CALL_HISTORY.LIST,
}, {
  url: 'callbacks',
  label: 'LEAD_PROFILE.TABS.CALLBACKS',
  permissions: permissions.LEAD_PROFILE.CALLBACKS_LIST,
}, {
  label: 'LEAD_PROFILE.TABS.NOTES',
  url: 'notes',
}, {
  label: 'LEAD_PROFILE.TABS.FEEDS',
  url: 'feeds',
}];

export { leadTabs };
