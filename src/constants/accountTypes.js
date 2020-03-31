import keyMirror from 'keymirror';

const accountTypesLabels = {
  DEMO: {
    label: 'CONSTANTS.ACCOUNT_TYPE.DEMO',
  },
  LIVE: {
    label: 'CONSTANTS.ACCOUNT_TYPE.LIVE',
  },
};

const accountTypes = [{
  label: 'CONSTANTS.ACCOUNT_TYPE.DEMO',
  value: 'DEMO',
}, {
  label: 'CONSTANTS.ACCOUNT_TYPE.LIVE',
  value: 'LIVE',
}];

const leverageStatuses = keyMirror({
  PENDING: null,
  COMPLETED: null,
  CANCELED: null,
  REJECTED: null,
  FAILED: null,
});

const leverageStatusesColor = {
  [leverageStatuses.PENDING]: 'color-info',
  [leverageStatuses.COMPLETED]: 'color-success',
  [leverageStatuses.FAILED]: 'color-danger',
  [leverageStatuses.COMPLETED]: 'color-warning',
  [leverageStatuses.REJECTED]: 'color-danger',
};

export {
  accountTypesLabels,
  accountTypes,
  leverageStatusesColor,
};
