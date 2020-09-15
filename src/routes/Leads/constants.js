import keyMirror from 'keymirror';

const statuses = keyMirror({
  NEW: null,
  NEVER_ANSWER: null,
  VOICE_MAIL: null,
  CONVERTED: null,
});

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

export {
  statuses,
  leadStatuses,
};
