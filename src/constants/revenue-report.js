import keyMirror from 'keymirror';

const types = keyMirror({
  PLAYER: null,
  COUNTRY: null,
});
const typesLabels = {
  [types.PLAYER]: 'Player',
  [types.COUNTRY]: 'Country',
};

export {
  types,
  typesLabels,
};
