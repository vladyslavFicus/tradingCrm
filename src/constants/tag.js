import keyMirror from 'keymirror';

const tagTypes = keyMirror({
  NOTE: null,
  TAG: null,
});

const tagTypeColors = {
  [tagTypes.NOTE]: 'color-info',
  [tagTypes.TAG]: 'color-success',
};

const tagTypeLetterProps = {
  [tagTypes.NOTE]: {
    color: 'blue',
    letter: 'N',
  },
  [tagTypes.TAG]: {
    color: 'green',
    letter: 'T',
  },
};

export {
  tagTypes,
  tagTypeColors,
  tagTypeLetterProps,
};
