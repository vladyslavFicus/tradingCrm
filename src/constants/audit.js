import keyMirror from 'keymirror';

const types = keyMirror({
  PLAYER_LOG_IN: null,
  PLAYER_LOG_OUT: null,
});

const typesLabels = {
  [types.PLAYER_LOG_IN]: 'Player - logged in',
  [types.PLAYER_LOG_OUT]: 'Player - logged out',
};

const typesClassNames = {
  [types.PLAYER_LOG_IN]: 'color-primary font-weight-700',
  [types.PLAYER_LOG_OUT]: 'color-black font-weight-700',
};

export {
  types,
  typesLabels,
  typesClassNames,
};
