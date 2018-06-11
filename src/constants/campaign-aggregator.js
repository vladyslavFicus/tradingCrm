import keyMirror from 'keymirror';

const sourceTypes = keyMirror({
  PROMOTION: null,
  CAMPAIGN: null,
});
const playerStatuses = keyMirror({
  VIEW: null,
  OPT_IN: null,
});

export {
  sourceTypes,
  playerStatuses,
};
