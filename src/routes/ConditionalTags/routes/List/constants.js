import keyMirror from 'keymirror';

const actions = keyMirror({
  DISABLE: null,
});

const actionsColorNames = {
  [actions.DISABLE]: 'color-red',
};

const statuses = keyMirror({
  DISABLED: null,
  ACTIVE: null,
});

const statusesColorNames = {
  [statuses.DISABLED]: 'color-default',
  [statuses.ACTIVE]: 'color-success',
};

export {
  statuses,
  actionsColorNames,
  actions,
  statusesColorNames,
};
