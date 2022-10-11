import keyMirror from 'keymirror';

const statuses = keyMirror({
  NEW: null,
  CONVERTED: null,
});

const leadStatuses = {
  [statuses.NEW]: 'LEADS.STATUSES.NEW',
  [statuses.CONVERTED]: 'LEADS.STATUSES.CONVERTED',
};

export {
  statuses,
  leadStatuses,
};
