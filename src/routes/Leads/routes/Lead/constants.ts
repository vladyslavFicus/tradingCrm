import permissions from 'config/permissions';

const leadTabs = [{
  label: 'LEAD_PROFILE.TABS.PROFILE',
  url: '/leads/:id/profile',
}, {
  url: '/leads/:id/call-history',
  label: 'LEAD_PROFILE.TABS.CALL_HISTORY',
  permissions: permissions.CALL_HISTORY.LIST,
}, {
  url: '/leads/:id/callbacks',
  label: 'LEAD_PROFILE.TABS.CALLBACKS',
  permissions: permissions.LEAD_PROFILE.CALLBACKS_LIST,
}, {
  label: 'LEAD_PROFILE.TABS.NOTES',
  url: '/leads/:id/notes',
}, {
  label: 'LEAD_PROFILE.TABS.FEEDS',
  url: '/leads/:id/feeds',
}];

export { leadTabs };
