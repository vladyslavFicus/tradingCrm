import keyMirror from 'keymirror';

const types = keyMirror({
  PLAYER_LOG_IN: null,
  PLAYER_LOG_OUT: null,
  PLAYER_PROFILE_REGISTERED: null,
  PLAYER_PROFILE_CHANGED: null,
});

const typesLabels = {
  [types.PLAYER_LOG_IN]: 'Player - logged in',
  [types.PLAYER_LOG_OUT]: 'Player - logged out',
  [types.PLAYER_PROFILE_REGISTERED]: 'Registration',
  [types.PLAYER_PROFILE_CHANGED]: 'Personal details change',
};

const typesClassNames = {
  [types.PLAYER_LOG_IN]: 'feed-item_info-status__blue',
  [types.PLAYER_LOG_OUT]: '',
  [types.PLAYER_PROFILE_REGISTERED]: 'feed-item_info-status__blue',
  [types.PLAYER_PROFILE_CHANGED]: 'feed-item_info-status__green',
};

export {
  types,
  typesLabels,
  typesClassNames,
};
