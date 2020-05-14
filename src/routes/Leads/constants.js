import { statuses } from 'constants/leads';

const leadStatuses = {
  [statuses.NEW]: {
    label: 'LEADS.STATUSES.NEW',
    color: 'color-info',
  },
  [statuses.NEVER_ANSWER]: {
    label: 'LEADS.STATUSES.NEVER_ANSWER',
    color: 'color-danger',
  },
  [statuses.VOICE_MAIL]: {
    label: 'LEADS.STATUSES.VOICE_MAIL',
    color: 'color-warning',
  },
  [statuses.CONVERTED]: {
    label: 'LEADS.STATUSES.CONVERTED',
    color: 'color-success',
  },
};

const leadAccountStatuses = {
  [statuses.CONVERTED]: {
    label: 'LEADS.STATUSES.CONVERTED',
    value: statuses.CONVERTED,
  },
  [statuses.NEW]: {
    label: 'LEADS.STATUSES.NEW',
    value: statuses.NEW,
  },
};

const leadProfileTabs = [{
  label: 'LEAD_PROFILE.TABS.PROFILE',
  url: '/leads/:id/profile',
}, {
  label: 'LEAD_PROFILE.TABS.NOTES',
  url: '/leads/:id/notes',
}];

const fileConfig = {
  maxSize: 10,
  types: [
    // We should use exactly (not mime-type) .csv extension (because mime-type isn't recognized on Windows OS)
    '.csv',
  ],
};

export {
  leadStatuses,
  leadAccountStatuses,
  fileConfig,
  leadProfileTabs,
};
