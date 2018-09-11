import keyMirror from 'keymirror';

const tagTypes = keyMirror({
  NOTE: null,
  TAG: null,
});

const tagTypeColors = {
  [tagTypes.NOTE]: 'color-info',
  [tagTypes.TAG]: 'color-success',
};

export {
  tagTypes,
  tagTypeColors,
};
