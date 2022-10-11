import keyMirror from 'keymirror';

const accountTypesLabels: Record<string, { label: string }> = {
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

export {
  accountTypesLabels,
  accountTypes,
  leverageStatuses,
};
