import keyMirror from 'keymirror';

const mapResponseErrorToField = {
  'already-exists': 'name',
};

const aggregators = keyMirror({
  igromat: null,
  microgaming: null,
  netent: null,
  softgamings: null,
  oryx: null,
});

export {
  aggregators,
  mapResponseErrorToField,
};
