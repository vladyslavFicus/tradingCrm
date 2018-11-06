import keyMirror from 'keymirror';

const entities = keyMirror({
  OPERATOR: null,
  PROFILE: null,
  BONUS: null,
  PAYMENT: null,
});

const entitiesPrefixes = {
  [entities.OPERATOR]: 'OP',
  [entities.PROFILE]: 'PL',
  [entities.BONUS]: 'BM',
  [entities.PAYMENT]: 'TA',
};

export {
  entities,
  entitiesPrefixes,
};
