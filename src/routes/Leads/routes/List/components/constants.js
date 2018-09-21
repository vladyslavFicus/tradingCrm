const leadsSizePerQuery = 10;

const leadStatuses = {
  NEW: {
    label: 'LEADS.STATUSES.NEW',
    color: 'color-info',
  },
  NEVER_ANSWER: {
    label: 'LEADS.STATUSES.NEVER_ANSWER',
    color: 'color-danger',
  },
  VOICE_MAIL: {
    label: 'LEADS.STATUSES.VOICE_MAIL',
    color: 'color-warning',
  },
  CONVERTED: {
    label: 'LEADS.STATUSES.CONVERTED',
    color: 'color-success',
  },
};

const fileConfig = {
  maxSize: 20,
  types: ['text/csv'],
};

export {
  fileConfig,
  leadStatuses,
  leadsSizePerQuery,
};
