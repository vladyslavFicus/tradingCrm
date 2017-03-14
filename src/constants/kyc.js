import keyMirror from 'keymirror';

const statuses = keyMirror({
  VERIFY: null,
  REFUSE: null,
});

const types = keyMirror({
  PERSONAL: null,
  ADDRESS: null,
});

const statusesLabels = {
  [statuses.VERIFY]: 'Verify',
  [statuses.REFUSE]: 'Completed',
};

export {
  statuses,
  types,
  statusesLabels,
};
