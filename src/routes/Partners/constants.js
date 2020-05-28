import keyMirror from 'keymirror';

const statuses = keyMirror({
  ACTIVE: null,
  CLOSED: null,
  INACTIVE: null,
});

const statusLabels = {
  [statuses.ACTIVE]: 'PARTNERS.STATUSES.ACTIVE',
  [statuses.CLOSED]: 'PARTNERS.STATUSES.CLOSED',
  [statuses.INACTIVE]: 'PARTNERS.STATUSES.INACTIVE',
};

export {
  statuses,
  statusLabels,
};
