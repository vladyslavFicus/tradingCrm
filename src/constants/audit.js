import keyMirror from 'keymirror';

const types = keyMirror({
  PLAYER_LOG_IN: null,
  PLAYER_LOG_OUT: null,
  PLAYER_PROFILE_REGISTRY: null,
  PLAYER_PROFILE_CHANGED: null,
});

const typesLabels = {
  [types.PLAYER_LOG_IN]: 'Player - logged in',
  [types.PLAYER_LOG_OUT]: 'Player - logged out',
  [types.PLAYER_PROFILE_REGISTRY]: 'Registration',
  [types.PLAYER_PROFILE_CHANGED]: 'Personal details change',
};

const typesClassNames = {
  [types.PLAYER_LOG_IN]: 'text-info font-weight-700',
  [types.PLAYER_LOG_OUT]: 'text-black font-weight-700',
  [types.PLAYER_PROFILE_REGISTRY]: 'text-primary font-weight-700',
  [types.PLAYER_PROFILE_CHANGED]: 'text-success font-weight-700',
};

export {
  types,
  typesLabels,
  typesClassNames,
};
