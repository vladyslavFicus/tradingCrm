import I18n from '../../utils/fake-i18n';

const leadStatuses = {
  NEW: {
    label: I18n.t(I18n.t('LEADS.STATUSES.NEW')),
    color: 'color-info',
  },
  NEVER_ANSWER: {
    label: I18n.t('LEADS.STATUSES.NEVER_ANSWER'),
    color: 'color-danger',
  },
  VOICE_MAIL: {
    label: I18n.t('LEADS.STATUSES.VOICE_MAIL'),
    color: 'color-warning',
  },
  CONVERTED: {
    label: I18n.t('LEADS.STATUSES.CONVERTED'),
    color: 'color-success',
  },
};

const leadProfileTabs = [{
  label: I18n.t('LEAD_PROFILE.TABS.PROFILE'),
  url: '/leads/:id/profile',
}];

const fileConfig = {
  maxSize: 20,
  types: [
    // We should use exactly (not mime-type) .csv extension (because mime-type isn't recognized on Windows OS)
    '.csv',
  ],
};

export {
  leadStatuses,
  fileConfig,
  leadProfileTabs,
};
